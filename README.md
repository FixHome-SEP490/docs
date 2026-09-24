<p align="center">
  <img src="assets/logo.png" alt="FixHome Logo" width="120" />
</p>

<h1 align="center">FixHome — Documentation</h1>

<p align="center">
  <strong>Tài liệu dự án & Hợp đồng kỹ thuật cho nền tảng sửa chữa & bảo trì tại nhà FixHome</strong>
</p>

---

## Key Documents (Tài liệu Trọng tâm v2.0)

- [SYSTEM_ECOSYSTEM_AND_FILE_STRUCTURE.md](architecture/SYSTEM_ECOSYSTEM_AND_FILE_STRUCTURE.md) — **Kiến trúc Hệ thống & Cấu trúc Chi tiết Từng File (BE, FE, AI, Mobile)**
- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) — **Single Source of Truth** (Đặc tả tổng quan kiến trúc & hệ thống v2.0)
- [Master Project Specification v1.4](docs/FIXHOME-Master-Project-Specification-v1.4.md) — Tài liệu nghiệp vụ & kỹ thuật chuẩn nhóm
- [Dev 1 Implementation Plan v1.4](docs/FIXHOME-DEV1-IMPLEMENTATION-PLAN-v1.4.md) — Kế hoạch thực thi & bàn giao chi tiết của Dev 1
- [Dev 1 Fix & Audit Report](docs/DEV1-FIX-REPORT.md) — Báo cáo nghiệm thu 24 task sửa lỗi, dọn dẹp Chat và kiểm thử Dev 1
- [Full API Integration Report](docs/FULL-API-INTEGRATION-REPORT.md) — Báo cáo kiểm định tích hợp API toàn diện giữa Web, Mobile và Backend
- [Final Integration Checklist](docs/FINAL-INTEGRATION-CHECKLIST.md) — Checklist chốt chặn kiểm thử trước demo
- [API v1.4 Changelog](docs/API_V1_4_CHANGELOG.md) — Hợp đồng API v1.4 (Reschedule, Withdraw, Cash Dual-Confirmation, Notifications, Parts...)
- [Database v1.4 Migrations](docs/DATABASE_V1_4_MIGRATION_PLAN.md) — Kế hoạch & cấu trúc migration TypeORM trong PostgreSQL
- [CURRENT_TASKS.md](CURRENT_TASKS.md) — Trạng thái dự án, danh sách task hoàn thành và backlog
- [REPOSITORY_GUIDE.md](REPOSITORY_GUIDE.md) — Bản đồ repo và hướng dẫn setup local
- [AGENTS.md](AGENTS.md) — Hướng dẫn cho AI coding agents
- [CONTRIBUTING.md](CONTRIBUTING.md) — Quy ước commit và phát triển

---

## Contents (Cấu trúc Thư mục)

| Thư mục | Nội dung |
|---------|---------|
| `docs/` | Các bản đặc tả nghiệp vụ v1.4/v2.0, kế hoạch triển khai, báo cáo audit, API & DB migration plans, checklist tích hợp |
| `api/` | Chi tiết hợp đồng API: Auth, Bookings & Orders, Notifications, Parts & Quotes, Tech KYC |
| `requirements/` | Yêu cầu chức năng (FRs), actors, phạm vi dự án (In-Scope & Out-of-Scope) |
| `architecture/` | Kiến trúc hệ thống, phân rã chi tiết file 4 phân hệ (`SYSTEM_ECOSYSTEM_AND_FILE_STRUCTURE.md`), State Machine D-22 |
| `database/` | Quy chuẩn database, danh sách migrations và lược đồ quan hệ |
| `deployment/` | Hướng dẫn triển khai Docker & Production |
| `testing/` | Kế hoạch kiểm thử, acceptance criteria và kết quả audit (`integration-audit/`) |
| `scripts/` | Script kiểm thử tích hợp tự động (`audit-integration.cjs`) |
| `assets/` | Logo, sơ đồ kiến trúc và hình ảnh minh họa |

---

## Architecture Overview

```text
Web (Vue 3 + Vite) ────────┐
(Customer, Tech & Console)  │
                            ├──> NestJS Backend API ───> PostgreSQL 16 (32 Migrations)
Mobile (React Native Expo) ──┤    (State Machine D-22,   ├──> Cloudinary Authenticated Storage
(Customer & Tech App)       │     VNPay + Cash Dual,     └──> WebSocket Realtime Chat Gateway
                            │     Zero Mock Data, 5-Layer Guards)
                            │
                            └──> FastAPI AI Service ───> YOLO11s (22 thiết bị) + Qwen2.5-VL + RAG
```

---

## Tech Stack & Quality Gates

| Thành phần | Công nghệ chính | Trạng thái Chất lượng (Quality Gate) |
| :--- | :--- | :--- |
| **Backend** | NestJS 10, TypeScript, TypeORM, PostgreSQL 16, Cloudinary, VNPay | **603/603 unit tests pass** (77 suites), 0 lint error (`oxlint`), 0 type error, build dist pass |
| **Web** | Vue 3, Vite, TailwindCSS, Pinia, TypeScript | **323/323 tests pass** (37 suites), 0 lint error, 0 type error, Vite build pass |
| **Mobile** | React Native (Expo SDK 57), TypeScript, Zustand | Auth OTP/Password reset split, Realtime Chat Socket thread, KYC upload resilience |
| **AI Service** | FastAPI, Python 3.11, vLLM, YOLO11s, Qwen2.5-VL | 4-tier engine: Hội thoại -> Thị giác -> Tri thức (3.319 đoạn) -> Ngôn ngữ (CI tooling & governance) |
| **Database** | PostgreSQL 16 (Docker) | **32 migrations** chạy trơn tru, unique constraint deduplication |
| **Storage** | Cloudinary Private Authenticated Storage | Signed URLs có thời hạn (5 phút), whitelist JPEG/PNG/WebP magic bytes |

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
