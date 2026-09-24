# Parts Audit + Fix — 2026-09-24

Status: IMPLEMENTED. Release verification is BLOCKED by PostgreSQL availability.
Scope: Backend, Web, Docs and existing CI. Mobile and seeds were not modified.

FixHome does not implement full warehouse or inventory management.
Current contracts: [Parts API](../api/PARTS_AND_QUOTATIONS.md).

## A. Current

Reused PartsCatalogModule/FixHomePart, PartRequestsModule, QuotationsModule,
ServiceOrdersService, invoice/finance records, order authorization, AdminPartsPage,
ConsolePartRequestsPage, TechnicianPartsSection and existing workflows.

## B. Issues Found

| Severity | Location | Issue / impact |
| --- | --- | --- |
| High | PartRequestsService.getById | Customer IDOR exposed unrelated request and QR |
| High | Controller/state machine/Web | Admin could mutate requests despite read-only scope |
| High | Request mutations | Missing current-assignment/order/freeze checks; races with invoicing |
| High | Web QR / read API | Token sent to third-party QR service and exposed to receiver before handover |
| High | ServiceOrdersService.generateInvoice | RETURNED/unreceived parts could be charged |
| High | QuotationsService.decideAdditionalCost | Swallowed creation error left approval without request; labor became phantom parts |
| High | Request lock queries | Pessimistic lock on nullable joins fails in PostgreSQL |
| Medium | State/DTO | Delivery skipped DELIVERING; PENDING reset and invalid filters allowed |
| Medium | Schema | Missing FK/check/unique constraints |
| Medium | Web list | Filters only searched first server page; no pagination controls |
| Medium | Pricing/finance | Mixed catalogs, invented default warranty, mutable shipping fee, missing fee reconciliation |
| Medium | Docs CI | Echo-only checks reported success without validation |
| Medium | Web Node pin | Node 20 did not meet installed transitive engine requirements |

## C. Fixed

Enforced current assignment plus request ownership; Admin request read-only;
SM operations; Customer ownership. Transactions lock order before request and
read items separately. Cancelled/completed/frozen orders reject mutations.

Delivery requires dispatch. QR is single-use, hidden from non-SM reads, generated
locally and rotatable before receipt. Usage is USED/RETURNED during repair;
completion requires resolved requests/items and freezes usage with the invoice.

Final invoice consumes only approved, received USED FixHome quantities once.
Additional request creation is atomic with approval and excludes labor.
Shipping is approved/immutable, billed only for received delivery, included in
platform dues, excluded from labor commission.

## D. Backend Changes

Existing controller/service/DTO/state-machine code handles authorization,
query validation, QR rotation and locks. Quotation items use the same active
FixHome catalog as requests with authoritative whole-VND price and warranty.

New integrity migration adds order/Technician/preparer/cost/catalog FKs, positive
quantity/nonnegative price/fee checks, unique active pre-repair request per order,
unique additional request per approved cost, date index and invoice shipping fee.
Apply migration before running this Backend version; historical inconsistencies
fail explicitly instead of silently deleting or rewriting financial data.

## E. Web Changes

Admin sees read-only request history. SM actions depend on role/status and block
duplicate submission. Filters/pagination run server-side. Load failures and
handover timestamps are shown. QR renders locally with qrcode and supports
rotation. Technician cannot self-fill QR or receive delivery before dispatch.
Existing catalog UI is reused; API types and lockfile updated.

## F. CI/CD

Backend CI already runs npm ci/lint/typecheck/audit/unit/build/PostgreSQL E2E;
kept intact. Web CI already runs npm ci/lint/typecheck/tests/build and now reads
Node 22.22.2 through its existing .nvmrc setting. Docs CI now runs real npm ci,
lint, link and governance gates. Failures remain blocking. No deploy or production
migration was run. Hosted workflows were reviewed, not triggered.

## G. Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Backend lockfile install | PASS | npm ci --no-audit --no-fund |
| Backend lint | PASS | npm run lint; 4 existing warnings outside Parts |
| Backend typecheck | PASS | npm run typecheck |
| Backend targeted tests | PASS | 46 tests / 7 files; includes 4 existing finance tests |
| Backend build | PASS | npm run build |
| Web install | PASS | Initial npm ci; QR dependencies/lockfile updated with npm install |
| Web lint | PASS | npm run lint; zero warnings |
| Web typecheck | PASS | npm run typecheck |
| Web targeted tests | PASS | 17 existing Parts API/route tests / 3 files |
| Web build | PASS | npm run build; existing large-chunk warning |
| PostgreSQL E2E | FAIL | npm run test:e2e; ECONNREFUSED 127.0.0.1:5432, 59 tests skipped |
| Migration execution | NOT VERIFIED | PostgreSQL unavailable |
| Docs global lint | FAIL | Older documents contain heading/fence/spacing violations |
| Docs links / governance | PASS | npm run check:links; npm run validate |
| CI configuration review | PASS | Blocking gates, lockfiles, correct repository roots, no deployment changes |
| Hosted CI / browser QA / Node 22 runtime | NOT VERIFIED | Local checks ran on Node 20.19.5 |

Tests were limited following the user's request for faster completion.
No large UI suite or new E2E framework was added. Reviewed security, state,
financial integrity, API types, transaction order and unchanged module boundaries.
Full regression suites were not run.

## H. Remaining Issues

- E2E/migration need PostgreSQL. Starting the existing Docker service was rejected
  during this session; no application database was modified. Release verification
  remains blocked.
- Global Docs lint reveals existing errors in older specification, implementation,
  inventory and unrelated API documents. These block Docs CI, not Parts builds.
  No lint rules were disabled.
- Node 22 runtime is not locally verified. CI now uses the version required by
  installed dependencies; local Node 20 produced engine warnings during install.
- Historical invoices are preserved. Invalid legacy request/catalog references
  may need reviewed cleanup before applying integrity constraints.
- Legacy clients must use /parts/catalog IDs for new FixHome items. Mobile was
  not modified or verified.
- QR remains stored until handover; usage is per whole line. EXTERNAL/Technician
  parts retain existing approval/warranty behavior outside FixHome QR tracking.
- No fresh npm security-audit result or deployed CI success is claimed.

## I. Git Diff Summary

Paths are relative to their independent repository. No files deleted.

### Backend-FixHome

- Modified: `src/modules/finance/dto/finance.dto.ts`
- Modified: `src/modules/finance/finance.service.ts`
- Modified: `src/modules/part-requests/dto/index.ts`
- Modified: `src/modules/part-requests/part-request-state-machine.ts`
- Modified: `src/modules/part-requests/part-requests.controller.ts`
- Modified: `src/modules/part-requests/part-requests.service.spec.ts`
- Modified: `src/modules/part-requests/part-requests.service.ts`
- Modified: `src/modules/quotations/quotations.service.spec.ts`
- Modified: `src/modules/quotations/quotations.service.ts`
- Modified: `src/modules/service-orders/entities/invoice.entity.ts`
- Modified: `src/modules/service-orders/service-orders.service.ts`
- Added: `src/database/migrations/1790000000006-PartRequestIntegrity.ts`
- Added: `src/modules/part-requests/part-request-lifecycle.ts`
- Added: `src/modules/service-orders/parts-billing.spec.ts`

### Frontend-FixHome

- Modified: `.nvmrc`
- Modified: `docs/AI-TECHNICAL-GUIDE.md`
- Modified: `package-lock.json`
- Modified: `package.json`
- Modified: `src/api/part-requests.api.ts`
- Modified: `src/components/TechnicianPartsSection.vue`
- Modified: `src/pages/console/ConsolePartRequestsPage.vue`

### Docs-FixHome

- Modified: `.github/workflows/ci.yml`
- Modified: `api/PARTS_AND_QUOTATIONS.md`
- Modified: `database/CORE_SCHEMA_MIGRATIONS.md`
- Modified: `package.json`
- Modified: `docs/PARTS_REPAIR_FLOW_IMPLEMENTATION.md`
