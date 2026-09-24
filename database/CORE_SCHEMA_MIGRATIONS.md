# FixHome — Core Database Schema & Migrations

> **Owner**: Core Platform & Backend Team  
> **Status**: IMPLEMENTED; migration execution in the 2026-09-24 Parts audit is NOT VERIFIED.
> **Last Updated**: 2026-09-24 (Aligned with Spec v2.1)

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
6. **Unique Constraints & Deduplication**: Ràng buộc duy nhất trên các bảng quan hệ (ví dụ: `technician_schedules`, `addresses`) để bảo đảm tính toàn vẹn dữ liệu.

---

## 2. Danh mục TypeORM Migrations

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
| 9 | `1725896000000-KycVerifiedAndFacePhoto.ts` | Bổ sung trường ảnh chân dung (`face_photo_url`) và kiểm soát trạng thái xác minh KYC. |
| 10 | `1725896000000-SpecV14GapFixes.ts` | Bảng linh kiện chính hãng `parts`, cờ `is_fixhome_provided`, snapshot bảo hành linh kiện ngoài `part_warranty_covered`. |
| 11 | `1725897000000-Dev1Integrity.ts` | Ràng buộc toàn vẹn State Machine D-22: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`. |
| 12 | `1725897000000-KycPrivateStorageReference.ts` | Chuẩn hóa metadata đường dẫn lưu trữ bảo mật cho hồ sơ KYC. |
| 13 | `1725898000000-Dev1EvidenceAndDueMetadata.ts` | Bảng ảnh bằng chứng `order_evidences` (`BEFORE`/`AFTER`), bảng công nợ tổng hợp `platform_dues`. |
| 14 | `1725898000000-FixHomePartCatalog.ts` | Quản lý danh mục linh kiện chính hãng FixHome (Part Catalog) với giá niêm yết và thời hạn bảo hành. |
| 15 | `1725899000000-CustomerServiceAreaAndCodes.ts` | Cột mã hành chính chuẩn hóa `province_code`, `district_code` phục vụ matching. |
| 16 | `1725899000000-SupportCases.ts` | Bảng quản lý khiếu nại, tranh chấp thanh toán và xử lý ngoại lệ `support_cases`. |
| 17 | `1725900000000-FinanceWaveFoundation.ts` | Mở rộng cấu trúc thực thể tài chính, đối soát hóa đơn và trích xuất công nợ. |
| 18 | `1725900000000-TechnicianRoleEnhancements.ts` | Bảng ca làm việc thợ `technician_schedules`, bảng lý do rút đơn `technician_withdrawals`, bảng lịch sử `order_status_history`. |
| 19 | `1725901000000-DropDev1ChatTables.ts` | An toàn dọn dẹp các bảng chat tạm thời của Dev 1 chuẩn bị bàn giao cho module Chat chuyên biệt. |
| 20 | `1725902000000-KycPrivateStorageBucket.ts` | Cấu hình bucket lưu trữ riêng tư cho tài liệu KYC. |
| 21 | `1725902000000-MessagingChat.ts` | Khởi tạo bảng hội thoại `conversations` và tin nhắn `chat_messages` phục vụ nhắn tin thời gian thực. |
| 22 | `1725903000000-OtpVerifications.ts` | Bảng xác thực mã OTP đăng ký và đặt lại mật khẩu `otp_verifications`. |
| 23 | `1725904000000-ServiceOrderTechnicianLocation.ts` | Bổ sung tọa độ vị trí thời gian thực của kỹ thuật viên (`technician_latitude`, `technician_longitude`) trên đơn hàng. |
| 24 | `1726800000000-AdditionalCostEvidence.ts` | Đính kèm ảnh bằng chứng hư hại thực tế cho chi phí phát sinh (`additional_cost_evidences`). |
| 25 | `1726900000000-TechnicianSkillVerification.ts` | Bảng chứng chỉ & thẩm định kỹ năng chuyên môn thợ theo từng dịch vụ (`technician_skill_verifications`). |
| 26 | `1727000000000-SimultaneousInvitationRoundIndex.ts` | Chỉ mục và cấu trúc điều phối lời mời theo vòng (invitation rounds). |
| 27 | `1790000000000-PrivateBookingPhotoUploads.ts` | Bảng lưu trữ metadata ảnh tải lên riêng tư của đơn đặt lịch (`private_booking_photo_uploads`). |
| 28 | `1790000000001-BookingMediaPrivateUploadReference.ts` | Liên kết tham chiếu lưu trữ ảnh đặt lịch vào bảng `bookings`. |
| 29 | `1790000000002-BookingInvitationGroups.ts` | Nhóm danh sách ứng viên (candidate groups) và quản lý shortlist thợ. |
| 30 | `1790000000003-DedupeAndConstrainScheduleAndAddress.ts` | Khử trùng lặp và thêm ràng buộc duy nhất (Unique Constraints) trên lịch làm việc thợ và địa chỉ. |
| 31 | `1790000000004-TechnicianServiceRadius.ts` | Bổ sung cột bán kính hoạt động phục vụ (`service_radius_km`) vào hồ sơ kỹ thuật viên `technician_profiles`. |
| 32 | `1790000000005-PartRequestsAndLifecycle.ts` | Parts Request, request items, fulfillment, QR handover và USED/RETURNED. |
| 33 | `1790000000006-PartRequestIntegrity.ts` | FK/check/unique constraints cho Parts, chỉ mục ngày tạo và `invoices.shipping_fee`. Chưa chạy trên PostgreSQL trong audit này. |

Hợp đồng Parts hiện tại và giới hạn migration nằm trong
[Parts API](../api/PARTS_AND_QUOTATIONS.md). Migration mới không tự xóa hay sửa
dữ liệu tài chính cũ nếu vi phạm ràng buộc; cần kiểm tra dữ liệu trước triển khai.

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
| `payment_status` | `VARCHAR(30)` | `DEFAULT 'PENDING'` | `PENDING`, `PAID` (sau xác nhận VNPay hoặc tiền mặt 2 chiều) |
| `payment_method` | `VARCHAR(30)` | `DEFAULT 'CASH'` | Phương thức: `CASH`, `VNPAY` |

### 3.2 Bảng `order_evidences`
| Cột | Kiểu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Khóa chính |
| `service_order_id` | `UUID` | `FK service_orders(id) ON DELETE CASCADE` | Tham chiếu đơn hàng |
| `evidence_type` | `VARCHAR(20)` | `NOT NULL` | `'BEFORE'` (trước sửa) hoặc `'AFTER'` (sau sửa) |
| `file_url` | `VARCHAR(500)` | `NOT NULL` | Đường dẫn tham chiếu Cloudinary (`cloudinary://evidence/...`) |
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
