# FixHome API — Parts Catalog, Requests, Quotations & Additional Costs

Status: IMPLEMENTED. Live PostgreSQL migration/E2E verification is BLOCKED in the
2026-09-24 audit: PostgreSQL is unavailable at `127.0.0.1:5432`.

FixHome does not implement full warehouse or inventory management.
Scope: catalog metadata, requests, QR handover and USED/RETURNED history.
No stock balances/movements, suppliers, purchase orders or procurement.

## 1. Roles and catalog

Base path: `/api/v1`; Bearer JWT required. Existing response envelope:
`{ success, statusCode, message, data, meta? }`. Wire enums are lowercase.

| Actor | Permissions |
| --- | --- |
| Admin | Catalog CRUD/active status; request history read-only |
| Service Manager | Catalog read; request operations and handover |
| Technician | Current assigned order and own requests only |
| Customer | Own order request history and financial approvals only |

Reuse `PartsCatalogModule`, `FixHomePart`, `AdminPartsPage`.

| Method | Endpoint | Access |
| --- | --- | --- |
| GET/POST | `/admin/parts` | Admin list/create |
| GET/PATCH | `/admin/parts/:id` | Admin detail/edit |
| PATCH | `/admin/parts/:id/status` | Admin; body `{ isActive }` |
| GET | `/parts/catalog` | Technician/SM/Admin, active only |
| GET | `/parts/catalog/:id` | Technician/SM/Admin, active detail |

Fields: `sku`, `name`, `description`, `sellingPrice`, `warrantyDays`,
`warrantyPolicy`, `isActive`. Catalog query uses `page`, `limit`, `search`.
Admin retains `service:manage`; catalog readers retain `service:read`.
New FixHome cost items use IDs from `fixhome_parts` through `/parts/catalog`.
Legacy `/parts` IDs are not accepted for new request-linked costs.

## 2. Parts Request API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/service-orders/:orderId/part-requests` | Assigned Technician; ACCEPTED order |
| GET | `/service-orders/:orderId/part-requests` | Authorized order history |
| GET | `/part-requests` | Admin/SM list; Technician restricted to own current assignments |
| GET | `/part-requests/:id` | Authorized detail, including Customer ownership check |
| PATCH | `/part-requests/:id/ready` | SM prepares and generates QR |
| PATCH | `/part-requests/:id/delivering` | SM dispatches delivery |
| PATCH | `/part-requests/:id/qr` | SM rotates unreceived QR |
| POST | `/part-requests/:id/receive` | Assigned request owner submits `{ qrToken }` |
| PATCH | `/part-requests/:id/items/:itemId/usage` | Assigned request owner submits `{ usageStatus: "used" or "returned" }` |
| PATCH | `/part-requests/:id/cancel` | SM before receipt; Technician only REQUESTED; optional `{ reason }` |

Create body: `items: [{ partCatalogId, quantity, note? }]`, optional
`fulfillmentMethod: "pickup" | "delivery"` and `reason`. Backend snapshots
active catalog name/price. No client price or final-total fields are accepted.

List filters: `status`, `technicianId`, `serviceOrderId`, `requestType`,
`fulfillmentMethod`, `createdFrom`, `createdTo`, `search`, `page`, `pageSize`.
Dates are inclusive ISO timestamps. Search matches request/order/Technician IDs
and item names. Default page size 20, maximum 100; `meta.total` counts all matches.
Web filters execute on the server before pagination.

## 3. States, QR and usage

```text
PICKUP:   REQUESTED -> READY -> RECEIVED -> COMPLETED
DELIVERY: REQUESTED -> READY -> DELIVERING -> RECEIVED -> COMPLETED
SM cancellation: REQUESTED / READY / DELIVERING -> CANCELLED
Technician cancellation: REQUESTED -> CANCELLED
```

Delivery cannot skip DELIVERING; terminal states cannot reopen. Service Order
states remain separate. Order cancellation cascades to active requests; order
completion closes received requests. Mutations lock the Service Order before
the request; item relation reads do not lock nullable joins.

QR tokens are cryptographically random, expire after 48 hours and are cleared
on receipt/cancellation. Only SM responses expose them. Technician/Customer
must obtain the token at handover, not through their request read API.
Web generates QR locally with `qrcode`, without sending tokens to a third party.
SM can rotate a READY/DELIVERING QR, immediately invalidating the old token.

Receipt validates active order/current assignment, request owner, fulfillment
state, token and issue time in a transaction, preventing duplicate receipt.
Item usage is `pending | used | returned`; updates cannot reset to PENDING.
Usage requires RECEIVED and UNDER_REPAIR. Completion requires all active requests
received and all items resolved. Completion request freezes usage with the invoice.

## 4. Quotations, Additional Costs and billing

Reuse existing quotation/additional-cost modules and approval records.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST/GET | `/service-orders/:id/quotations` | Create/read quotations |
| GET | `/quotations/:id` | Authorized detail |
| POST | `/quotations/:id/decision` | Customer APPROVE/REJECT |
| POST/GET | `/service-orders/:id/additional-costs` | Create/read additional costs |
| POST | `/additional-costs/:id/decision` | Customer APPROVE/REJECT |
| POST | `/additional-costs/:id/revise` | Technician revision of non-approved cost |

Cost items use `type`, `description`, `quantity`, `unitPrice`, `partSource`,
`partCatalogId` as applicable. Decisions use `action` and optional
`paidWarrantyItemIds`. Backend replaces FixHome price/name/warranty from the
active catalog. Billable prices must be whole VND; null warranty means zero days.

Additional approval and creation of its FixHome request share one transaction.
Failures roll back approval/totals. Labor items never become part requests.
Inactive parts or a no-longer-assigned Technician prevent request creation.

Backend computes the final invoice from approved items capped by received USED
quantities. RETURNED, PENDING, unreceived and unapproved FixHome quantities are
not billed. Each quantity is consumed once: pre-repair quantities match quotation
items; additional quantities match their own approved additional-cost ID.

Approved shipping fee is immutable at dispatch and charged only for received
delivery. `invoices.shipping_fee` is included in grand total/platform dues and
excluded from labor commission. Pre-repair shipping is zero. Pickup or costs
without FixHome parts cannot carry a shipping fee.

## 5. Database and deployment

Existing tables: `fixhome_parts`, `part_requests`, `part_request_items`,
`quotations`, `quotation_items`, `additional_cost_requests`,
`additional_cost_items`. Requests store order/Technician/type/fulfillment/status,
timestamps and optional approved cost ID; items store catalog/name/price snapshots
and usage status.

Migration `1790000000006-PartRequestIntegrity.ts` adds order/Technician/preparer/
cost FKs, item catalog FK, positive quantity and nonnegative price/fee checks,
unique active pre-repair request per order, unique request per approved cost,
creation-date index and invoice shipping fee. It fails on inconsistent historical
rows instead of deleting data or rewriting financial history.
Apply a reviewed TypeORM migration before running this Backend; never use
production synchronization as a substitute.

## 6. Known limitations

- PostgreSQL migrations, concurrent HTTP flows, hosted CI and deployment are
  NOT VERIFIED locally. See the audit report for executed checks.
- QR tokens remain in a restricted database field until handover so SM can
  display them again; they are not stored as hashes.
- Historical issued invoices are preserved; no retroactive charge/refund rewrite.
- Usage is per whole request item quantity; partial usage needs separate items.
- EXTERNAL/Technician-sourced items retain existing quotation/warranty handling
  and are outside FixHome QR request tracking.
- Mobile was not edited or verified. Clients need `/parts/catalog` IDs for new
  FixHome items and must obtain QR tokens from the handover operator.
