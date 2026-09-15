# FixHome — Current Tasks

> Last updated: 2026-09-16 | Phase: Dev 1 Implementation & Audit Complete (Master Spec v1.4)

---

## Current Phase

**Dev 1 Implementation, Security Audit & Core Flow Finalization Complete** — Aligned with **Master Project Specification v1.4** and **DEV1-FIX-REPORT.md**.
All 24 audit tasks have been successfully implemented and tested:
- **Payment Security**: Closed client `PAID` spoofing vulnerability; standardized on **Cash Dual-Confirmation** and Service Manager reconciliation.
- **Chat Scope Cleanup**: Confirmed Chat is **OUT OF DEV 1 SCOPE**; cleanly dropped `chat_messages` and `conversations` tables via migration `1725901000000-DropDev1ChatTables.ts` for clean handover to dedicated developer.
- **Customer Reschedule Flow**: Full UX modal and backend logic (`POST /bookings/:id/reschedule`) before repair start.
- **Technician Withdrawal**: Order return flow (`POST /service-orders/:id/withdraw`) before arrival, auto-retriggering sequential invitation.
- **State Machine D-22**: Strict enforcement (`ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`), GPS geofence arrival check-in, repair evidence gating (`BEFORE` / `AFTER`), and cancellation prevention during active repair.
- **Zero Mock Data**: 100% real API integration across all Customer and Technician web pages.
- **Real Timeline**: Dynamic order progress synchronized with `OrderStatusHistory`.
- **Notifications Module**: Full in-app notification system (unread count, mark read, notification center).
- **Mobile Navigation**: Bottom Navigation Bar for both Customer and Technician on mobile viewports.
- **Quality Gates**: 129 backend unit tests (20 suites) and 14 web unit tests (3 suites) passing, 0 lint warnings/errors, 0 typecheck errors, successful production builds.

---

## Project Health

| Area | Status | Notes |
|------|--------|-------|
| Backend | ✅ Lint (0 w/e), TypeCheck, Build, 129 unit tests pass | Aligned with Spec v1.4; 20 test suites passing |
| Web | ✅ Lint, TypeCheck, 14 unit tests, Vite Build pass | 32+ functional pages, Warm Orange Design System, Mobile bottom nav, Zero mock data |
| Mobile | ✅ Clean & Stable | Quality gate fixes, liquid custom tab bar |
| AI Service | ✅ Adapter API & Advisory Stub | FastAPI service configured with CI quality gates |
| Database | ✅ 14 Migrations Executed | All migrations executed up to `1725901000000-DropDev1ChatTables.ts` |
| Testing | ✅ Comprehensive | 129 backend tests + 14 web tests passing |
| Documentation | ✅ Up-to-date (v1.4) | Master Spec v1.4, Dev1 Plan v1.4, Dev1 Fix Report, API v1.4 Changelog synced |
| CI / DevOps | ✅ Docker & independent CI | Dockerfile + CI workflows |

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
