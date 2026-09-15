# FIXHOME v1.4 — TEST COVERAGE & QUALITY GATES REPORT

**Tài liệu:** Báo cáo toàn diện kết quả kiểm thử đơn vị, kiểm thử luồng và kiểm soát chất lượng  
**Phiên bản đích:** Specification v1.4 Baseline (Dev 1 Complete)  
**Ngày cập nhật:** 16/09/2026  
**Trạng thái kiểm thử:** **100% PASS** trên cả Backend (129/129 tests) và Frontend (14/14 tests)  

---

## 1. Tổng quan Chất lượng Toàn hệ thống (Quality Metrics)

| Hạng mục kiểm thử | Công cụ / Lệnh | Kết quả | Chi tiết |
| :--- | :--- | :---: | :--- |
| **Backend Typecheck** | `tsc --noEmit` | **PASS** | 0 lỗi TypeScript trên toàn bộ codebase |
| **Backend Lint** | `oxlint` | **PASS** | 0 cảnh báo, 0 lỗi trên 265 files |
| **Backend Unit Tests** | `vitest run` | **PASS** | **20/20 suites passed, 129/129 tests passed** |
| **Backend Build** | `nest build` | **PASS** | Biên dịch thành công gói production ra thư mục `dist/` |
| **Web Typecheck** | `vue-tsc -b` | **PASS** | 0 lỗi TypeScript trên toàn bộ component & stores |
| **Web Lint** | `eslint .` | **PASS** | 0 cảnh báo, 0 lỗi |
| **Web Unit Tests** | `vitest run` | **PASS** | **3/3 suites passed, 14/14 tests passed** |
| **Web Build** | `vite build` | **PASS** | Bundle production hoàn tất trong ~4.5 giây |

---

## 2. Danh sách Test Suites Backend (20 Suites — 129 Tests)

| STT | File Test Suite | Số Tests | Trọng tâm kiểm thử | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| 1 | `src/modules/service-orders/service-order-state-machine.spec.ts` | 15 | Luồng State Machine D-22: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`, chặn hủy đơn khi đang sửa, kiểm tra quyền thợ | **PASS** |
| 2 | `src/modules/auth/auth.service.spec.ts` | 15 | Đăng ký tài khoản, đăng nhập băm mật khẩu bcrypt, dual-token JWT, refresh token rotation, hỗ trợ loose UUID cho seed | **PASS** |
| 3 | `src/config/env.validation.spec.ts` | 12 | Kiểm tra tính hợp lệ của các biến môi trường cấu hình DB, JWT, Port | **PASS** |
| 4 | `src/modules/bookings/bookings.service.spec.ts` | 8 | Tạo booking, thuật toán matching ứng viên thợ, sequential invitation, đổi lịch hẹn (reschedule) | **PASS** |
| 5 | `src/modules/service-areas/service-areas.service.spec.ts` | 7 | Quản lý khu vực dịch vụ, chuẩn hóa mã tỉnh/huyện (Hà Nội, TP.HCM) | **PASS** |
| 6 | `src/modules/technician-verifications/technician-verifications.service.spec.ts` | 7 | Nộp hồ sơ KYC thợ, Admin duyệt/từ chối kèm lý do bắt buộc | **PASS** |
| 7 | `src/modules/services/services.service.spec.ts` | 7 | Danh mục dịch vụ, hỗ trợ `FIXED_PRICE` và `INSPECTION_REQUIRED` | **PASS** |
| 8 | `src/modules/users/users.service.spec.ts` | 7 | Quản lý người dùng, khóa/mở tài khoản, thu hồi phiên làm việc | **PASS** |
| 9 | `src/modules/notifications/notifications.service.spec.ts` | 6 | Tạo thông báo, lấy danh sách, đếm unread count, đánh dấu đã đọc | **PASS** |
| 10 | `src/modules/quotations/quotations.service.spec.ts` | 6 | Tạo báo giá, duyệt/từ chối báo giá, chi phí phát sinh D-11 liên kết `supersedesId` | **PASS** |
| 11 | `src/modules/users/addresses.service.spec.ts` | 6 | Sổ địa chỉ khách hàng, địa chỉ mặc định, kiểm soát quyền sở hữu | **PASS** |
| 12 | `src/modules/categories/categories.service.spec.ts` | 6 | Phân cấp danh mục dịch vụ, sắp xếp thứ tự hiển thị | **PASS** |
| 13 | `src/common/guards/scope.guard.spec.ts` | 5 | Bảo vệ phạm vi dữ liệu theo khu vực hành chính | **PASS** |
| 14 | `src/common/guards/ownership.guard.spec.ts` | 4 | Chặn lỗ hổng IDOR, chỉ cho phép chủ tài nguyên thao tác | **PASS** |
| 15 | `src/common/interceptors/transform.interceptor.spec.ts` | 4 | Chuẩn hóa định dạng response `{ success, statusCode, message, data }` | **PASS** |
| 16 | `src/modules/health/health.service.spec.ts` | 4 | Healthcheck kết nối database và runtime | **PASS** |
| 17 | `src/modules/reviews/reviews.service.spec.ts` | 4 | Đánh giá sau dịch vụ D-09 (duy nhất 1 review/đơn), tính điểm trung bình thợ | **PASS** |
| 18 | `src/common/filters/http-exception.filter.spec.ts` | 3 | Chuẩn hóa phản hồi ngoại lệ `{ success: false, error: {...} }` | **PASS** |
| 19 | `src/modules/users/entities/user.entity.spec.ts` | 3 | Vòng đời User entity và mã hóa mật khẩu an toàn | **PASS** |
| 20 | `src/modules/services/parts.service.spec.ts` | 3 | Danh mục linh kiện FixHome vs linh kiện ngoài của thợ | **PASS** |

---

## 3. Danh sách Test Suites Web Frontend (3 Suites — 14 Tests)

| STT | File Test Suite | Số Tests | Trọng tâm kiểm thử | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| 1 | `src/api/__tests__/auth.api.spec.ts` | 5 | Đăng nhập, lưu token/user vào localStorage, refresh token ngầm khi 401 | **PASS** |
| 2 | `src/api/__tests__/bookings.api.spec.ts` | 5 | Tạo booking 5 bước, lấy danh sách ứng viên, gửi yêu cầu đổi lịch hẹn | **PASS** |
| 3 | `src/api/__tests__/orders.api.spec.ts` | 4 | Chi tiết đơn hàng, timeline động thực tế, duyệt báo giá, xác nhận hoàn tất | **PASS** |

---

## 4. Các Vấn đề Đã Khắc Phục Qua Kiểm Thử Thực Tế

1. **Lỗ hổng Fake PAID:** Đã loại bỏ hoàn toàn khả năng client tự set trạng thái `PAID` bằng cách chuyển hóa thành `pay-cash` có Dual-Confirmation hoặc Quản lý dịch vụ đối soát.
2. **Race condition khi nhận việc:** Áp dụng khóa bi quan `pessimistic_write` trong TypeORM transaction, đảm bảo khi thợ A nhận việc thì các lời mời khác cùng booking lập tức bị đóng (`EXPIRED`).
3. **Mốc thời gian tĩnh Timeline:** Đã chuyển đổi hoàn toàn sang đọc mảng lịch sử từ `OrderStatusHistory`.
4. **Chat Removal:** Xác nhận 100% không còn bất kỳ broken import hay tham chiếu mồ côi nào tới module Chat sau khi chạy migration `DropDev1ChatTables`.
