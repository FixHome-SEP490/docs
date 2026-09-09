# FixHome — Current Tasks

> Last updated: 2026-09-09 | Phase: Member 1 Core Platform / Security / Integration Complete

---

## Current Phase

**Member 1 Core Platform Complete** — Core Platform, Security, Database Baseline, Migrations,
Authentication & JWT Infrastructure, User Profile & Admin Management, Service Catalog,
Technician Verification, Docker Multi-Stage Build, and Response Standardization are all complete
and verified with 83 unit tests and 47 E2E tests passing.

## Project Health

| Area | Status | Notes |
|------|--------|-------|
| Backend | ✅ Lint (0 w/e), TypeCheck, Build, 83 unit + 47 E2E tests pass | Member 1 Core Platform & Security Final Audit: 100% Complete |
| Web | ✅ Lint, TypeCheck, 2 unit tests, Build pass | ESLint and Vitest baseline configured |
| Mobile | ✅ Expo check, Lint, TypeCheck, 2 unit tests pass | SDK 57 CI requires Node 22.13+ |
| AI Service | ✅ Ruff, 2 tests, import/compile/startup pass | Verified locally on Python 3.14; CI targets Python 3.11 |
| Database | ✅ Complete & Migrated | InitialBaseline & ServiceCatalogAndVerification migrations executed |
| Testing | ✅ Comprehensive | 70 unit tests across 10 suites + E2E suite |
| Documentation | ✅ Markdown, links, governance checks pass | Docs-FixHome updated with API specs and schema docs |
| CI / DevOps | ✅ Docker multi-stage & independent CI | Dockerfile + docker-compose + CI workflows |

---

### TASK-007: Implement Booking Module

- **Title**: Customer Booking Creation and Management
- **Requirement**: FR-BOOK-001
- **Actors**: Customer, Service Manager
- **Priority**: HIGH
- **Status**: TODO

- **Dependencies**: TASK-001, TASK-004

---

### TASK-008: Implement Service Order Module

- **Title**: Service Order CRUD with State Machine Integration
- **Requirement**: FR-ORDER-001
- **Actors**: All
- **Priority**: HIGH
- **Status**: TODO

- **Dependencies**: TASK-007, State Machine (already implemented)

---

### TASK-009: Implement AI Diagnosis — Full Provider Integration

- **Title**: Connect Gemini/OpenAI Providers with Real API Calls
- **Requirement**: FR-AI-001
- **Actors**: Customer
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-001 (need authenticated users)
- **Notes**: Provider abstraction already in place; need to implement actual Gemini/OpenAI API calls

---

### TASK-010: Implement Quotation Module

- **Title**: Quotation Creation, Approval, Rejection
- **Requirement**: FR-QUOTE-001
- **Actors**: Technician (create), Customer (approve/reject)
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-008

---

### TASK-011: Implement Technician Assignment

- **Title**: Manual and AI-Recommended Technician Assignment
- **Requirement**: FR-ASSIGN-001, FR-ASSIGN-002
- **Actors**: Service Manager
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-006, TASK-008

---

### TASK-012: Implement Notifications

- **Title**: In-App Notification System
- **Requirement**: FR-NOTIFY-001
- **Actors**: All
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-008

---

### TASK-013: Implement Reviews & Ratings

- **Title**: Post-Service Customer Reviews
- **Requirement**: FR-REVIEW-001
- **Actors**: Customer
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-008

---

### TASK-014: Implement Media Upload (Repair Evidence)

- **Title**: Image Upload for Issue Reports and Repair Evidence
- **Requirement**: FR-MEDIA-001
- **Actors**: Customer, Technician
- **Priority**: MEDIUM
- **Status**: TODO

- **Dependencies**: TASK-001, Cloudinary/Firebase configuration

---

### TASK-015: Implement Dashboard

- **Title**: Admin and Manager Dashboard with Statistics
- **Requirement**: FR-DASH-001
- **Actors**: Admin, Service Manager
- **Priority**: LOW
- **Status**: TODO

- **Dependencies**: TASK-008 (need data to display)

---

### TASK-016: Implement Service Areas / Maps

- **Title**: Service Area Management and Google Maps Integration
- **Requirement**: FR-MAP-001
- **Actors**: Admin
- **Priority**: LOW
- **Status**: TODO

- **Dependencies**: Google Maps API key configuration

---

### TASK-017: Setup Web Lint and Testing Framework

- **Title**: Configure ESLint/OxLint and Vitest for Vue.js Web Project
- **Requirement**: Infrastructure
- **Priority**: MEDIUM
- **Status**: TODO

- **Notes**: Currently no lint or test framework in web project

---

### TASK-018: Setup Mobile Lint and Testing Framework

- **Title**: Configure Lint and Jest/Testing Library for React Native
- **Requirement**: Infrastructure
- **Priority**: MEDIUM
- **Status**: TODO

- **Notes**: Currently no lint or test framework in mobile project

---

### TASK-019: Upgrade Vulnerable Backend and Mobile Dependency Trees

- **Title**: Planned Framework Upgrades for Unresolved npm Advisories
- **Requirement**: Security baseline
- **Priority**: HIGH
- **Status**: TODO

- **Backend audit**: 34 total advisories; 15 affect production dependencies, including 1 critical
- **Mobile audit**: 17 moderate advisories in Expo/React Navigation transitive dependencies
- **Constraint**: Remaining npm fixes require breaking framework changes or have no upstream fix;
  do not use `npm audit fix --force` without a migration and regression-test plan
- **Dependencies**: NestJS major-version migration analysis; Expo/React Navigation upstream releases

---

## Blocked

_No tasks currently blocked._

---

## Recently Completed

### MEMBER1-CORE: Member 1 Core Platform / Security / Integration
- **Completed**: 2026-09-09
- **Audit & Integration Guides**:
  - [MEMBER1-FINAL-AUDIT.md](docs/MEMBER1-FINAL-AUDIT.md): Comprehensive audit report, security review, and quality gate results.
  - [MEMBER1-INTEGRATION.md](docs/MEMBER1-INTEGRATION.md): Integration guide, cross-module contracts for Members 2, 3, 4, and local operations.
- **Summary**:
  - **TASK-001 (Authentication & JWT Infrastructure)**: Implemented registration for Customer & Technician, dual-token JWT (15m access / 7d refresh), refresh token rotation with SHA-256 hash storage in PostgreSQL `refresh_tokens` table, instant revocation on logout/account lock, bcrypt hashing with 10 rounds, `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`.
  - **TASK-002 (Core Entities & Schema)**: Implemented `AccountStatus`, `Role`, `User`, `RefreshToken`, `ServiceCategory`, `Service`, `TechnicianVerification`, `VerificationDocument` entities with strict foreign keys, indexes, and cascades.
  - **TASK-003 (Database Migrations)**: Created and executed `1725888000000-InitialBaseline.ts`, `1725889000000-ServiceCatalogAndVerification.ts`, and `1725890000000-CoreIntegrity.ts` against PostgreSQL with full rollback support.
  - **TASK-004 (Service Catalog)**: Implemented categories and services management with price ranges (`basePrice`, `minPrice`, `maxPrice`), code uniqueness, soft deactivation, public browsing endpoints (`GET /service-categories`, `GET /services`, with `/categories` alias) and administrative CRUD (`/admin/service-categories`, `/admin/services`).
  - **TASK-005 (User Management & RBAC)**: Implemented `GET /users/me`, `PATCH /users/me`, administrative `GET /admin/users` (search, pagination, filters), `GET /admin/users/:id`, and `PATCH /admin/users/:id/status` with token revocation on lock.
  - **TASK-006 (Technician Verification)**: Implemented `POST /technicians/me/verification` (with alias `/technician/verification`), document validation (MIME allowlist `image/jpeg, image/png, image/webp, application/pdf`, max 10MB), `GET /technicians/me/verification` (with alias `/technician/verification/status`), administrative review `GET /admin/technician-verifications`, approve, and reject with mandatory `rejectionReason`.
  - **DevOps & Standards**: Standardized API response format (`{ success, statusCode, message, data }`), standardized exception filter (`{ success: false, statusCode, error: { code, message, details } }`), fail-fast environment validation with `class-validator`, multi-stage Dockerfile (`node:20-alpine`, non-root user `node`), docker-compose configuration.
  - **Testing & Quality Gates**: 83 unit tests across 11 test suites + 47 E2E tests passing with 0 lint warnings and 0 type errors. Ready for Member 2, 3, 4 handover.

### SETUP-003: Repository-Specific AI Governance and CI Quality Gates

- **Completed**: 2026-09-04
- **Summary**:
  - Added repository-specific `docs/AI-TECHNICAL-GUIDE.md` to all six independent repositories
  - Made each root `AGENTS.md` enforce the mandatory analysis/review/validation workflow
  - Completed Backend typecheck and E2E gates, Frontend ESLint/Vitest, Mobile ESLint/Jest/Expo
    compatibility, AI Ruff/import/startup, and Docs Markdown/link/governance validation
  - Audited `FixHome-SEP490` as a legacy integration snapshot and kept active feature ownership in
    the five split repositories
  - Configured CI triggers for `main`, `development`, and the retained `develop` compatibility alias

### SETUP-002: Split Monorepo into Five Independent Repositories

- **Completed**: 2026-09-04
- **Summary**:
  - Verified that Backend, Frontend, Mobile, AI and Docs source files were copied without omissions
  - Assigned database and local PostgreSQL ownership to Backend
  - Added per-repository runtime pins and independent CI configuration
  - Fixed standalone `.env` ignore rules for Frontend and Mobile
  - Fixed Backend OxLint configuration loading and schema reference
  - Fixed deterministic Nest build output and executable health E2E coverage
  - Aligned Mobile native dependencies with Expo SDK 57
  - Added per-repository agent guidance and canonical Docs links
  - Added `REPOSITORY_GUIDE.md` for ownership, setup and coordinated contract changes
  - Identified initial Git publication as the remaining human-owned step

### SETUP-001: Project Audit, Documentation & Governance Setup

- **Completed**: 2026-09-02
- **Summary**:
  - Full repository audit (Backend, Web, Mobile, AI, DB, CI, Docs)
  - Created `AGENTS.md` (root governance)
  - Created `PROJECT_DOCUMENTATION.md` (Single Source of Truth; originally under monorepo `docs/`)
  - Created `AI_DEVELOPMENT_WORKFLOW.md` (mandatory workflow; originally under monorepo `docs/`)
  - Created `CURRENT_TASKS.md` (this file; originally under monorepo `docs/`)
  - Fixed: Missing `data-source.ts` for migration CLI
  - Fixed: Missing `migrations/` directory
  - Verified: All builds pass, all existing tests pass
  - Verified: `.env` files not tracked by git

---

## Open Business Decisions

| ID | Question | Impact | Status |
|----|----------|--------|--------|
| OBD-001 | Online payment / e-wallet integration scope? | Booking flow, Service Order completion | NEED CONFIRMATION |
| OBD-002 | Live GPS tracking vs. status-based tracking? | Mobile, Backend, Realtime requirements | NEED CONFIRMATION |
| OBD-003 | When can Technician update quotation? Does approved quotation become immutable? | Quotation module design | NEED DECISION |
| OBD-004 | Exact additional cost approval flow? | Quotation + Service Order modules | NEED DECISION |
| OBD-005 | Notification delivery method — push, in-app, email, or combination? | Notification module design | NEED DECISION |
| OBD-006 | Exact scope of map functionality — area management only or address autocomplete? | Service Areas module | NEED DECISION |
