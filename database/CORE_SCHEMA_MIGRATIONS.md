# FixHome — Core Database Schema & Migrations

> **Owner**: Core Platform & Backend Team  
> **Status**: 14 MIGRATIONS EXECUTED & VERIFIED  
> **Last Updated**: 2026-09-16 (Aligned with Spec v1.4)

Tài liệu này quy chuẩn cấu trúc cơ sở dữ liệu nền tảng và danh mục toàn bộ các bản migration của hệ thống FixHome trên PostgreSQL 16.

---

## 1. Nguyên Tắc Thiết Kế Database (Database Principles)

1. **Khóa chính**: Luôn là `id` kiểu `UUID` sinh tự động (`uuid_generate_v4()`).
2. **Kế thừa BaseEntity**: Mọi bảng đều có `created_at` và `updated_at` kiểu `TIMESTAMP WITH TIME ZONE DEFAULT now()`.
3. **Naming Standards**:
   - Tên bảng: `snake_case`, số nhiều (ví dụ: `users`, `service_orders`, `quotations`).
   - Tên cột: `snake_case` (ví dụ: `password_hash`, `scheduled_date`, `is_fixhome_provided`).
   - Khóa ngoại: `<tên_bảng_số_ít>_id` (ví dụ: `service_order_id`, `technician_id`).
4. **Không bật `synchronize: true` trên Production / Staging**: Mọi thay đổi schema đều phải qua TypeORM migration.
5. **Giao dịch và Khóa hàng (Pessimistic Locking)**: Sử dụng transaction với khóa bi quan (`pessimistic_write`) khi KTV nhận việc hoặc cập nhật trạng thái đơn dịch vụ để loại bỏ hoàn toàn race condition.

---

## 2. Toàn Bộ 14 TypeORM Migrations Đã Thực Thi

| STT | File Migration | Nội dung & Bảng thay đổi |
| :---: | :--- | :--- |
| 1 | `1725888000000-InitialBaseline.ts` | Bảng `users`, enum `users_role_enum`, bảng phiên `refresh_tokens`, extension `uuid-ossp`. |
| 2 | `1725889000000-ServiceCatalogAndVerification.ts` | Bảng danh mục dịch vụ `service_categories`, dịch vụ `services`, hồ sơ xác minh KYC `technician_verifications`, `verification_documents`. |
| 3 | `1725890000000-CoreIntegrity.ts` | Ràng buộc khóa ngoại nghiêm ngặt, chỉ mục duy nhất cho email/phone. |
| 4 | `1725891000000-Phase0Bootstrap.ts` | Bảng cấu hình hệ thống `system_settings` và seed tài khoản mặc định (Admin, Manager, Customer, Tech). |
| 5 | `1725892000000-Phase1AuthUsers.ts` | Mở rộng thông tin người dùng, sổ địa chỉ `customer_addresses`. |
| 6 | `1725893000000-Phase2ServiceCatalogAndAreas.ts` | Bảng khu vực hoạt động `service_areas` với tọa độ đa giác (boundary polygons). |
| 7 | `1725894000000-Phase3to8BusinessLogic.ts` | Bảng `bookings`, `invitations`, `service_orders`, `quotations`, `additional_costs`, `reviews`, `notifications`. |
| 8 | `1725895000000-SpecV12PricingAndSettlement.ts` | Cột `pricing_mode` trong `services`, bảng quyết toán `cash_settlements`, công nợ `commission_dues`, bảo hành `warranties`, `warranty_claims`. |
| 9 | `1725896000000-SpecV14GapFixes.ts` | Bảng linh kiện chính hãng `parts`, cờ `is_fixhome_provided`, snapshot bảo hành linh kiện ngoài `part_warranty_covered`. |
| 10 | `1725897000000-Dev1Integrity.ts` | Ràng buộc toàn vẹn State Machine D-22: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`. |
| 11 | `1725898000000-Dev1EvidenceAndDueMetadata.ts` | Bảng ảnh bằng chứng `order_evidences` (`BEFORE`/`AFTER`), bảng công nợ tổng hợp `platform_dues`. |
| 12 | `1725899000000-CustomerServiceAreaAndCodes.ts` | Cột mã hành chính chuẩn hóa `province_code`, `district_code` phục vụ matching. |
| 13 | `1725900000000-TechnicianRoleEnhancements.ts` | Bảng ca làm việc thợ `technician_schedules`, bảng lý do rút đơn `technician_withdrawals`, bảng lịch sử `order_status_history`. |
| 14 | `1725901000000-DropDev1ChatTables.ts` | **Dọn dẹp an toàn:** Drop bảng `chat_messages` và `conversations` của Dev 1, xác nhận Chat ngoài scope Dev 1. |

---

## 3. Chi Tiết Các Bảng Nghiệp Vụ Cốt Lõi

### 3.1 Bảng `service_orders`
| Cột | Kiểu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `booking_id` | `UUID` | `FK bookings(id)` | Tham chiếu Booking khởi tạo |
| `technician_id`| `UUID` | `FK users(id)` | Kỹ thuật viên phụ trách |
| `status` | `VARCHAR(30)` | `NOT NULL` | `ACCEPTED`, `EN_ROUTE`, `UNDER_REPAIR`, `COMPLETED`, `CANCELLED` |
| `pricing_mode` | `VARCHAR(30)` | `NOT NULL` | `FIXED_PRICE` hoặc `INSPECTION_REQUIRED` |
| `final_labor_cost` | `NUMERIC(12,2)` | `DEFAULT 0` | Tiền công cuối cùng |
| `final_parts_cost` | `NUMERIC(12,2)` | `DEFAULT 0` | Tiền linh kiện cuối cùng |
| `total_amount` | `NUMERIC(12,2)` | `DEFAULT 0` | Tổng giá trị đơn hàng |
| `payment_status` | `VARCHAR(30)` | `DEFAULT 'PENDING'` | `PENDING`, `PAID` (sau xác nhận tiền mặt 2 chiều) |
| `payment_method` | `VARCHAR(30)` | `DEFAULT 'CASH'` | Phương thức thanh toán |

### 3.2 Bảng `order_evidences`
| Cột | Kiểu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `service_order_id` | `UUID` | `FK service_orders(id) ON DELETE CASCADE` | Tham chiếu đơn hàng |
| `evidence_type` | `VARCHAR(20)` | `NOT NULL` | `'BEFORE'` (trước sửa) hoặc `'AFTER'` (sau sửa) |
| `file_url` | `VARCHAR(500)` | `NOT NULL` | Đường dẫn ảnh an toàn |
| `caption` | `TEXT` | `NULLABLE` | Chú thích tình trạng |
| `uploaded_by` | `UUID` | `FK users(id)` | Người tải lên |

### 3.3 Bảng `order_status_history`
| Cột | Kiểu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `service_order_id` | `UUID` | `FK service_orders(id) ON DELETE CASCADE` | Tham chiếu đơn hàng |
| `from_status` | `VARCHAR(30)` | `NULLABLE` | Trạng thái trước |
| `to_status` | `VARCHAR(30)` | `NOT NULL` | Trạng thái mới |
| `actor_name` | `VARCHAR(100)`| `NULLABLE` | Tên người thực hiện hành động |
| `note` | `TEXT` | `NULLABLE` | Ghi chú lý do chuyển trạng thái |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Mốc thời gian thực tế ghi nhận |

---

## 4. Lệnh Quản Lý Migration CLI

Toàn bộ migration được quản lý qua `src/database/data-source.ts` của Backend:

```bash
# Xem trạng thái tất cả migrations
npx typeorm-ts-node-commonjs migration:show -d src/database/data-source.ts

# Chạy tất cả các migrations còn thiếu
npm run migration:run

# Revert migration gần nhất
npm run migration:revert
```
