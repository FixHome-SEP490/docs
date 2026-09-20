<p align="center">
  <img src="assets/logo.png" alt="FixHome Logo" width="140" />
</p>

# FixHome — Project Documentation

> **Single Source of Truth** for the FixHome Capstone Project.  
> Last updated: 2026-09-20 | Status: **Master Project Specification v2.0 & Full 4-Stack Ecosystem (BE, FE, AI, Mobile) Active**  
> Chi tiết cấu trúc từng file và sơ đồ kiến trúc: [SYSTEM_ECOSYSTEM_AND_FILE_STRUCTURE.md](architecture/SYSTEM_ECOSYSTEM_AND_FILE_STRUCTURE.md)

---

## 1. Project Overview

**FixHome** là nền tảng Web + Mobile kết nối Khách hàng (Customer) với Kỹ thuật viên (Technician) đã qua xác minh chuyên môn cho nhu cầu sửa chữa và bảo trì thiết bị tại nhà. Hệ thống ứng dụng AI để chẩn đoán sơ bộ nguyên nhân sự cố và gợi ý chi phí (vai trò cố vấn - Advisory Only), đồng thời kiểm soát toàn diện vòng đời đơn dịch vụ:
`Mô tả sự cố & AI Chẩn đoán → Đặt lịch (Booking) → Gợi ý & Phân công thợ (Matching & Invitation) → Đơn dịch vụ (Service Order) → Di chuyển & Check-in GPS → Bằng chứng ảnh & Báo giá → Sửa chữa → Nghiệm thu & Thanh toán tiền mặt 2 chiều → Đánh giá & Bảo hành`.

---

## 2. Problem Statement

Chủ nhà gặp nhiều khó khăn khi tìm kiếm thợ sửa chữa đáng tin cậy: giá cả không minh bạch, tình trạng chặt chém, phát sinh chi phí không rõ lý do, chất lượng linh kiện trôi nổi và không có cam kết bảo hành. FixHome giải quyết bài toán này bằng quy trình số hóa chuẩn mực, hợp đồng dịch vụ rõ ràng, bằng chứng trước/sau khi sửa, bảng giá minh bạch và đối soát công nợ chặt chẽ.

---

## 3. Objectives

- Cung cấp giao diện đặt thợ sửa chữa dễ dàng trên cả Web và Mobile.
- Hỗ trợ chẩn đoán sự cố sơ bộ qua ảnh và mô tả bằng mô hình AI 4 tầng (YOLO11s + RAG Lexical + Qwen2.5-VL).
- Quản lý vòng đời đơn dịch vụ chặt chẽ qua **State Machine D-22** với các chốt chặn kiểm soát (Gating): Check-in GPS, bằng chứng ảnh (`BEFORE`/`AFTER`), duyệt báo giá, duyệt phát sinh.
- Chuẩn hóa quy trình điều phối thợ theo thuật toán matching, phân công tuần tự với khóa hàng cơ sở dữ liệu (`pessimistic_write`) hoặc điều phối thủ công bởi Quản lý dịch vụ.
- Minh bạch tài chính: Bảo mật thanh toán, chuẩn hóa quy trình **Thanh toán tiền mặt kèm xác nhận 2 chiều (Cash Dual-Confirmation)** và đối soát Quản lý dịch vụ.
- Đảm bảo chất lượng bằng chính sách bảo hành chính hãng (FixHome-provided Parts) và đánh giá sau dịch vụ (D-09).

---

## 4. Actors & Platforms

| Actor | Nền tảng | Trách nhiệm cốt lõi |
| :--- | :--- | :--- |
| **Customer** | Web & Mobile App | Đăng ký, đặt lịch sửa chữa 5 bước, chọn thợ từ danh sách gợi ý, đổi lịch hẹn, duyệt báo giá & phát sinh, nghiệm thu hoàn tất, xác nhận thanh toán tiền mặt, yêu cầu bảo hành, đánh giá thợ. |
| **Technician** | Web & Mobile App | Quản lý hồ sơ & chứng chỉ KYC, nộp chứng chỉ duyệt kỹ năng chuyên môn, cài đặt ca làm việc trong tuần, nhận lời mời việc, rút khỏi đơn khi có sự cố trước khi đến nơi, di chuyển, check-in GPS, tải ảnh trước/sau sửa, tạo báo giá, thu tiền mặt, quản lý công nợ FixHome. |
| **Service Manager** | Web Console Portal | Giám sát hàng đợi hỗ trợ sự cố / tranh chấp đơn (`SupportCase`), đối soát giải quyết khiếu nại tiền mặt tại chỗ, điều phối ngoại lệ thủ công (Manual Assignment), xem ngữ cảnh đơn hàng chỉ đọc (read-only dispatch context). |
| **Admin** | Web Console Portal | Quản trị tài khoản người dùng, onboard thợ mới, phê duyệt hồ sơ KYC & duyệt kỹ năng chuyên môn (Skill Verification), quản lý danh mục dịch vụ & giá niêm yết, quản lý danh mục linh kiện chính hãng (FixHome Part Catalog), cấu hình hệ thống (Config Registry), kiểm toán vận hành (Audit Log) và đối soát công nợ (PlatformDue). |

---

## 5. Project Scope

### 5.1 In Scope (Phạm vi hiện tại — Spec v2.0)
- **Danh tính & Xác thực:** Đăng ký, đăng nhập JWT dual-token (Access Token 15m / Refresh Token 7d), xoay vòng refresh token với mã băm SHA-256 trong PostgreSQL, thu hồi phiên tức thì, phân quyền 4 vai trò (RBAC) với phân định rõ rệt quyền Quản trị (Admin) và Vận hành hỗ trợ (Service Manager).
- **Hồ sơ KYC Kỹ thuật viên bảo mật cao (Admin KYC):** Lưu trữ CCCD mặt trước, mặt sau và ảnh chụp chân dung (face photo) trên Private Storage Supabase, cơ chế cấp URL chữ ký điện tử có thời hạn (Signed Access URL), chỉ Admin và chính chủ mới có quyền truy cập (`fail-closed`). Đồng bộ trạng thái `VERIFIED` sang hồ sơ thợ và ghi nhật ký kiểm toán bất biến.
- **Xác minh Kỹ năng Chuyên môn Thợ (Skill Verification):** Thợ nộp chứng chỉ, bằng cấp theo từng dịch vụ đăng ký cung cấp; Admin thẩm định duyệt/từ chối; chỉ những kỹ năng đạt trạng thái `VERIFIED` mới đủ điều kiện xuất hiện trong danh sách ứng viên (Candidate Discovery) và nhận đơn.
- **Admin Onboarding Thợ:** Admin có quyền tạo và kích hoạt tài khoản kỹ thuật viên trực tiếp từ màn hình Console Quản trị.
- **Điều phối thợ thủ công (Manual Assignment):** Cho phép Service Manager và Admin phân công hoặc ghi đè thợ nhận việc khi xảy ra tình huống khẩn cấp hoặc khách yêu cầu đặc biệt.
- **Quản lý Sự cố & Hỗ trợ (Service Manager Support Cases):** Hàng đợi xử lý khiếu nại, giải quyết tranh chấp chênh lệch tiền mặt thanh toán tại chỗ (`CASH_DISPUTE`), ghi nhận lý do điều chỉnh và bảo vệ tính toàn vẹn của dữ liệu tài chính.
- **Danh mục Dịch vụ & Linh kiện chính hãng:** Phân cấp danh mục cha con, dịch vụ giá cố định (`FIXED_PRICE` - chặn thợ ghi đè giá sàn) và khảo sát báo giá (`INSPECTION_REQUIRED`), danh mục linh kiện FixHome (Part Catalog) chỉ quản lý thông số, giá niêm yết và thời hạn bảo hành (hoàn toàn không quản lý kho vận WMS).
- **Sổ đăng ký Cấu hình Hệ thống (Business Config Registry):** Đăng ký tập trung các tham số vận hành (tỷ lệ hoa hồng, thời gian huỷ đơn tự động, số ca tối đa/thợ) có phân loại trạng thái hiệu lực (`ACTIVE`, `PENDING_WIRING`, `STALE_REVIEW`).
- **Nhật ký Kiểm toán Vận hành (Audit Log):** Cơ chế ghi nhật ký bất biến (append-only) cho mọi thao tác nhạy cảm của Admin và Service Manager.
- **Khu vực hoạt động:** Chuẩn hóa theo mã định danh hành chính quận/huyện tại Hà Nội và TP.HCM.
- **AI Diagnosis Service (4 Tầng):** Tự host trên GPU riêng với YOLO11s (22 thiết bị), RAG 134 mã lỗi và Qwen2.5-VL-3B-AWQ; Backend có cơ chế fallback tự động, hoàn toàn không chặn luồng nghiệp vụ.
- **Booking & Matching:** Đặt lịch 5 bước, khám phá ứng viên thợ, shortlist tối đa 5 thợ, gửi lời mời tuần tự (Sequential Invitation) với khóa dòng chống race condition.
- **Đổi lịch hẹn (Customer Reschedule):** Khách hàng chủ động đổi ngày/khung giờ khi đơn chưa bắt đầu sửa chữa.
- **Thợ rút khỏi đơn (Technician Withdraw):** Rút khỏi đơn kèm lý do minh bạch trước khi đến nơi, hệ thống tự động mời ứng viên tiếp theo.
- **State Machine D-22:** `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`. Tự động huỷ đơn quá hạn sau lịch hẹn.
- **Check-in GPS & Bằng chứng ảnh:** Geofencing xác minh thợ đã tới vị trí khách hàng (<500m); chốt chặn bắt buộc ảnh `BEFORE` trước khi sửa và ảnh `AFTER` trước khi hoàn tất.
- **Báo giá & Phát sinh:** Báo giá khảo sát thực tế, khách duyệt/từ chối; chi phí phát sinh D-11 bất biến có liên kết phiên bản `supersedesId` và đính kèm ảnh bằng chứng hư hại thực tế.
- **Bảo mật Tài chính & Thu công nợ:** Máy chủ làm thẩm quyền duy nhất xác thực thanh toán (`isOrderPaymentSatisfied`), chặn đứng lỗ hổng fake PAID từ client; chuẩn hóa **Thanh toán tiền mặt xác nhận 2 chiều (Cash Dual-Confirmation)** và tự động trích nợ hoa hồng PlatformDue (chặn điều phối thợ nếu nợ quá hạn).
- **Tiến trình đơn động (Real Timeline):** Đồng bộ trực tiếp từ `OrderStatusHistory`.
- **Module Thông báo & Tin nhắn thời gian thực:** WebSocket Gateway Socket.IO phục vụ chat giữa Khách hàng và Kỹ thuật viên khi đơn đang hoạt động; thông báo đẩy và badge tin chưa đọc.
- **Responsive Web & Mobile App:** Giao diện Vue 3 Responsive trên Web và ứng dụng di động React Native / Expo 57 trên iOS/Android.
- **Đánh giá & Bảo hành:** Đánh giá thợ D-09 (duy nhất 1 lần/đơn), tạo yêu cầu bảo hành và quản lý phiếu bảo hành.

### 5.2 Out of Scope (Ngoại phạm vi)
- **Chat trực tiếp giữa Service Manager và Thợ:** Quản lý xử lý sự cố thông qua quy trình Support Case có lưu vết Audit.
- **Cổng thanh toán trực tuyến (VNPay / Online Payment):** Tạm thời chưa kích hoạt do chờ thông tin Merchant ID đối tác; hệ thống vận hành trơn tru qua Cash Dual-Confirmation.
- **Live GPS Tracking liên tục theo thời gian thực:** Sử dụng xác thực GPS Check-in tại điểm đến kết hợp tính khoảng cách địa lý.
- **Quản lý kho vận phức tạp (Warehouse / Inventory Management / WMS):** FixHome cung cấp danh mục định giá linh kiện mà không theo dõi tồn kho vật lý đa kho.

---

## 6. Core Modules Status

| # | Module | Backend | Web Frontend | Mobile App | Trạng thái |
|---|--------|---------|--------------|------------|:---:|
| 1 | Auth & JWT & RBAC | ✅ Dual-token, bcrypt, valid UUID v4 | ✅ Pinia auth store, session recovery | ✅ Zustand, SecureStore | **COMPLETED** |
| 2 | User & Addresses | ✅ CRUD, default address, ownership | ✅ Customer Profile, tab Sổ địa chỉ | ✅ Profile screen | **COMPLETED** |
| 3 | Technician Profile & KYC | ✅ Documents KYC, private storage signed URLs | ✅ Tech Profile, Verification upload | ✅ Profile screen, KYC upload | **COMPLETED** |
| 4 | Technician Schedule | ✅ Ca làm việc trong tuần, slot check | ✅ Tech Schedule management | — | **COMPLETED** |
| 5 | Service Catalog & Pricing | ✅ Fixed price & Inspection required | ✅ Service browsing, detail | ✅ Services list, detail | **COMPLETED** |
| 6 | Parts Catalog | ✅ FixHome vs Tech parts, warranty | ✅ Dynamic parts selection in quote | — | **COMPLETED** |
| 7 | Service Areas | ✅ Chuẩn hóa mã tỉnh/huyện (HN, HCM) | ✅ Standardized district select UI | — | **COMPLETED** |
| 8 | AI Diagnosis | ✅ Advisory stub, REST adapter | ✅ Diagnosis step in wizard | ✅ AI Diagnosis & Chat | **COMPLETED** |
| 9 | Booking & Reschedule | ✅ 5-step booking, reschedule endpoint | ✅ 5-step Wizard, Reschedule modal | ✅ Booking flow, detail | **COMPLETED** |
| 10 | Matching & Invitation | ✅ Sequential invite, row lock | ✅ Tech Invitations page (safe errors)| ✅ Tech Invitations screen | **COMPLETED** |
| 11 | Service Order & State Machine | ✅ D-22 strict transitions, ownership | ✅ Real-time tracking, 0 mock data | ✅ Job tracking screen | **COMPLETED** |
| 12 | GPS Geofence & Check-in | ✅ Lat/Long geofence verification | ✅ Tech Check-in GPS button | ✅ Check-in trigger | **COMPLETED** |
| 13 | Evidence Gating | ✅ BEFORE & AFTER gating | ✅ Evidence upload & gallery | ✅ Camera/Image picker | **COMPLETED** |
| 14 | Technician Withdrawal | ✅ Withdraw endpoint & auto re-invite | ✅ Withdraw modal with reason | — | **COMPLETED** |
| 15 | Quotation & Additional Costs| ✅ Labor/parts breakdown, D-11 link, photo evidence | ✅ Quote review & decision modal | ✅ Quotation screen | **COMPLETED** |
| 16 | Cash Dual-Confirmation | ✅ Cash pay API, block fake PAID | ✅ Cash payment confirmation | ✅ Cash confirm screen | **COMPLETED** |
| 17 | Platform Dues | ✅ Commission & parts settlement | ✅ "Công nợ FixHome" page | — | **COMPLETED** |
| 18 | Real Order Timeline | ✅ OrderStatusHistory real data | ✅ Dynamic timeline (bỏ hardcode) | ✅ Dynamic timeline | **COMPLETED** |
| 19 | Notifications Module | ✅ In-app notifications API, unread | ✅ Notification bell badge & center | ✅ Notifications screen | **COMPLETED** |
| 20 | Reviews & Ratings | ✅ D-09 single review, average rating | ✅ Post-service review modal | ✅ Review screen | **COMPLETED** |
| 21 | Warranties & Claims | ✅ Warranty policy & claim flow | ✅ Customer Warranties page | — | **COMPLETED** |
| 22 | Role Dashboards | ✅ 4 role-tailored dashboard metrics | ✅ Customer & Tech dashboards | ✅ Customer/Tech home | **COMPLETED** |
| 23 | Support Cases & Cash Disputes | ✅ Support Cases module, resolve & escalate | ✅ Support Queue & Cash Dispute Detail | — | **COMPLETED** |
| 24 | Admin KYC Verification Review | ✅ Admin review, VERIFIED sync, signed media | ✅ Admin Verifications page | — | **COMPLETED** |
| 25 | Admin Part Catalog Management | ✅ FixHome parts CRUD, pricing, warranty | ✅ Admin Parts Catalog page | — | **COMPLETED** |
| 26 | System Config Registry | ✅ Centralized config, effectivity status | ✅ Admin Config page | — | **COMPLETED** |
| 27 | Operational Audit Log | ✅ Append-only audit logger & controller | ✅ Admin Audit Logs page | — | **COMPLETED** |
| 28 | Server-Authoritative Finance | ✅ Finance module, payment satisfaction port | ✅ Admin Platform Dues & Finance Audit | — | **COMPLETED** |
| 29 | Technician Skill Verification | ✅ Multi-service skill verification, admin approval | ✅ Tech Profile skill upload, Admin review page | — | **COMPLETED** |
| 30 | Admin Technician Onboarding | ✅ Create technician account & initial profile | ✅ Admin Users onboard modal | — | **COMPLETED** |
| 31 | Manual Technician Assignment | ✅ SM/Admin manual assign & override | ✅ Console Bookings assign board | — | **COMPLETED** |
| 32 | Real-time Messaging (Chat) | ✅ Socket.IO Gateway, conversation entity | ✅ MessagesPage.vue | ✅ ChatList & ChatThread | **COMPLETED** |

---

## 7. System Architecture

```text
+------------------------------------+         +--------------------------------------+
|          Vue.js 3 Web Client       |         |          React Native Mobile         |
|  (Customer, Tech, Manager, Admin)  |         |      (Customer & Technician App)     |
|   32+ pages, Warm Orange System    |         |        Expo SDK 57, Zustand          |
+------------------+-----------------+         +-------------------+------------------+
                   |                                               |
                   +-----------------------+-----------------------+
                                           | REST API (JWT Dual-Token + RBAC)
                                           v
                   +-----------------------------------------------+
                   |              NestJS Backend API               |
                   |       (16 Modules, TypeORM, Vitest)           |
                   +-----------+-----------------------+-----------+
                               |                       |
                  TypeORM / SQL|                       | HTTP Client (Axios)
                               v                       v
                   +-----------+----------+  +---------+-----------+
                   | PostgreSQL Database  |  |  FastAPI AI Service |
                   |  (PostgreSQL 16,     |  +---------+-----------+
                   |   14 Migrations)     |            |
                   +----------------------+            | Provider Abstraction
                                                       v
                                             +---------+-----------+
                                             | Gemini / OpenAI API |
                                             +---------------------+
```

---

## 8. Service Order State Machine D-22

```text
         [ Customer Booking: REQUESTED ]
                        │
             (Sequential Invitation)
                        ↓
            [ Technician ACCEPT ] ──(Withdraw before arrival)──> [ RE-DISPATCHING ]
                        │
          (Atomic Creation: ACCEPTED)
                        │
               (Technician Starts)
                        ↓
                  [ EN_ROUTE ] ────(Withdraw before arrival)──> [ RE-DISPATCHING ]
                        │
            (GPS Check-in + BEFORE Photo)
                        ↓
                [ UNDER_REPAIR ] ──(Hủy tùy tiện: BỊ CHẶN, chuyển sang Yêu cầu hỗ trợ)
                        │
          (Thợ sửa xong + Báo giá duyệt)
          (AFTER Photo + Thợ báo xong)
          (Khách nghiệm thu + Trả tiền mặt)
                        ↓
                  [ COMPLETED ] (Terminal)
```

### Các chốt chặn kiểm soát (Quality & Security Gates):
1. **Atomic Creation:** `ServiceOrder` và `TechnicianAssignment` chỉ được tạo khi KTV xác nhận `ACCEPT`, tuyệt đối không tạo đơn mồ côi.
2. **GPS Geofencing:** Bắt buộc KTV gửi tọa độ hợp lệ tại nhà khách hàng khi thực hiện `check-in`.
3. **Evidence Gating:**
   - Để vào `UNDER_REPAIR`: Phải có ít nhất 1 ảnh `BEFORE`.
   - Để vào `COMPLETED`: Phải có ít nhất 1 ảnh `AFTER` và 0 chi phí phát sinh nào đang chờ duyệt.
4. **Không tự set PAID:** Nghiêm cấm client tự ý set đơn hàng thành `PAID`. Quy trình thanh toán tiền mặt yêu cầu xác nhận 2 chiều giữa Khách hàng và Thợ.

---

## 9. Database Migrations History

Toàn bộ 14 migrations đã được thực thi và kiểm thử tính toàn vẹn trên PostgreSQL:

1. `1725888000000-InitialBaseline.ts` (Users, Roles, RefreshTokens)
2. `1725889000000-ServiceCatalogAndVerification.ts` (Categories, Services, KYC)
3. `1725890000000-CoreIntegrity.ts` (Foreign keys & indexes)
4. `1725891000000-Phase0Bootstrap.ts` (System configs & default seed)
5. `1725892000000-Phase1AuthUsers.ts` (Customer addresses)
6. `1725893000000-Phase2ServiceCatalogAndAreas.ts` (Service areas)
7. `1725894000000-Phase3to8BusinessLogic.ts` (Bookings, Orders, Quotes, Reviews)
8. `1725895000000-SpecV12PricingAndSettlement.ts` (Pricing modes, Settlements, Dues)
9. `1725896000000-SpecV14GapFixes.ts` (FixHome Parts, Part warranty options)
10. `1725897000000-Dev1Integrity.ts` (State machine constraints)
11. `1725898000000-Dev1EvidenceAndDueMetadata.ts` (Order evidences, Platform dues)
12. `1725899000000-CustomerServiceAreaAndCodes.ts` (Administrative district codes)
13. `1725900000000-TechnicianRoleEnhancements.ts` (Schedules, Withdrawals, OrderStatusHistory)
14. `1725901000000-DropDev1ChatTables.ts` (An toàn loại bỏ Chat khỏi scope Dev 1)

---

## 10. Quality Gates & Test Metrics

- **Backend (NestJS):**
  - Typecheck: `tsc --noEmit` -> **0 errors**
  - Lint: `oxlint` -> **0 warnings, 0 errors** (265 files)
  - Unit Tests: `vitest run` -> **20/20 test suites passed, 129/129 tests passed**
  - Build: `nest build` -> **PASS**
- **Web Frontend (Vue 3):**
  - Typecheck: `vue-tsc -b` -> **0 errors**
  - Lint: `eslint .` -> **0 warnings, 0 errors**
  - Unit Tests: `vitest run` -> **3/3 test suites passed, 14/14 tests passed**
  - Build: `vite build` -> **PASS** (~4.5s)
- **Data Integrity:**
  - **Zero Mock Data:** Tất cả dữ liệu Khách hàng và Thợ hiển thị trên Web đều gọi API thực từ Backend.
  - **Zero Broken Routes:** Đã kiểm tra toàn diện, chuyển hướng chính xác các đường dẫn.
