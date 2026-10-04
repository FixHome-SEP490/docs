# FixHome — Current Tasks

> Last updated: 2026-10-04 | Phase: Wallet, Google Sign-In, Warranty Visits, Onboarding & AI Chat Sessions (Master Spec v2.2)

---

## Current Phase

**Wallet, Google Sign-In, Warranty Visits, Onboarding & AI Chat Sessions Complete** — Aligned with **Master Project Specification v2.2**.
Recent major enhancements across all 4 platforms (Backend, Web, Mobile, AI):
- **Technician Wallet System**: Internal balance wallet (`wallets`, `wallet_transactions`) with idempotency keys, settlement service for online earning and platform fee deduction, bank account registration, and withdrawal request management.
- **Withdrawal Payout via payOS**: Automated bank transfer payout through payOS integration with states `PENDING → PROCESSING → SUCCESS/REJECTED/FAILED`. Auto-refund on payout failure (`WITHDRAW_REFUND` transaction type). Console Wallets page for SM/Admin management.
- **Google Sign-In Authentication**: OAuth2 identity verification via `GoogleIdentityService` and `GoogleRedirectService`. Users table supports `auth_provider = 'google'` with nullable `password_hash` and `google_id` unique constraint.
- **Technician Onboarding Multi-step Flow**: New `TechnicianOnboardingPage` with `onboarding_status` tracking (`not_started` → complete), step-by-step profile completion including personal info (date_of_birth, gender, citizen_id_number), full address with GPS coordinates.
- **Warranty Lifecycle v2 with Visits**: Complete warranty claim rework with 8-status enum (`submitted → accepted → inspected → in_progress → awaiting_customer → disputed → resolved → rejected`), `warranty_visits` table for on-site inspection with GPS check-in and evidence, SM review with `final_result` and `sm_overrode_proposal`.
- **Support Case Complaint Expansion**: 4 new complaint types (`property_damage`, `quality`, `pricing_dispute`, `conduct`), `is_urgent` flag, `respond_by` deadline. SM can `hold_completion`, assign `liable_party` and compensation `amount`.
- **AI Chat Session Persistence**: `ai_chat_sessions` table stores running summaries of AI conversations, `ai_summary` JSONB field attached to bookings when created from AI flow, `is_automated` flag for system-generated greeting messages.
- **"Other" Catch-all Service Category**: Category `KHAC` + Service `DICH_VU_KHAC` for unlisted repair work, `inspection_required` pricing mode.
- **Database Timezone Standardization**: PostgreSQL session timezone set to `Asia/Ho_Chi_Minh` for all date operations.
- **Customer Notification Bell & Center**: Header icon with unread badge, popover dropdown (All/Unread), auto mark read, polling 30s, full-page notification center (`/app/notifications`) with sender categorization (Technician, SM, Admin, System).

---

## Project Health

| Area | Status | Notes |
|------|--------|-------|
| Backend | ✅ Tests pass, 29 modules | 0 lint w/e, 0 typecheck errors, Cloudinary, VNPay, Wallet, payOS payout, Google Sign-In |
| Web | ✅ Tests pass, 57 pages | Notification Bell, Evidence Lightbox, Wallet, Onboarding, Console Warranty, AI Booking |
| Mobile | ✅ 38 screens, 59 test files | Expo SDK 57, Wallet, Chat, AI Chat, Onboarding |
| AI Service | ✅ Adapter API & Advisory Stub | FastAPI service, CI pipeline (pytest, flake8, mypy), YOLO11s + RAG + Qwen2.5-VL |
| Database | ✅ 48 Migrations Executed | PostgreSQL 16, timezone `Asia/Ho_Chi_Minh`, warranty_visits, wallets, bank_accounts |
| Storage | ✅ Cloudinary Private Authenticated | Signed access URLs (5-minute expiration), JPEG/PNG/WebP magic-byte validation |
| Payments | ✅ VNPay + Cash + Wallet + payOS | VNPay reconciliation, cash settlement, wallet top-up, automated bank payout |
| Testing | ✅ Comprehensive (growing) | Backend unit tests + Web tests + Mobile 59 test files |
| Documentation | ✅ Up-to-date (v2.2) | Master Spec, API Changelog, Core Migrations, System Ecosystem synced |
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

## Dev 4 Notification Center & Evidence Suite Tasks (Completed 2026-09-25)

| Task ID | Task Title | Status | Components Modified / Created | Verification |
| :--- | :--- | :---: | :--- | :---: |
| **D4-01** | **Customer Notification Bell & Dropdown** | **COMPLETED** | `Frontend: NotificationBellDropdown.vue, CustomerLayout.vue, notifications.store.ts` | **PASS** (Red badge unread count, ping animation, popover tabs Tất cả / Chưa đọc, auto mark read on click) |
| **D4-02** | **Customer Notification Center Page** | **COMPLETED** | `Frontend: CustomerNotificationsPage.vue, router/index.ts, notifications.api.ts` | **PASS** (Route `/app/notifications`, search filter, categorization by Thợ / SM / Admin / System, unread toggle) |
| **D4-03** | **Backend Notification Role-Guarded API** | **COMPLETED** | `Backend: notifications.controller.ts, CreateNotificationDto, roles.guard.ts` | **PASS** (`POST /notifications` restricted to ADMIN, SERVICE_MANAGER, TECHNICIAN with DTO validation) |
| **D4-04** | **Auto-dispatch Order Lifecycle Notifications** | **COMPLETED** | `Backend: service-orders.service.ts, service-orders.module.ts` | **PASS** (Non-blocking notify on `TECHNICIAN_EN_ROUTE`, `TECHNICIAN_ARRIVED`, `COMPLETION_REQUESTED`) |
| **D4-05** | **Evidence Gallery with Tabs & Notes** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue, orders.api.ts`<br>`Backend: service-orders.controller.ts (getEvidence)` | **PASS** (Gallery tabs BEFORE/AFTER/ADDITIONAL, technician notes, timestamp display, 0 broken images) |
| **D4-06** | **Lightbox Zoom Modal for Evidence Photos** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue` | **PASS** (Full-screen backdrop blur modal, high-res zoom, evidence type badges, detailed notes) |
| **D4-07** | **Detailed Repair Itemization Breakdown** | **COMPLETED** | `Frontend: CustomerOrderDetailPage.vue` | **PASS** (Labor items table, parts with warranty days, approved additional costs, grand summary box) |
| **D4-08** | **Parts Catalog & Lifecycle Integration** | **COMPLETED** | `Backend: part-requests, seed runner, migration 33`<br>`Frontend: orders.api.ts, quotation flow` | **PASS** (791 items parts catalog dataset, TEST_SCAN token bypass for dev, QR handover lifecycle) |

---

## Dev 5 Wallet, Auth, Warranty & Platform Expansion Tasks (Completed 2026-10-04)

| Task ID | Task Title | Status | Components Modified / Created | Verification |
| :--- | :--- | :---: | :--- | :---: |
| **D5-01** | **Technician Wallet Core** | **COMPLETED** | `Backend: wallet.module.ts, wallet.service.ts, settlement.service.ts, entities/`<br>`Frontend: TechnicianWalletPage.vue, wallet.api.ts`<br>`Mobile: TechnicianWalletScreen.tsx` | **PASS** (Wallet balance, transactions, idempotency, seed 200k VND) |
| **D5-02** | **Withdrawal & Bank Account Registration** | **COMPLETED** | `Backend: bank-account.service.ts, withdrawal-payout.service.ts, technician-wallet.controller.ts`<br>`Frontend: ConsoleWalletsPage.vue` | **PASS** (Bank account CRUD, single pending withdrawal per wallet) |
| **D5-03** | **payOS Automated Payout** | **COMPLETED** | `Backend: withdrawal-payout.service.ts, payout/payout-provider.factory.ts`<br>`Frontend: ConsoleWalletsPage.vue, admin-wallet.controller.ts` | **PASS** (PENDING → PROCESSING → SUCCESS/FAILED, auto-refund on failure) |
| **D5-04** | **Google Sign-In Authentication** | **COMPLETED** | `Backend: google-identity.service.ts, google-redirect.service.ts, auth.controller.ts`<br>`Frontend: LoginPage.vue`<br>`Migration: 1790000000007-GoogleSignIn.ts` | **PASS** (auth_provider='google', password_hash nullable, google_id unique) |
| **D5-05** | **Technician Onboarding Multi-step** | **COMPLETED** | `Backend: technicians.service.ts`<br>`Frontend: TechnicianOnboardingPage.vue`<br>`Mobile: TechnicianOnboardingScreen.tsx`<br>`Migration: 1790000000012-TechnicianOnboardingFields.ts` | **PASS** (onboarding_status, step, DOB, gender, citizen_id, GPS coords) |
| **D5-06** | **Warranty Lifecycle v2 & Claim Reconcile** | **COMPLETED** | `Backend: service-orders.service.ts`<br>`Frontend: CustomerWarrantiesPage.vue, ConsoleWarrantyPage.vue`<br>`Mobile: CustomerWarrantiesScreen.tsx`<br>`Migrations: 1790000000014, 1790000000015` | **PASS** (8-status enum, warranty_visits table, inspection results) |
| **D5-07** | **Warranty Visits & GPS Check-in** | **COMPLETED** | `Backend: service-orders.service.ts`<br>`Frontend: ConsoleWarrantyPage.vue`<br>`Migration: 1790000000015-WarrantyVisits.ts` | **PASS** (scheduled → checked_in → inspected → completed/cancelled) |
| **D5-08** | **SM Review & Manager Override** | **COMPLETED** | `Backend: service-orders.service.ts, support-cases.service.ts`<br>`Frontend: ConsoleWarrantyPage.vue`<br>`Migration: 1790000000016-ManagerReviewFields.ts` | **PASS** (final_result, sm_overrode_proposal, hold_completion, liable_party) |
| **D5-09** | **Support Case Complaint Expansion** | **COMPLETED** | `Backend: support-cases.service.ts`<br>`Frontend: SupportQueuePage.vue, SupportDetailPage.vue, ConsoleCancellationsPage.vue, ConsoleStrikesPage.vue`<br>`Migration: 1790000000013-SupportCaseComplaintFields.ts` | **PASS** (4 new complaint types, is_urgent, respond_by) |
| **D5-10** | **AI Chat Sessions & Automated Messages** | **COMPLETED** | `Backend: ai-diagnosis module`<br>`Frontend: NewBookingWizardPage.vue (AI booking flow)`<br>`Mobile: CustomerAIChatScreen.tsx`<br>`Migration: 1790000000024-AiChatSessionsAndAutomatedMessages.ts` | **PASS** (ai_chat_sessions, ai_summary on bookings, is_automated messages) |
| **D5-11** | **"Other" Catch-all Service Category** | **COMPLETED** | `Backend: Migration 1790000000025-OtherServiceCatalog.ts` | **PASS** (Category KHAC + Service DICH_VU_KHAC, inspection_required) |
| **D5-12** | **Database Timezone Vietnam** | **COMPLETED** | `Backend: Migration 1790000000023-DatabaseTimezoneVietnam.ts` | **PASS** (Asia/Ho_Chi_Minh session default) |
| **D5-13** | **Wallet Top-Up Payment Integration** | **COMPLETED** | `Backend: Migrations 1790000000010, 1790000000011`<br>`Frontend: TechnicianWalletPage.vue` | **PASS** (WALLET_TOP_UP payment purpose enum, target constraints) |
| **D5-14** | **Reset Unfunded Wallets** | **COMPLETED** | `Backend: Migration 1790000000022-ResetUnfundedTechnicianWallets.ts` | **PASS** (Reset ví thợ unfunded) |

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
