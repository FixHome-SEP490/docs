# FixHome — Current Tasks

> Last updated: 2026-09-24 | Phase: Cloudinary Storage Migration, VNPay Integration, Public Tracking & Realtime Chat (Master Spec v2.1)

---

## Current Phase

**Feature Expansion, Storage Migration & Ecosystem Hardening Complete** — Aligned with **Master Project Specification v2.1**.
Recent major enhancements across all 4 platforms (Backend, Web, Mobile, AI):
- **Cloudinary Authenticated Private Storage**: Migrated order evidence and private booking photo storage from Supabase to Cloudinary authenticated storage with time-limited signed URLs (`expires_at`, 5 minutes expiration) and magic-byte MIME validation.
- **VNPay Payment Gateway Integration**: Added redirect payment URL generation (`POST /invoices/:id/vnpay-url`), cryptographic signature verification (HMAC-SHA512), IPN webhook and return URL auto-reconciliation, with automatic invoice and order completion.
- **Public Order Tracking**: Public tracking endpoint (`GET /orders/track?code=...&phone=...`) allowing customers to track order progress and technician live location on a real-time map without login.
- **Technician Service Radius**: Technicians can configure operating radius (`service_radius_km`) from their base address, enforced in candidate discovery and invitation matching.
- **Evidence Deletion**: Added repair evidence deletion (`DELETE /service-orders/:id/evidence/:evidenceId`) with Cloudinary object deletion.
- **Real-time Chat Gateway**: WebSocket Socket.IO messaging gateway between Customer and Technician with mobile thread synchronization, handshake resilience, and auto-reconnect.
- **Mobile Auth & KYC Hardening**: Split registration OTP and password reset flows, added photo reset button, and fixed iOS multi-part binary upload via `XMLHttpRequest`.
- **Quality Gates**: **603 backend unit tests (77 suites)** and **323 web tests (37 suites)** passing (100% green), 0 lint errors, 0 typecheck errors, successful production builds.

---

## Project Health

| Area | Status | Notes |
|------|--------|-------|
| Backend | ✅ 603/603 unit tests pass (77 suites) | 0 lint w/e, 0 typecheck errors, Cloudinary private storage, VNPay integration |
| Web | ✅ 323/323 unit tests pass (37 suites) | 32+ pages, public tracking live map, VNPay return polling, radius picker |
| Mobile | ✅ Clean & Stable | Expo SDK 57, Realtime Chat Socket thread, separate auth OTP/reset screens |
| AI Service | ✅ Adapter API & Advisory Stub | FastAPI service, CI pipeline (pytest, flake8, mypy), YOLO11s + RAG + Qwen2.5-VL |
| Database | ✅ 32 Migrations Executed | PostgreSQL 16, deduplication & unique constraints, service radius |
| Storage | ✅ Cloudinary Private Authenticated | Signed access URLs (5-minute expiration), JPEG/PNG/WebP magic-byte validation |
| Payments | ✅ VNPay + Cash Dual-Confirmation | Automated VNPay reconciliation + server-authoritative cash settlement |
| Testing | ✅ Comprehensive (926 total tests) | 603 backend unit tests + 323 web tests passing (100% green) |
| Documentation | ✅ Up-to-date (v2.1) | Master Spec, API Changelog, Core Migrations, System Ecosystem synced |
| CI / DevOps | ✅ Docker & independent CI | Dockerfiles + GitHub Actions CI workflows across all repos |

---

## Dev 1 Audit & Remediation Tasks (Completed 2026-09-15)

| Task ID | Task Title | Status | Components Modified / Created | Verification |
| :--- | :--- | :---: | :--- | :---: |
| **TASK-01** | **Payment Security** | **COMPLETED** | `Backend: service-orders.service.ts`<br>`Frontend: CustomerOrderDetailPage.vue, TechnicianPlatformDuesPage.vue` | **PASS** (Block client PAID fake) |
| **TASK-02** | **Customer Booking Wizard** | **COMPLETED** | `Backend: bookings.service.ts`<br>`Frontend: NewBookingWizardPage.vue` | **PASS** (5-step booking flow) |
| **TASK-03** | **Customer Reschedule** | **COMPLETED** | `Backend: bookings.service.ts, bookings.controller.ts`<br>`Frontend: CustomerOrderDetailPage.vue, bookings.api.ts` | **PASS** (Slot/date validation) |
| **TASK-04** | **Technician Matching & Invitation** | **COMPLETED** | `Backend: invitations.service.ts`<br>`Frontend: TechnicianInvitationsPage.vue` | **PASS** (Sequential invitations) |
| **TASK-05** | **Technician Withdraw / Trả đơn** | **COMPLETED** | `Backend: service-orders.service.ts`<br>`Frontend: TechnicianJobDetailPage.vue` | **PASS** (Re-dispatching candidate) |
| **TASK-06** | **Order State Machine D-22** | **COMPLETED** | `Backend: service-orders.service.ts, service-order-state-machine.spec.ts` | **PASS** (Strict transitions) |
| **TASK-07** | **Evidence & Image Security** | **COMPLETED** | `Backend: order-evidence-storage.service.ts, service-orders.controller.ts` | **PASS** (BEFORE/AFTER gating) |
| **TASK-08** | **Quotation (Báo giá)** | **COMPLETED** | `Backend: quotations.service.ts`<br>`Frontend: CustomerOrderDetailPage.vue` | **PASS** (Labor/parts breakdown) |
| **TASK-09** | **Additional Cost (Phát sinh)** | **COMPLETED** | `Backend: quotations.service.ts, expire-additional-costs.ts`<br>`Frontend: CustomerOrderDetailPage.vue` | **PASS** (D-11 supersedesId link) |
| **TASK-10** | **FixHome Part vs Tech Part** | **COMPLETED** | `Backend: quotations.service.ts, parts.service.ts, service-orders.service.ts` | **PASS** (Part sourcing distinction) |
| **TASK-11** | **Warranty & Claims** | **COMPLETED** | `Backend: service-orders.service.ts`<br>`Frontend: CustomerWarrantiesPage.vue, orders.api.ts` | **PASS** (Active policy validation) |
| **TASK-12** | **Technician Review (D-09)** | **COMPLETED** | `Backend: reviews.service.ts`<br>`Frontend: CustomerOrderDetailPage.vue` | **PASS** (Single review per order) |
| **TASK-13** | **Notifications Module** | **COMPLETED** | `Backend: notifications.module.ts, service, controller, spec`<br>`Frontend: notifications.api.ts, CustomerNotificationsPage.vue, CustomerLayout.vue` | **PASS** (Unread badge & list) |
| **TASK-14** | **Fix Broken Routes** | **COMPLETED** | `Frontend: CustomerLayout.vue, router/index.ts` (redirect `/app/addresses` to `/app/profile?tab=addresses`) | **PASS** (0 broken routes) |
| **TASK-15** | **Real Order Dynamic Timeline** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue`<br>`Backend: service-orders.service.ts` | **PASS** (OrderStatusHistory) |
| **TASK-16** | **Customer Cancel UX** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue` (Hide cancel when UNDER_REPAIR, prompt Support) | **PASS** (Gated cancel button) |
| **TASK-17** | **Technician Profile & Schedule** | **COMPLETED** | `Frontend: TechnicianProfilePage.vue`<br>`Backend: technicians.service.ts` | **PASS** (Schedule management) |
| **TASK-18** | **Service Area Standardization** | **COMPLETED** | `Frontend: TechnicianProfilePage.vue` (Administrative catalog HCMC/Hanoi) | **PASS** (Eliminated free-text) |
| **TASK-19** | **Mobile Responsive Web** | **COMPLETED** | `Frontend: CustomerLayout.vue, TechnicianLayout.vue` (Bottom Navigation Bar) | **PASS** (Responsive UX) |
| **TASK-20** | **UI/UX Cleanup** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue, TechnicianPlatformDuesPage.vue` | **PASS** (Eliminated jargon) |
| **TASK-21** | **Removal of Raw Alerts/Confirms**| **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue, TechnicianInvitationsPage.vue` | **PASS** (Modal UX) |
| **TASK-22** | **Loading / Error / Empty States** | **COMPLETED** | `Frontend: All Customer & Technician Pages` | **PASS** (Robust edge cases) |
| **TASK-23** | **Security & IDOR Review** | **COMPLETED** | `Backend: Guards, Ownership checks, File mime verification` | **PASS** (5-layer guard chain) |
| **TASK-24** | **Test & Build Verification** | **COMPLETED** | `Backend & Frontend build, lint, typecheck, unit tests` | **PASS** (100% green gates) |

---

## Dev 2 Admin, Service Manager & Shared Foundation Tasks (Completed 2026-09-16)

| Task ID | Task Title | Status | Components Modified / Created | Verification |
| :--- | :--- | :---: | :--- | :---: |
| **D2-00** | **Foundation Review & Audit** | **COMPLETED** | Baseline Spec v1.4 & Code Gap Audit | **PASS** |
| **D2-01** | **Authentication & Seed Repair** | **COMPLETED** | `Backend: JwtStrategy, seed-users.ts`<br>`Frontend: auth.store.ts, client.ts` | **PASS** (Valid UUID v4 demo accounts, decoupled session invalidation) |
| **D2-02** | **JWT / RBAC Enforcement** | **COMPLETED** | `Backend: RolesGuard, PermissionsGuard`<br>`Frontend: router/guards.ts` | **PASS** (Strict 4-role separation, Admin vs Manager boundaries) |
| **D2-03** | **User Management (Admin)** | **COMPLETED** | `Backend: users.controller.ts, users.service.ts`<br>`Frontend: AdminUsersPage.vue, admin-users.api.ts` | **PASS** (User status governance, pagination, audit trail) |
| **D2-04** | **Technician KYC Hardening** | **COMPLETED** | `Backend: technician-verifications, kyc-storage.service.ts`<br>`Frontend: AdminVerifications, FhStatusPill` | **PASS** (Private Supabase Storage, signed access, canonical VERIFIED status) |
| **D2-05** | **Service Category & Catalog** | **COMPLETED** | `Backend: categories, services controllers/services`<br>`Frontend: CatalogManagementPage.vue, catalog.api.ts` | **PASS** (FIXED_PRICE vs INSPECTION_REQUIRED governance) |
| **D2-06** | **Technician Service Pricing** | **COMPLETED** | `Backend: technicians.service.ts (setSkillPricing)`<br>`Frontend: TechnicianProfilePage.vue` | **PASS** (Base price override prevention for FIXED_PRICE) |
| **D2-07** | **FixHome Part Catalog** | **COMPLETED** | `Backend: parts-catalog.module.ts, entities, controllers`<br>`Frontend: AdminPartsPage.vue, admin-parts.api.ts` | **PASS** (Lightweight catalog, pricing & warranty metadata, zero WMS) |
| **D2-08** | **System Business Config** | **COMPLETED** | `Backend: system-config.module.ts, admin-config.controller.ts`<br>`Frontend: AdminConfigPage.vue, admin-config.api.ts` | **PASS** (Config registry with effectivity status classification) |
| **D2-09** | **Operational Audit Log** | **COMPLETED** | `Backend: audit-log.module.ts, admin-audit-log.controller.ts`<br>`Frontend: AdminAuditLogsPage.vue, admin-audit-logs.api.ts` | **PASS** (Append-only audit trail for sensitive Admin/SM actions) |
| **D2-10** | **Server-Authoritative Payment** | **COMPLETED** | `Backend: finance.module.ts, finance.service.ts` | **PASS** (`isOrderPaymentSatisfied` server check, client fake blocked) |
| **D2-11** | **Cash Settlement & Disputes** | **COMPLETED** | `Backend: finance.service.ts (cash-settlement)`<br>`Frontend: SupportCashDetailPage.vue` | **PASS** (Handshake dual-confirmation, mismatch routed to support) |
| **D2-12** | **Platform Due Enforcement** | **COMPLETED** | `Backend: platform-due.entity.ts, technicianEligibility.ts`<br>`Frontend: AdminPlatformDuesPage.vue, TechnicianPlatformDuesPage.vue` | **PASS** (Unpaid dues block technician dispatch eligibility) |
| **D2-13** | **Support Cases (SM Operations)** | **COMPLETED** | `Backend: support-cases.module.ts, controller, service`<br>`Frontend: SupportQueuePage.vue, SupportDetailPage.vue` | **PASS** (Manager dispute resolution queue, escalation, audit logging) |
| **D2-14** | **Admin/Manager Web Real API** | **COMPLETED** | `Frontend: Console Layout, Admin pages, Support pages` | **PASS** (Eliminated mock data, fail-closed operational dashboards) |
| **D2-15** | **Integration & Hardening** | **COMPLETED** | `Backend & Frontend: TypeCheck, vitest (331 backend / 104 frontend tests)` | **PASS** (Complete branch merge into `Truonghoang` with 100% green tests) |

---

## Dev 3 Feature Expansion & Platform Hardening Tasks (Completed 2026-09-24)

| Task ID | Task Title | Status | Components Modified / Created | Verification |
| :--- | :--- | :---: | :--- | :---: |
| **D3-01** | **Cloudinary Media Storage Migration** | **COMPLETED** | `Backend: CloudinaryModule, CloudinaryProvider, order-evidence-storage.service.ts, private-booking-photo-storage.service.ts`<br>`Frontend: media.api.ts, NewBookingWizardPage.vue` | **PASS** (Migrated from Supabase to Cloudinary authenticated upload & 5-minute signed URLs, `cloudinary://evidence/...`) |
| **D3-02** | **Test Mock Isolation Hardening** | **COMPLETED** | `Backend: order-evidence-storage.service.spec.ts` | **PASS** (`vi.clearAllMocks()` prevents `vi.fn()` history leakage; 603/603 backend unit tests pass) |
| **D3-03** | **VNPay Online Payment Integration** | **COMPLETED** | `Backend: vnpay.controller.ts, vnpay.util.ts, finance.service.ts, service-orders.controller.ts`<br>`Frontend: VNPayReturnPage.vue, CustomerOrderDetailPage.vue` | **PASS** (`POST /invoices/:id/vnpay-url`, HMAC-SHA512 checksum, IPN webhook & return redirect, invoice & order auto-completion) |
| **D3-04** | **Public Order Tracking & Live Map** | **COMPLETED** | `Backend: service-orders.controller.ts (track endpoint), service-orders.service.ts`<br>`Frontend: PublicOrderTrackingPage.vue, tracking.api.ts` | **PASS** (`GET /orders/track?code=...&phone=...`, public access without JWT, live map with technician GPS polling) |
| **D3-05** | **Technician Service Radius** | **COMPLETED** | `Backend: Migration 1790000000004-TechnicianServiceRadius.ts, technician-profile.entity.ts, technician-eligibility.ts`<br>`Frontend: TechnicianProfilePage.vue` | **PASS** (KTV configures `service_radius_km` from base address; matching filter respects radius) |
| **D3-06** | **Repair Evidence Deletion** | **COMPLETED** | `Backend: service-orders.controller.ts, order-evidence-storage.service.ts`<br>`Frontend: TechnicianJobDetailPage.vue` | **PASS** (`DELETE /service-orders/:id/evidence/:evidenceId` with Cloudinary object destroy) |
| **D3-07** | **Realtime Chat Gateway & Mobile Sync** | **COMPLETED** | `Backend: messaging.module.ts, messaging.gateway.ts, messaging.controller.ts`<br>`Mobile: messages screen, chat thread composer, socket lifecycle`<br>`Frontend: ChatDrawer.vue` | **PASS** (WebSocket Socket.IO real-time thread, handshake resilience, auto-reconnect) |
| **D3-08** | **Geo Post-2025 Units & Schedule Dedupe** | **COMPLETED** | `Backend: Migration 1790000000003-DedupeAndConstrainScheduleAndAddress.ts, geo.service.ts, seed-users.ts` | **PASS** (Vietnam post-2025 administrative units, unique constraints on schedules & addresses) |

---

## Core Historical Tasks

### TASK-001 through TASK-006: Member 1 Core Platform & Identity
- **Status**: COMPLETED (2026-09-09)
- **Summary**: JWT authentication, refresh token rotation with SHA-256 in PostgreSQL, RBAC, service catalog, technician verification KYC, standardized error responses.

### TASK-007: Customer Booking Module
- **Status**: COMPLETED (Phase 3-4, upgraded in Dev 1)
- **Summary**: Implemented `BookingsService`, candidate discovery, shortlist creation, and reschedule support.

### TASK-008: Service Order State Machine
- **Status**: COMPLETED (Phase 5-7, upgraded in Dev 1)
- **Summary**: D-22 state machine transactions, arrival check-in with GPS geofence, BEFORE/AFTER evidence gating, dual-confirmation cash payment.

### TASK-009: AI Diagnosis Adapter
- **Status**: COMPLETED (Advisory Stub)
- **Summary**: REST endpoints `/ai/diagnoses` and `/ai-diagnosis/analyze` with intelligent fallback advisory stub.

### TASK-010: Quotation & Additional Cost Module
- **Status**: COMPLETED (Phase 6, upgraded in Dev 1)
- **Summary**: Itemized labor/parts quotation, FixHome parts catalog, D-11 immutable additional cost with `supersedesId`.

### TASK-011: Technician Assignment & Invitation
- **Status**: COMPLETED (Phase 4, upgraded in Dev 1)
- **Summary**: Atomic invitation acceptance with PostgreSQL row locking (`pessimistic_write`), sequential candidate dispatching.

### TASK-012: In-App Notifications
- **Status**: COMPLETED (Upgraded in Dev 1)
- **Summary**: Notifications module, unread count endpoint, mark-as-read, Customer notification center.

### TASK-013: Reviews & Ratings (D-09)
- **Status**: COMPLETED (Phase 8)
- **Summary**: Single review enforcement per order, technician rating recalculation.

### TASK-014: Media Upload & Evidence
- **Status**: COMPLETED (Upgraded in Dev 1)
- **Summary**: Repair evidence upload with MIME allowlist and size validation.

### TASK-015: Role Dashboards
- **Status**: COMPLETED (Phase 8, connected to real data in Dev 1)
- **Summary**: Role-tailored dashboards for Customer, Technician, Operations (SM), and System (Admin).

### TASK-016: Standardized Service Areas
- **Status**: COMPLETED (Upgraded in Dev 1)
- **Summary**: Administrative code catalog (HCMC, Hanoi) matching technician coverage.

---

## Open Business Decisions Status

| ID | Topic | Resolution / Current Status | Status |
|----|-------|-----------------------------|--------|
| OBD-001 | Online Payment / Gateway Integration | **Finalized for MVP:** System operates via **Cash Dual-Confirmation** (tiền mặt kèm xác nhận 2 chiều giữa thợ và khách, hoặc đối soát SM). Direct online gateway (VNPay) is ready for integration once merchant credentials are provided. Client fake PAID bypass is completely blocked. | **RESOLVED FOR MVP** |
| OBD-002 | GPS Tracking vs Status Tracking | **Finalized:** Status-based tracking + **GPS Geofence Arrival Check-in** at customer address. Live continuous GPS streaming is excluded from MVP. | **RESOLVED** |
| OBD-003 | Quotation Immutability & Revisions | **Finalized:** Approved base quotation is immutable. Any post-inspection change must use **D-11 Additional Cost Request** with `supersedesId` revision link. | **RESOLVED** |
| OBD-004 | Chat Module Ownership | **Finalized:** Module Chat between Customer & Technician is **OUT OF DEV 1 SCOPE**. All temporary chat tables have been safely dropped via migration `1725901000000-DropDev1ChatTables.ts`. | **RESOLVED** |
| OBD-005 | Notification Delivery Channel | **Finalized:** In-App Notification Center with real-time unread count and read tracking. Push notifications reserved for Mobile phase. | **RESOLVED** |
| OBD-006 | Parts Sourcing & Warranty Model | **Finalized:** FixHome-provided parts (catalog prices, 6-12 months platform warranty) vs Technician-sourced parts (default NO_WARRANTY, optional paid platform warranty). No warehouse inventory tracking in MVP. | **RESOLVED** |
