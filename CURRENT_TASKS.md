# FixHome — Current Tasks

> Last updated: 2026-09-04 | Phase: Polyrepo Foundation Complete

---

## Current Phase

**Polyrepo Foundation Complete** — Project scaffolding is split by ownership and ready for the
first feature work in each owning repository. Feature implementation starts with Authentication
after maintainers configure the `development` branches and required CI branch protection.

## Project Health

| Area | Status | Notes |
|------|--------|-------|
| Backend | ✅ Lint, TypeCheck, Build, 15 unit + 2 E2E tests pass | Standalone setup verified; modules scaffolded |
| Web | ✅ Lint, TypeCheck, 2 unit tests, Build pass | ESLint and Vitest baseline configured |
| Mobile | ✅ Expo check, Lint, TypeCheck, 2 unit tests pass | SDK 57 CI requires Node 22.13+ |
| AI Service | ✅ Ruff, 2 tests, import/compile/startup pass | Verified locally on Python 3.14; CI targets Python 3.11 |
| Database | ⚠️ Foundation fixed | data-source.ts created, migrations dir created, no migrations yet |
| Testing | ⚠️ Baseline | All executable owning repos have a runner; feature coverage remains sparse |
| Documentation | ✅ Markdown, links, governance checks pass | Docs-FixHome is the cross-system source of truth |
| CI | ✅ Independent workflows configured | Five active repos plus legacy snapshot each own CI |

---

## In Progress

_No tasks currently in progress._

---

## TODO — Priority Order

### TASK-001: Implement Authentication (Login + Register)

- **Title**: Authentication — Login and Registration Endpoints
- **Requirement**: FR-AUTH-001
- **Actors**: All (Customer, Technician, Service Manager, Admin)
- **Priority**: CRITICAL
- **Status**: TODO

| Layer | Impact |
|-------|--------|
| Backend | AFFECTED — Implement AuthService (register, login, validateUser, generateToken, hashPassword) |
| Database | AFFECTED — User entity is defined, may need additional fields |
| API | AFFECTED — POST /auth/register, POST /auth/login, GET /auth/profile |
| Web | AFFECTED — Connect LoginPage to real API, implement register page |
| Mobile | AFFECTED — Connect LoginScreen to real API |
| AI | NOT AFFECTED |
| Security | AFFECTED — JWT generation, password hashing with bcrypt |
| Testing | AFFECTED — Auth service unit tests, controller tests, guard tests |

- **Dependencies**: None (foundation task)
- **Blockers**: None
- **Remaining Work**: Full implementation required

---

### TASK-002: Define Core Database Entities

- **Title**: Create TypeORM Entities for Core Modules
- **Requirement**: All FR-*
- **Actors**: N/A (infrastructure)
- **Priority**: CRITICAL
- **Status**: TODO

| Layer | Impact |
|-------|--------|
| Backend | AFFECTED — Create entity files in each module |
| Database | AFFECTED — Define tables: technicians, services, categories, bookings, service_orders, quotations, reviews, notifications, media, service_areas |
| API | NOT AFFECTED (yet) |
| Web | NOT AFFECTED (yet) |
| Mobile | NOT AFFECTED (yet) |
| AI | NOT AFFECTED |
| Security | NOT AFFECTED |
| Testing | AFFECTED — Entity validation tests |

- **Dependencies**: TASK-001 (User entity should be finalized first)
- **Blockers**: None
- **Remaining Work**: Design and create all entity definitions with proper relations

---

### TASK-003: Create Initial Database Migration

- **Title**: Generate and Run First Migration
- **Requirement**: Infrastructure
- **Actors**: N/A
- **Priority**: CRITICAL
- **Status**: TODO

| Layer | Impact |
|-------|--------|
| Backend | AFFECTED — Generate migration from entities |
| Database | AFFECTED — Create tables in PostgreSQL |

- **Dependencies**: TASK-002
- **Blockers**: None
- **Remaining Work**: Generate migration after entities are defined, verify it runs cleanly

---

### TASK-004: Implement Service Catalog (Categories + Services)

- **Title**: CRUD for Service Categories and Services
- **Requirement**: FR-SERVICE-001, FR-SERVICE-002
- **Actors**: Admin (manage), All (view)
- **Priority**: HIGH
- **Status**: TODO

| Layer | Impact |
|-------|--------|
| Backend | AFFECTED — Implement CategoriesService, ServicesService with CRUD |
| Database | AFFECTED — categories, services tables |
| API | AFFECTED — GET/POST/PATCH/DELETE endpoints |
| Web | AFFECTED — Admin catalog management pages |
| Mobile | AFFECTED — Customer service browsing |
| AI | NOT AFFECTED |
| Security | AFFECTED — RBAC (Admin for write, public for read) |
| Testing | AFFECTED |

- **Dependencies**: TASK-001, TASK-002, TASK-003
- **Blockers**: None

---

### TASK-005: Implement User Management

- **Title**: User Profile and Admin User Management
- **Requirement**: FR-USER-001
- **Actors**: Customer (own profile), Admin (all users)
- **Priority**: HIGH
- **Status**: TODO

- **Dependencies**: TASK-001

---

### TASK-006: Implement Technician Management + Verification

- **Title**: Technician Profiles and Admin Verification
- **Requirement**: FR-TECH-001, FR-TECH-002
- **Actors**: Admin, Technician
- **Priority**: HIGH
- **Status**: TODO

- **Dependencies**: TASK-001, TASK-002

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
