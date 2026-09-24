# FIXHOME - BÁO CÁO THIẾT KẾ & TRIỂN KHAI TOÀN DIỆN
## QUY TRÌNH LINH KIỆN VÀ SỬA CHỮA (FLOW 1 & FLOW 2)

**Dự án:** FixHome (SEP490 Capstone Project)  
**Nhánh thực hiện:** `Truonghoang` (đồng bộ từ `origin/main`)  
**Ngày hoàn thiện:** 24/09/2026  
**Trạng thái:** Backend Build PASS | Frontend Build PASS | Unit Tests 14/14 PASS (100%)

---

## 1. TỔNG QUAN KIẾN TRÚC & PHẠM VI (SCOPE & ARCHITECTURE)

Hệ thống bổ sung và chuẩn hóa toàn bộ vòng đời quản lý linh kiện theo 2 kịch bản nghiệp vụ chính, bảo toàn tuyệt đối State Machine chuẩn của ServiceOrder (`ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED | CANCELLED`):

### 1.1. Flow 1: Pre-Repair Parts Request (Yêu cầu linh kiện trước sửa chữa)
1. **Khởi tạo:** Sau khi nhận đơn (`ACCEPTED`), Kỹ thuật viên (Technician) đánh giá sơ bộ sự cố qua mô tả/hình ảnh và tạo yêu cầu linh kiện dự kiến từ danh mục kho FixHome (`fixhome_parts` / `part_catalog`).
2. **Quy tắc tài chính tối thượng:** Yêu cầu này **KHÔNG PHẢI là báo giá (Quotation)**. Khách hàng **hoàn toàn KHÔNG bị tính tiền** tại thời điểm này.
3. **Chuẩn bị & Bàn giao QR:** Quản lý dịch vụ (Service Manager / Kho) tiếp nhận yêu cầu, chuẩn bị linh kiện và bấm **"Chuẩn bị xong (Mark READY)"**. Hệ thống tự động sinh mã Token QR bàn giao bảo mật (48h expiry, gắn chặt với TechnicianId và ServiceOrderId).
4. **Xác nhận nhận linh kiện:** Kỹ thuật viên đến kho quét mã QR hoặc nhập mã Token trên Web App để xác nhận nhận linh kiện (`RECEIVED`).
5. **Đến nơi & Khảo sát thực tế (`EN_ROUTE` -> Check-in GPS):** Kỹ thuật viên tới nhà khách, khảo sát thực tế và lập Báo giá chính thức (`Quotation`). Khách hàng duyệt báo giá trước khi chuyển sang `UNDER_REPAIR`.
6. **Sửa chữa & Chốt sử dụng:** Trong quá trình sửa chữa, linh kiện nào thực tế được lắp vào thiết bị được đánh dấu **`USED`** (được tính vào báo giá nghiệm thu). Linh kiện nào không dùng đến được đánh dấu **`RETURNED`** (trả về kho, khách hàng không bị tính bất kỳ chi phí nào).

### 1.2. Flow 2: Additional Parts Request (Phát sinh linh kiện khi đang sửa chữa)
1. **Phát hiện sự cố phát sinh:** Trong trạng thái `UNDER_REPAIR`, nếu phát hiện hư hỏng ngoài phạm vi báo giá ban đầu:
   - Thợ có thể chọn nguồn linh kiện:
     - **Kho FixHome (`FIXHOME`):** Chọn nhận tại kho (`PICKUP`) hoặc giao hàng tận nơi (`DELIVERY`) kèm phí giao hàng (`shippingFee`).
     - **Thợ tự chuẩn bị (`TECHNICIAN`):** Thợ chịu trách nhiệm chất lượng.
     - **Linh kiện mua ngoài (`EXTERNAL`):** Không có sẵn trong hệ sinh thái FixHome.
2. **Khách hàng duyệt & Cam kết miễn trừ:**
   - Nếu có linh kiện `EXTERNAL`: Hệ thống bắt buộc hiển thị cảnh báo màu hổ phách: *"Linh kiện này không được cung cấp bởi FixHome và không thuộc chính sách bảo hành của FixHome."* Khách hàng phải tích xác nhận miễn trừ trước khi nút **"Đồng ý chi phí phát sinh"** được kích hoạt.
   - Nếu chọn `DELIVERY`: Phí giao hàng được hiển thị rõ ràng và cộng vào tổng số tiền thanh toán của yêu cầu phát sinh.
3. **Tự động sinh Parts Request:** Khi khách hàng duyệt chi phí phát sinh có linh kiện kho FixHome, backend tự động sinh một `PartRequest` kiểu `ADDITIONAL` để Service Manager chuẩn bị và cấp mã QR bàn giao hoặc điều phối giao hàng.

---

## 2. STATE MACHINES & ENUMS HỆ THỐNG

### 2.1. PartRequestStatus (`part-request-status.enum.ts`)
```
[REQUESTED] ---> [READY] ---> [RECEIVED] ---> [COMPLETED]
                   |              ^
                   v              |
             [DELIVERING] --------+
                   |
     (At any pre-handover stage) ---> [CANCELLED]
```
- `REQUESTED`: Thợ vừa gửi yêu cầu, chờ SM/Kho xử lý.
- `READY`: Kho đã đóng gói xong, sinh mã QR Token sẵn sàng giao.
- `DELIVERING`: Đơn vị giao hàng đang vận chuyển linh kiện tới công trình (dành cho DELIVERY).
- `RECEIVED`: Thợ đã quét mã QR xác nhận nhận đủ linh kiện.
- `COMPLETED`: Toàn bộ các linh kiện trong yêu cầu đã được chốt trạng thái `USED` hoặc `RETURNED`.
- `CANCELLED`: Yêu cầu bị hủy (bởi SM hoặc khi ServiceOrder bị hủy).

### 2.2. PartUsageStatus (`part-usage-status.enum.ts`)
- `PENDING`: Linh kiện đã bàn giao cho thợ nhưng chưa chốt sử dụng.
- `USED`: Đã thực tế lắp đặt và thay thế vào thiết bị của khách (khách thanh toán).
- `RETURNED`: Thợ trả lại kho FixHome nguyên vẹn (khách KHÔNG bị tính tiền).

### 2.3. FulfillmentMethod (`fulfillment-method.enum.ts`)
- `PICKUP`: Thợ tự ghé trạm kho nhận linh kiện (Phí ship = 0đ).
- `DELIVERY`: Giao hàng tận nơi cho thợ tại công trình (Có phí giao hàng `shippingFee`).

### 2.4. PartSource (`part-source.enum.ts`)
- `FIXHOME`: Linh kiện chính hãng phân phối bởi kho FixHome (có bảo hành linh kiện tiêu chuẩn).
- `TECHNICIAN`: Linh kiện do thợ tự chuẩn bị.
- `EXTERNAL`: Linh kiện mua ngoài thị trường (FixHome không bảo hành linh kiện).

---

## 3. CƠ SỞ DỮ LIỆU & MIGRATIONS

### 3.1. Bảng `part_requests`
| Cột | Kiểu dữ liệu | Ràng buộc / Ý nghĩa |
|---|---|---|
| `id` | UUID | Khóa chính (Primary Key) |
| `service_order_id` | UUID | Khóa ngoại -> `service_orders(id)` ON DELETE CASCADE |
| `technician_id` | UUID | Khóa ngoại -> `users(id)` |
| `request_type` | VARCHAR(20) | `pre_repair` \| `additional` |
| `fulfillment_method` | VARCHAR(20) | `pickup` \| `delivery` |
| `status` | VARCHAR(20) | `requested`, `ready`, `delivering`, `received`, `completed`, `cancelled` |
| `reason` | TEXT | Ghi chú / lý do của thợ |
| `shipping_fee` | NUMERIC(12,2) | Phí giao hàng (nếu delivery) |
| `additional_cost_id` | UUID | Liên kết tới `additional_cost_requests(id)` (nếu là phát sinh) |
| `qr_token` | VARCHAR(100) | Mã Token QR bàn giao duy nhất (Unique) |
| `qr_generated_at` | TIMESTAMPTZ | Thời gian sinh mã QR (hết hạn sau 48h) |
| `received_at` | TIMESTAMPTZ | Thời điểm thợ quét QR nhận hàng |
| `completed_at` | TIMESTAMPTZ | Thời điểm hoàn tất quyết toán linh kiện |
| `cancelled_at` | TIMESTAMPTZ | Thời điểm hủy |
| `prepared_by_user_id` | UUID | ID của SM / Kho xác nhận chuẩn bị |
| `created_at`, `updated_at` | TIMESTAMPTZ | Audit timestamps |

### 3.2. Bảng `part_request_items`
| Cột | Kiểu dữ liệu | Ràng buộc / Ý nghĩa |
|---|---|---|
| `id` | UUID | Khóa chính |
| `part_request_id` | UUID | Khóa ngoại -> `part_requests(id)` ON DELETE CASCADE |
| `part_catalog_id` | UUID | Khóa ngoại -> `fixhome_parts(id)` / `part_catalog(id)` |
| `part_source` | VARCHAR(20) | `fixhome`, `technician`, `external` |
| `part_name_snapshot`| VARCHAR(255) | Tên linh kiện snapshot tại thời điểm yêu cầu |
| `quantity` | INT | Số lượng yêu cầu (>= 1) |
| `unit_price_snapshot`| NUMERIC(12,2)| Đơn giá niêm yết snapshot tại thời điểm yêu cầu |
| `usage_status` | VARCHAR(20) | `pending`, `used`, `returned` |
| `note` | TEXT | Ghi chú linh kiện |

### 3.3. Bổ sung bảng `additional_cost_requests`
- `fulfillment_method`: VARCHAR(20) DEFAULT `'pickup'`
- `shipping_fee`: NUMERIC(12,2) DEFAULT 0

### 3.4. Migration Script
- File: `src/database/migrations/1790000000005-PartRequestsAndLifecycle.ts`
- Tạo đầy đủ bảng, indexes, foreign keys, và tự động rollback an toàn trong hàm `down()`.

---

## 4. BACKEND API & RBAC MATRIX

| Endpoint | Method | Role | Mô tả chức năng |
|---|---|---|---|
| `/service-orders/:orderId/part-requests` | `POST` | `TECHNICIAN` | Flow 1: Tạo Pre-Repair Parts Request khi đơn ở `ACCEPTED` |
| `/service-orders/:orderId/part-requests` | `GET` | `TECHNICIAN`, `SERVICE_MANAGER`, `ADMIN`, `CUSTOMER` | Lấy danh sách Part Requests của đơn hàng |
| `/part-requests/:id/receive` | `POST` | `TECHNICIAN` | Thợ quét QR Token để nhận linh kiện bàn giao |
| `/part-requests/:id/items/:itemId/usage` | `PATCH` | `TECHNICIAN` | Cập nhật linh kiện thành `USED` hoặc `RETURNED` |
| `/part-requests` | `GET` | `SERVICE_MANAGER`, `ADMIN` | Quản lý, lọc, phân trang toàn bộ yêu cầu linh kiện hệ thống |
| `/part-requests/:id` | `GET` | `SERVICE_MANAGER`, `ADMIN`, `TECHNICIAN` | Xem chi tiết yêu cầu linh kiện và item usage |
| `/part-requests/:id/ready` | `PATCH` | `SERVICE_MANAGER`, `ADMIN` | SM xác nhận chuẩn bị xong -> Tự động sinh mã QR Token |
| `/part-requests/:id/delivering` | `PATCH` | `SERVICE_MANAGER`, `ADMIN` | SM chuyển trạng thái giao hàng tận nơi |
| `/part-requests/:id/cancel` | `PATCH` | `SERVICE_MANAGER`, `ADMIN`, `TECHNICIAN` | Hủy yêu cầu linh kiện |

---

## 5. CÁC QUY TẮC NGHIỆP VỤ & BẢO MẬT (BUSINESS RULES)

1. **Khóa chống yêu cầu lặp (Idempotency):**
   - Không cho phép tạo 2 yêu cầu `PRE_REPAIR` đồng thời đang hoạt động trên cùng một đơn hàng (`CONFLICT 409`).
2. **Snapshot giá niêm yết:**
   - Khi tạo yêu cầu linh kiện FixHome, hệ thống tự động tra cứu bảng giá niêm yết trong cơ sở dữ liệu và lưu `unit_price_snapshot`. Thợ không thể tự ý nâng giá linh kiện FixHome.
3. **Bảo mật mã QR Token:**
   - Token có định dạng `FH-PR-<RANDOM_HEX>`.
   - Có thời hạn hiệu lực 48 giờ kể từ lúc sinh.
   - Khi quét, backend kiểm tra nghiêm ngặt: Token phải khớp, đúng Technician phụ trách đơn hàng (`OWNERSHIP_DENIED 403`), và trạng thái yêu cầu phải là `READY` hoặc `DELIVERING`.
4. **Cascade hoàn tất & hủy đơn:**
   - Khi ServiceOrder chuyển sang `COMPLETED`, toàn bộ các item trong Part Request chưa chốt được tự động chốt (`USED`), trạng thái Part Request chuyển thành `COMPLETED`.
   - Khi ServiceOrder bị `CANCELLED`, Part Request tự động chuyển sang `CANCELLED`.
5. **Minh bạch tài chính khách hàng:**
   - Pre-Repair request không cộng vào công nợ khách.
   - Khách chỉ trả tiền cho linh kiện `USED` thuộc Quotation hoặc Additional Cost được khách duyệt.
   - Toàn bộ linh kiện `RETURNED` được miễn phí 100%.
   - Nếu có linh kiện `EXTERNAL`: Khách bắt buộc xác nhận miễn trừ bảo hành trước khi duyệt.

---

## 6. GIAO DIỆN NGƯỜI DÙNG ĐÃ TRIỂN KHAI (FRONTEND WEB)

### 6.1. Kỹ thuật viên (Technician) - `TechnicianJobDetailPage.vue`
- Tích hợp Component **`TechnicianPartsSection.vue`**:
  - Đặt ngay đầu trang đơn hàng để thợ tiện xử lý trước khi bấm `EN_ROUTE`.
  - Hiển thị danh mục linh kiện kho FixHome, chọn số lượng, chọn hình thức nhận (Tại kho / Giao hàng).
  - Tích hợp ô Quét / Nhập mã QR token nhận hàng trực quan.
  - Phân loại trực quan trạng thái từng linh kiện (`PENDING`, `USED`, `RETURNED`) kèm nút bấm cập nhật nhanh chóng.
- **Form Chi phí phát sinh nâng cấp:**
  - Cho phép thợ phân loại nguồn linh kiện: Kho FixHome, Thợ tự có, hoặc Mua ngoài (`EXTERNAL`).
  - Hỗ trợ chọn phương thức nhận và nhập phí giao hàng nếu cần ship tận nơi.
  - Hiển thị cảnh báo rõ ràng khi chọn linh kiện ngoài.

### 6.2. Quản lý dịch vụ & Admin - `ConsolePartRequestsPage.vue`
- URL Route: `/console/part-requests` (Menu bên trái: *"Yêu cầu linh kiện"*).
- Bộ đếm thống kê thời gian thực: Chờ chuẩn bị, Sẵn sàng (READY), Đang giao hàng, Đã bàn giao, Hoàn tất.
- Tìm kiếm & bộ lọc đa tiêu chí: Trạng thái, Loại yêu cầu (Pre-Repair / Additional), Hình thức nhận (Pickup / Delivery).
- **Hành động một chạm:**
  - Nút *"Chuẩn bị xong (Mark READY)"*: Tự động gọi API và mở ngay Modal QR Bàn giao.
  - Modal QR Bàn giao: Hiển thị hình ảnh mã QR động kèm mã Token copyable, hướng dẫn bàn giao chi tiết.
  - Nút *"Giao hàng"*: Chuyển trạng thái giao hàng tận nơi.
  - Modal xem chi tiết trạng thái sử dụng của từng linh kiện.

### 6.3. Khách hàng (Customer) - `CustomerOrderDetailPage.vue`
- Thẻ Chi phí phát sinh được nâng cấp:
  - Hiển thị phân loại rõ ràng: Công thợ, Linh kiện FixHome, Linh kiện mua ngoài.
  - Hiển thị phí giao hàng nếu thợ yêu cầu giao linh kiện tới công trình.
  - **Banner cảnh báo linh kiện ngoài:** Cảnh báo FixHome không bảo hành linh kiện ngoài, kèm **checkbox bắt buộc** *"Tôi đã hiểu và chấp nhận rủi ro đối với linh kiện ngoài không có bảo hành từ FixHome."* Nút *"Đồng ý chi phí phát sinh"* chỉ mở khi khách đã tích xác nhận.

---

## 7. KẾT QUẢ KIỂM THỬ (TESTING & VERIFICATION)

### 7.1. Backend Build & Unit Tests
```bash
> fixhome-backend@0.1.0 build
> nest build
# Exit code: 0

> vitest run src/modules/part-requests/ src/modules/quotations/
✓ src/modules/part-requests/part-requests.service.spec.ts (11 tests) 9ms
✓ src/modules/quotations/quotations.service.spec.ts (3 tests) 5ms

Test Files  2 passed (2)
     Tests  14 passed (14)
  Duration  1.24s
# Exit code: 0
```

### 7.2. Frontend Build
```bash
> fixhome-frontend@0.1.0 build
> vue-tsc -b && vite build
✓ built in 5.83s
# Exit code: 0
```

---

## 8. KẾT LUẬN & BÀN GIAO
Quy trình linh kiện và sửa chữa (Flow 1 & Flow 2) đã được hoàn thiện 100% trên Backend và Frontend Web, bảo toàn toàn bộ cấu trúc kiến trúc có sẵn của dự án FixHome, tuân thủ nghiêm ngặt RBAC, xử lý ngoại lệ chặt chẽ và sẵn sàng phục vụ báo cáo Đồ án tốt nghiệp (Capstone Project).
