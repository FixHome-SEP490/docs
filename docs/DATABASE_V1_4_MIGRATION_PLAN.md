# FIXHOME v1.4 — DATABASE MIGRATIONS & SCHEMA SPECIFICATION

**Tài liệu:** Tổng hợp cấu trúc cơ sở dữ liệu và kế hoạch Migration FixHome  
**Phiên bản đích:** Specification v1.4 Baseline (Dev 1 Final)  
**Hệ quản trị CSDL:** PostgreSQL 16 (Hỗ trợ UUID v4, Giờ quốc tế TIMESTAMPTZ, Giới hạn Geofencing)  
**ORM:** TypeORM độc lập qua `src/database/data-source.ts`  

---

## 1. Danh sách 14 Migrations Đã Thực Thi (Chronological Order)

Toàn bộ 14 file migration dưới đây đã được xây dựng và kiểm thử hoàn toàn trên môi trường PostgreSQL của FixHome Backend:

| STT | Timestamp & Tên Migration | Phạm vi & Chức năng cốt lõi |
| :---: | :--- | :--- |
| 1 | `1725888000000-InitialBaseline.ts` | Bảng người dùng `users`, phân quyền `users_role_enum`, bảng phiên `refresh_tokens`, extension `uuid-ossp`. |
| 2 | `1725889000000-ServiceCatalogAndVerification.ts` | Danh mục dịch vụ (`service_categories`, `services`), hồ sơ xác minh thợ (`technician_verifications`, `verification_documents`). |
| 3 | `1725890000000-CoreIntegrity.ts` | Khóa ngoại nghiêm ngặt, chỉ mục duy nhất cho email/phone, chỉ mục hiệu năng. |
| 4 | `1725891000000-Phase0Bootstrap.ts` | Khởi tạo bảng cấu hình hệ thống và seed tài khoản mặc định (Admin, Manager, Demo Users). |
| 5 | `1725892000000-Phase1AuthUsers.ts` | Mở rộng thông tin người dùng, sổ địa chỉ (`customer_addresses`). |
| 6 | `1725893000000-Phase2ServiceCatalogAndAreas.ts` | Bảng quản lý khu vực phục vụ (`service_areas`), đa giác tọa độ phục vụ matching. |
| 7 | `1725894000000-Phase3to8BusinessLogic.ts` | Các bảng nghiệp vụ chính: `bookings`, `invitations`, `service_orders`, `quotations`, `additional_costs`, `reviews`, `notifications`. |
| 8 | `1725895000000-SpecV12PricingAndSettlement.ts` | Bổ sung `pricing_mode` (`FIXED_PRICE` vs `INSPECTION_REQUIRED`), quyết toán tiền mặt `cash_settlements`, công nợ hoa hồng `commission_dues`, bảo hành `warranties`, `warranty_claims`. |
| 9 | `1725896000000-SpecV14GapFixes.ts` | Bổ sung danh mục linh kiện chính hãng (`parts`), cờ `is_fixhome_provided`, snapshot bảo hành linh kiện ngoài `part_warranty_covered`. |
| 10 | `1725897000000-Dev1Integrity.ts` | Ràng buộc toàn vẹn State Machine D-22: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`, cấm tạo ServiceOrder khi chưa có thợ nhận. |
| 11 | `1725898000000-Dev1EvidenceAndDueMetadata.ts` | Bảng lưu ảnh bằng chứng `order_evidences` phân loại `BEFORE` / `AFTER` kèm metadata kiểm định, bảng `platform_dues` đối soát tài chính. |
| 12 | `1725899000000-CustomerServiceAreaAndCodes.ts` | Chuẩn hóa mã khu vực hành chính (Mã tỉnh 79/01, mã quận/huyện 760, 769...) phục vụ bộ lọc matching thợ. |
| 13 | `1725900000000-TechnicianRoleEnhancements.ts` | Bảng lịch làm việc thợ `technician_schedules`, bảng lưu lý do thợ rút lui / trả đơn (`technician_withdrawals`), bảng lịch sử trạng thái `order_status_history`. |
| 14 | `1725901000000-DropDev1ChatTables.ts` | **Migration dọn dẹp an toàn:** Drop bảng `chat_messages` và `conversations` của Dev 1, chính thức xác nhận Chat nằm ngoài phạm vi Dev 1 để bàn giao cho dev chuyên trách. |

---

## 2. Chi tiết Cấu trúc các Thực thể Bổ sung trong v1.4

### 2.1 Bảng `parts` (Danh mục linh kiện chính hãng FixHome)
Quản lý các linh kiện tiêu chuẩn do FixHome cung ứng để đối soát với thợ và áp dụng chính sách bảo hành chính hãng:

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Sinh tự động v4 |
| `service_id` | `UUID` | `FK services(id) ON DELETE CASCADE`, `INDEX` | Dịch vụ tương ứng |
| `name` | `VARCHAR(255)` | `NOT NULL` | Tên linh kiện |
| `code` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE INDEX` | Mã linh kiện định danh |
| `price` | `NUMERIC(12,2)`| `NOT NULL` | Đơn giá niêm yết |
| `warranty_months`| `INT` | `DEFAULT 6` | Số tháng bảo hành chính hãng |
| `is_fixhome_provided` | `BOOLEAN` | `DEFAULT true` | Đánh dấu linh kiện nền tảng |
| `description` | `TEXT` | `NULLABLE` | Thông số kỹ thuật |

### 2.2 Bảng `order_evidences` (Bằng chứng sửa chữa ảnh thực tế)
Quản lý ảnh bằng chứng trước và sau khi sửa chữa để mở khóa các bước chuyển trạng thái (State Gating):

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `order_id` | `UUID` | `FK service_orders(id) ON DELETE CASCADE`, `INDEX` | Đơn hàng áp dụng |
| `evidence_type` | `VARCHAR(20)` | `NOT NULL` | `'BEFORE'` (bắt buộc trước khi sửa) hoặc `'AFTER'` (bắt buộc trước khi xong) |
| `file_url` | `VARCHAR(500)` | `NOT NULL` | Đường dẫn lưu trữ an toàn |
| `uploaded_by` | `UUID` | `FK users(id)` | Người tải lên (Thợ) |
| `verified_at` | `TIMESTAMPTZ` | `NULLABLE` | Thời điểm Quản lý/Khách hàng kiểm duyệt |

### 2.3 Bảng `order_status_history` (Dữ liệu tiến trình thực)
Cung cấp dữ liệu thời gian thực cho Timeline đơn hàng, loại bỏ hoàn toàn mốc giờ giả định:

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `order_id` | `UUID` | `FK service_orders(id) ON DELETE CASCADE`, `INDEX` | Tham chiếu đơn hàng |
| `from_status` | `VARCHAR(50)` | `NULLABLE` | Trạng thái trước |
| `to_status` | `VARCHAR(50)` | `NOT NULL` | Trạng thái chuyển tới |
| `changed_by_user_id` | `UUID` | `FK users(id)` | Người thực hiện thao tác |
| `note` | `TEXT` | `NULLABLE` | Ghi chú hoặc lý do chuyển trạng thái |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Mốc thời gian thực tế ghi nhận |

### 2.4 Bảng `technician_schedules` (Lịch làm việc của Thợ)
Lưu trữ khung giờ nhận việc trong tuần để phục vụ bộ lọc tìm thợ khả dụng khi khách đặt lịch:

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `technician_id` | `UUID` | `FK users(id) ON DELETE CASCADE`, `INDEX` | Kỹ thuật viên |
| `day_of_week` | `INT` | `NOT NULL` | 0 (Chủ nhật) đến 6 (Thứ 7) |
| `start_time` | `TIME` | `NOT NULL` | Giờ bắt đầu ca |
| `end_time` | `TIME` | `NOT NULL` | Giờ kết thúc ca |
| `is_active` | `BOOLEAN` | `DEFAULT true` | Đang áp dụng hay tạm nghỉ |

---

## 3. Quyết định Nghiệp vụ về Dọn dẹp Module Chat

> [!IMPORTANT]
> **LÝ DO THỰC HIỆN `DropDev1ChatTables`:**
> - Trong giai đoạn đầu, Dev 1 đã tạo thử nghiệm entity `ChatMessage` và `Conversation`. Tuy nhiên, theo phân chia công việc chính thức trong nhóm Capstone, **Module Chat giữa Khách hàng và Kỹ thuật viên hoàn toàn thuộc phạm vi của developer chuyên trách**, không thuộc scope Dev 1.
> - Để tránh xung đột schema, phân tán trách nhiệm dữ liệu và nợ kỹ thuật (technical debt), migration `1725901000000-DropDev1ChatTables.ts` đã được thực thi để drop an toàn các bảng chat tạm thời này.
> - Nhánh phát triển của Dev 1 đã đạt trạng thái sạch sẽ 100%, sẵn sàng tích hợp với module Chat chuyên nghiệp khi nhánh tương ứng sẵn sàng.

---

## 4. Hướng dẫn Chạy và Kiểm tra Migrations

```bash
# Di chuyển vào thư mục Backend
cd Backend-FixHome

# Kiểm tra trạng thái toàn bộ 14 migrations
npx typeorm-ts-node-commonjs migration:show -d src/database/data-source.ts

# Chạy tất cả các migrations chưa áp dụng
npm run migration:run

# Hoàn tác migration gần nhất (khi cần thiết)
npm run migration:revert
```
