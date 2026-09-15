# FixHome API Reference: Support Cases & Admin Operations

**Scope:** Service Manager Exception Handling, Admin Governance, System Configuration, Audit Logging & Finance Operations.  
**Specification Version:** v1.4 / SEP-21 Dev2  
**Base URL:** `/api/v1`

---

## 1. Role & Permission Separation (RBAC)

FixHome enforces a strict separation between **Service Manager** (operational dispute & exception handling) and **Admin** (system-wide governance and catalog authority):

| Domain | Service Manager Authority | Admin Authority |
|---|---|---|
| **Support Cases & Disputes** | Manage queue, review evidence, resolve disputes (`SM` scoped) | View all cases, handle bounded escalations |
| **Technician KYC** | Read-only / verification check | Review, Approve, Reject with signed private storage access |
| **Service & Part Catalog** | Read catalog for troubleshooting | Create, update, toggle active status, manage base pricing |
| **System Configuration** | Read active parameters | Update config registry, define operational thresholds |
| **Audit Logs** | Not authorized | Full read access to operational audit trail |
| **Finance & Platform Dues** | Resolve cash discrepancies (disputes) | Audit platform dues, review payment transactions |

---

## 2. Support Cases (Service Manager Operations)

### 2.1 List Support Cases
- **Endpoint:** `GET /api/v1/support-cases`
- **Roles Allowed:** `SERVICE_MANAGER`, `ADMIN`
- **Query Parameters:**
  - `status?: SupportCaseStatus` (`OPEN`, `INVESTIGATING`, `RESOLVED`, `CLOSED`, `ESCALATED`)
  - `type?: SupportCaseType` (`CANCELLATION_DISPUTE`, `CASH_DISPUTE`, `WARRANTY_CLAIM`, `COMPLAINT`, `DISPATCH_ISSUE`)
  - `serviceOrderId?: string` (UUID)
  - `page?: number` (default 1)
  - `limit?: number` (default 10)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Support cases retrieved successfully",
    "data": [
      {
        "id": "uuid",
        "serviceOrderId": "uuid",
        "caseType": "CASH_DISPUTE",
        "status": "OPEN",
        "priority": "HIGH",
        "title": "Chênh lệch tiền mặt thanh toán tại chỗ",
        "description": "Thợ khai nhận 350.000đ nhưng khách báo đã nộp 400.000đ",
        "disputedAmount": 50000,
        "assignedToId": "uuid",
        "createdAt": "2026-09-16T00:00:00.000Z",
        "updatedAt": "2026-09-16T00:00:00.000Z"
      }
    ],
    "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
  }
  ```

### 2.2 Get Support Case Detail
- **Endpoint:** `GET /api/v1/support-cases/:id`
- **Roles Allowed:** `SERVICE_MANAGER`, `ADMIN`
- **Response `200 OK`:** Includes full case context, associated Service Order, technician profile, customer details, and evidence links.

### 2.3 Resolve Support Case
- **Endpoint:** `POST /api/v1/support-cases/:id/resolve`
- **Roles Allowed:** `SERVICE_MANAGER`, `ADMIN`
- **Payload (`ResolveSupportCaseDto`):**
  ```json
  {
    "resolution": "SETTLED_WITH_CUSTOMER",
    "resolutionNotes": "Đã đối chiếu lịch sử trao đổi và thống nhất chấp nhận mức 400.000đ. Đã cập nhật khoản phải thu PlatformDue tương ứng.",
    "adjustedGrandTotal": 400000,
    "disposition": "CLOSE_CASE"
  }
  ```
- **Behavior:** Resolves the case, updates financial records if cash dispute, writes immutable record into `AuditLog`.

### 2.4 Escalate Support Case
- **Endpoint:** `POST /api/v1/support-cases/:id/escalate`
- **Roles Allowed:** `SERVICE_MANAGER`
- **Payload:** `{ "reason": "Cần Admin phê duyệt mức bồi thường vượt thẩm quyền" }`

---

## 3. Admin Governance & Catalogs

### 3.1 FixHome Part Catalog (`/api/v1/admin/parts-catalog`)
Lightweight catalog for replacement parts and supplies. Strictly catalog metadata, pricing, and warranty (no warehouse management/WMS).

- **Endpoints:**
  - `GET /api/v1/admin/parts-catalog` — List catalog parts with search, pagination, category filtering.
  - `POST /api/v1/admin/parts-catalog` — Create catalog part.
  - `PATCH /api/v1/admin/parts-catalog/:id` — Update part details, price, or warranty months.
  - `PATCH /api/v1/admin/parts-catalog/:id/status` — Soft activate/deactivate part.
- **DTO `CreateFixhomePartDto`:**
  ```json
  {
    "sku": "FH-BOARD-X",
    "name": "Bo mạch điều khiển biến tần Inverter X",
    "categoryId": "uuid",
    "unit": "cái",
    "sellingPrice": 450000,
    "warrantyMonths": 6,
    "description": "Bo mạch chính hãng thay thế cho máy lạnh Daikin/Panasonic"
  }
  ```

### 3.2 System Configuration Registry (`/api/v1/admin/system-configs`)
Centralized registry for operational and business thresholds. Categorized by effectivity (`ACTIVE`, `PENDING_WIRING`, `STALE_REVIEW`).

- **Endpoints:**
  - `GET /api/v1/admin/system-configs` — List all configurations with metadata and status.
  - `GET /api/v1/admin/system-configs/:key` — Get config by key.
  - `PATCH /api/v1/admin/system-configs/:key` — Update config value (`UpdateConfigDto`).
- **Standard System Keys:**
  - `PLATFORM_COMMISSION_RATE_DEFAULT` — e.g. `0.10` (10%)
  - `MAX_ACTIVE_DISPATCH_PER_TECH` — e.g. `2`
  - `BOOKING_AUTO_CANCEL_MINUTES` — e.g. `15`
  - `WARRANTY_DEFAULT_DAYS` — e.g. `30`

### 3.3 Operational Audit Log (`/api/v1/admin/audit-logs`)
Append-only operational audit logging sensitive mutations across the platform.

- **Endpoint:** `GET /api/v1/admin/audit-logs`
- **Roles Allowed:** `ADMIN`
- **Query Parameters:** `actorId`, `action`, `entityType`, `entityId`, `from`, `to`, `page`, `limit`
- **Audited Events:**
  - `KYC_VERIFICATION_APPROVED`, `KYC_VERIFICATION_REJECTED`
  - `USER_STATUS_UPDATED`, `USER_ROLE_CHANGED`
  - `CONFIG_VALUE_UPDATED`
  - `PART_CATALOG_CREATED`, `PART_CATALOG_MODIFIED`
  - `SUPPORT_CASE_RESOLVED`, `CASH_DISPUTE_ADJUSTED`

---

## 4. Technician KYC Verification & Signed Storage

### 4.1 Security & Media Architecture
- KYC media (CCCD front, CCCD back, selfie face photo) are stored in **Private Supabase Storage**.
- Public direct access is strictly blocked (`fail-closed`).
- Endpoints return **short-lived signed URLs** only to:
  - The technician who submitted them (`OWNER`).
  - System `ADMIN` conducting the verification.

### 4.2 Admin Review Flow
- **Endpoint:** `POST /api/v1/admin/technician-verifications/:id/review`
- **Roles Allowed:** `ADMIN`
- **Payload (`ReviewVerificationDto`):**
  ```json
  {
    "status": "VERIFIED", // or "REJECTED"
    "rejectionReason": null
  }
  ```
- **Sync Behavior:**
  - Sets `TechnicianVerification.status = VERIFIED`.
  - Automatically synchronizes `TechnicianProfile.verificationStatus = VERIFIED`.
  - Emits immutable `AuditLog` entry.

---

## 5. Finance Foundation & Platform Dues

### 5.1 Cash Settlement Handshake
When payment method is `CASH`:
1. Technician records collected amount: `POST /api/v1/finance/cash-settlement/declare`
   - Sets settlement status to `PENDING_CONFIRMATION`.
2. Customer confirms received amount: `POST /api/v1/finance/cash-settlement/confirm`
   - If confirmed: `status = CONFIRMED`.
   - If discrepancy: customer or system flags conflict -> routes to `SupportCase` (`CASH_DISPUTE`).
3. Service Manager investigates and resolves via `/api/v1/support-cases/:id/resolve`.

### 5.2 Platform Due Calculation
- Platform due is generated upon cash confirmation:
  $$\text{PlatformDue} = \text{LaborTotal} \times \text{PlatformCommissionRate}$$
- Unpaid platform dues with `status = PENDING` block technician eligibility for new job assignments (`technicianEligibility` gatekeeper).
