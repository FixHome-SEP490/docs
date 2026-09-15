<p align="center">
  <img src="assets/logo.png" alt="FixHome Logo" width="120" />
</p>

<h1 align="center">FixHome — Documentation</h1>

<p align="center">
  <strong>Tài liệu dự án & Hợp đồng kỹ thuật cho nền tảng sửa chữa & bảo trì tại nhà FixHome</strong>
</p>

---

## Key Documents (Tài liệu Trọng tâm v1.4)

- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) — **Single Source of Truth** (Đặc tả tổng quan kiến trúc & hệ thống)
- [Master Project Specification v1.4](docs/FIXHOME-Master-Project-Specification-v1.4.md) — Tài liệu nghiệp vụ & kỹ thuật chuẩn nhóm (Baseline hiện tại)
- [Dev 1 Implementation Plan v1.4](docs/FIXHOME-DEV1-IMPLEMENTATION-PLAN-v1.4.md) — Kế hoạch thực thi & bàn giao chi tiết của Dev 1
- [Dev 1 Fix & Audit Report](docs/DEV1-FIX-REPORT.md) — Báo cáo nghiệm thu 24 task sửa lỗi, dọn dẹp Chat và kiểm thử Dev 1
- [API v1.4 Changelog](docs/API_V1_4_CHANGELOG.md) — Hợp đồng API v1.4 (Reschedule, Withdraw, Cash Dual-Confirmation, Notifications, Parts...)
- [Database v1.4 Migrations](docs/DATABASE_V1_4_MIGRATION_PLAN.md) — Kế hoạch & cấu trúc 14 migration TypeORM trong PostgreSQL
- [Test Coverage v1.4](docs/TEST_COVERAGE_V1_4.md) — Báo cáo chất lượng (129 Backend tests + 14 Web tests passing 100%)
- [CURRENT_TASKS.md](CURRENT_TASKS.md) — Trạng thái dự án, danh sách task hoàn thành và backlog
- [REPOSITORY_GUIDE.md](REPOSITORY_GUIDE.md) — Bản đồ repo và hướng dẫn setup local
- [AGENTS.md](AGENTS.md) — Hướng dẫn cho AI coding agents
- [CONTRIBUTING.md](CONTRIBUTING.md) — Quy ước commit và phát triển

---

## Contents (Cấu trúc Thư mục)

| Thư mục | Nội dung |
|---------|---------|
| `docs/` | Các bản đặc tả nghiệp vụ v1.4, kế hoạch triển khai, báo cáo audit, API & DB migration plans |
| `api/` | Chi tiết hợp đồng API: Auth, Bookings & Orders, Notifications, Parts & Quotes, Tech KYC |
| `requirements/` | Yêu cầu chức năng (FRs), actors, phạm vi dự án (In-Scope & Out-of-Scope) |
| `architecture/` | Kiến trúc hệ thống, phân biệt Booking vs Service Order, State Machine D-22 |
| `database/` | Quy chuẩn database, danh sách migrations và lược đồ quan hệ |
| `deployment/` | Hướng dẫn triển khai Docker & Production |
| `testing/` | Kế hoạch kiểm thử và acceptance criteria |
| `assets/` | Logo, sơ đồ kiến trúc và hình ảnh minh họa |

---

## Architecture Overview

```text
Web (Vue.js 3) ────────┐
(Customer & Tech Web)   │
                        ├──> NestJS Backend API ───> PostgreSQL 16 (14 Migrations)
Mobile (React Native) ──┤    (State Machine D-22,
(Customer & Tech App)   │     Zero Mock Data)
                        │
                        └──> FastAPI AI Service ───> Gemini / OpenAI (Advisory Only)
```

---

## Tech Stack & Quality Gates

| Thành phần | Công nghệ chính | Trạng thái Chất lượng (Quality Gate) |
| :--- | :--- | :--- |
| **Backend** | NestJS 10, TypeScript, TypeORM, PostgreSQL 16 | **129/129 tests pass** (20 suites), 0 lint error (`oxlint`), 0 type error, build dist pass |
| **Web** | Vue.js 3, Vite, TailwindCSS, Pinia, TypeScript | **14/14 tests pass** (3 suites), 0 lint error (`eslint`), 0 type error, Vite build pass |
| **Mobile** | React Native (Expo SDK 57), TypeScript, Zustand | Lint pass, Liquid TabBar, Profile screens |
| **AI Service** | FastAPI, Python, Pytest | Health & provider tests pass, advisory stub |
| **Database** | PostgreSQL 16 (Docker) | **14 migrations** chạy trơn tru (`1725888000000` -> `1725901000000`) |

---

## Repositories

| Repository | Ownership |
|------------|-----------|
| [Backend-FixHome](https://github.com/FixHome-SEP490/Backend-FixHome) | NestJS API, TypeORM migrations, Core logic, State machine, PostgreSQL |
| [Frontend-FixHome](https://github.com/FixHome-SEP490/Frontend-FixHome) | Vue 3 Web (Customer, Technician, Admin portals), Responsive Mobile Nav |
| [Mobi-FixHome](https://github.com/FixHome-SEP490/Mobi-FixHome) | React Native Expo Mobile App |
| [AI-FixHome](https://github.com/FixHome-SEP490/AI-FixHome) | FastAPI AI diagnosis service |
| [Docs-FixHome](https://github.com/FixHome-SEP490/Docs-FixHome) | Requirements, architecture, contracts, testing, and governance |

---

## Engineering Governance

Đọc [AGENTS.md](AGENTS.md) và [AI Technical Guide](docs/AI-TECHNICAL-GUIDE.md) trước khi thực hiện chỉnh sửa mã nguồn hoặc tài liệu. Kiểm tra tài liệu cục bộ:

```bash
npm ci
npm run lint
npm run check:links
npm run validate
```
