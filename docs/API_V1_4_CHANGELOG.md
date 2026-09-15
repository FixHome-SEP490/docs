# FIXHOME v1.4 — API CHANGELOG & CONTRACT SPECIFICATION

**Tài liệu:** Nhật ký thay đổi và chuẩn hóa hợp đồng API FixHome  
**Phiên bản đích:** Specification v1.4 (Hoàn thành Dev 1 Audit & Core Flows)  
**Ngày cập nhật:** 16/09/2026  
**Đối tượng:** Backend, Frontend, Mobile Engineers & QA  

---

## 1. Nguyên tắc thiết kế API v1.4

1. **Bảo mật thanh toán (Payment Security):** Tuyệt đối không cho phép client tự gửi cờ đánh dấu đơn hàng hoặc hóa đơn thành `PAID`. Phương thức chuẩn hiện tại là **Cash Dual-Confirmation** (Thanh toán tiền mặt với xác nhận hai chiều giữa khách hàng và thợ kỹ thuật, có đối soát của Quản lý dịch vụ).
2. **Loại bỏ Chatbox khỏi Dev 1 (Chat Removal):** Toàn bộ endpoint/entity Chat tạm thời của Dev 1 đã bị thu hồi và xóa sạch nhằm bàn giao chuẩn chỉ cho developer chuyên trách.
3. **Command Endpoints có kiểm soát State Machine:** Các thao tác chuyển trạng thái đơn (`/en-route`, `/check-in`, `/withdraw`, `/request-completion`, `/confirm-completion`, `/pay-cash`) đều enforce kiểm tra vai trò, quyền sở hữu, điều kiện GPS và bằng chứng hình ảnh.
4. **Không dùng Mock Data (Zero Mock Data):** Toàn bộ API trả về dữ liệu thực tế từ cơ sở dữ liệu PostgreSQL.

---

## 2. Chi tiết các Endpoints Mới và Nâng cấp trong v1.4

### 2.1 Customer Booking Reschedule (Đổi lịch hẹn)

#### `POST /api/v1/bookings/:id/reschedule`
- **Actor:** CUSTOMER (chủ sở hữu Booking)
- **Mục tiêu:** Khách hàng đổi ngày hẹn hoặc khung giờ thực hiện dịch vụ trước khi đơn hàng chuyển sang trạng thái sửa chữa.
- **Điều kiện:** Booking chưa bị huỷ; ServiceOrder chưa ở trạng thái `UNDER_REPAIR` hoặc `COMPLETED`.
- **Request Body:**
  ```json
  {
    "scheduledDate": "2026-09-20",
    "scheduledTimeSlot": "14:00 - 16:00",
    "reason": "Bận việc đột xuất cần đổi sang buổi chiều"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Đổi lịch hẹn thành công",
    "data": {
      "id": "b3e944f2-959c-4c07-b371-3cb523f03b22",
      "scheduledDate": "2026-09-20",
      "scheduledTimeSlot": "14:00 - 16:00",
      "status": "ACCEPTED",
      "rescheduleCount": 1,
      "updatedAt": "2026-09-16T08:30:00.000Z"
    }
  }
  ```

---

### 2.2 Technician Withdraw / Trả đơn (Rút khỏi đơn hàng)

#### `POST /api/v1/service-orders/:id/withdraw`
- **Actor:** TECHNICIAN (thợ được phân công)
- **Mục tiêu:** Cho phép thợ rút khỏi đơn hàng trước khi đến nhà khách hàng (`ACCEPTED` hoặc `EN_ROUTE`), ghi nhận lý do minh bạch và tự động kích hoạt điều phối lại ứng viên kế tiếp.
- **Điều kiện:** Đơn hàng chưa `UNDER_REPAIR` (khi đã đến nơi và bắt đầu tháo lắp thì không thể tự ý rút, phải liên hệ Quản lý dịch vụ).
- **Request Body:**
  ```json
  {
    "reason": "Xe bị hỏng giữa đường không thể đến đúng hẹn"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Rút khỏi đơn hàng thành công, hệ thống đã tiếp nhận và điều phối lại",
    "data": {
      "orderId": "d70e1c0d-ff35-430c-b262-d2b528a47d21",
      "previousStatus": "EN_ROUTE",
      "currentStatus": "MATCHING",
      "withdrawnAt": "2026-09-16T09:15:00.000Z"
    }
  }
  ```

---

### 2.3 Payment Security: Dual-Confirmation Cash Payment

#### `POST /api/v1/service-orders/:id/pay-cash`
- **Actor:** TECHNICIAN hoặc CUSTOMER (xác nhận giao dịch tiền mặt tại chỗ)
- **Mục tiêu:** Ghi nhận khoản thu tiền mặt tại chỗ sau khi nghiệm thu sửa chữa hoàn tất, thay thế lỗ hổng gọi API giả mạo `PAID`.
- **Request Body:**
  ```json
  {
    "amountPaid": 450000,
    "note": "Khách hàng đã thanh toán đủ tiền mặt"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Xác nhận thu tiền mặt thành công",
    "data": {
      "orderId": "d70e1c0d-ff35-430c-b262-d2b528a47d21",
      "paymentMethod": "CASH",
      "paymentStatus": "PAID",
      "confirmedBy": "TECHNICIAN",
      "paidAt": "2026-09-16T10:45:00.000Z"
    }
  }
  ```

---

### 2.4 Real Order Dynamic Timeline

#### `GET /api/v1/service-orders/:id/timeline`
- **Actor:** CUSTOMER, TECHNICIAN, SERVICE_MANAGER, ADMIN
- **Mục tiêu:** Lấy toàn bộ lịch sử các mốc thời gian thực từ `OrderStatusHistory`, xóa bỏ hoàn toàn dữ liệu mốc giờ hardcode (`08:30`, `08:45`,...).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "status": "ACCEPTED",
        "title": "Thợ đã nhận việc",
        "description": "Kỹ thuật viên Nguyễn Văn A đã chấp thuận lời mời",
        "timestamp": "2026-09-16T08:00:00.000Z",
        "actor": "Nguyen Van A"
      },
      {
        "status": "EN_ROUTE",
        "title": "Đang di chuyển",
        "description": "Kỹ thuật viên đang trên đường đến địa chỉ của bạn",
        "timestamp": "2026-09-16T08:20:00.000Z",
        "actor": "Nguyen Van A"
      },
      {
        "status": "UNDER_REPAIR",
        "title": "Bắt đầu sửa chữa",
        "description": "Đã check-in GPS và tải ảnh bằng chứng trước khi sửa",
        "timestamp": "2026-09-16T08:45:00.000Z",
        "actor": "Nguyen Van A"
      }
    ]
  }
  ```

---

### 2.5 In-App Notifications Module

#### `GET /api/v1/notifications`
- **Actor:** Mọi người dùng đã đăng nhập (Customer, Technician, Manager, Admin)
- **Query Params:** `page` (default 1), `limit` (default 20), `unreadOnly` (boolean)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "items": [
        {
          "id": "e2a4a754-080d-4091-8d26-bb4d64239851",
          "title": "Kỹ thuật viên đã nhận đơn",
          "content": "Kỹ thuật viên Trần Văn B đã nhận đơn dịch vụ của bạn.",
          "type": "ORDER_STATUS",
          "referenceId": "d70e1c0d-ff35-430c-b262-d2b528a47d21",
          "isRead": false,
          "createdAt": "2026-09-16T08:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "totalPages": 1
    }
  }
  ```

#### `GET /api/v1/notifications/unread-count`
- **Mục tiêu:** Cung cấp số lượng thông báo chưa đọc cho chuông thông báo (Notification Bell).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "unreadCount": 3
    }
  }
  ```

#### `PATCH /api/v1/notifications/:id/read`
- **Mục tiêu:** Đánh dấu một thông báo cụ thể là đã đọc.

#### `PATCH /api/v1/notifications/read-all`
- **Mục tiêu:** Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc.

---

### 2.6 Parts Catalog & Warranty Options

#### `GET /api/v1/parts` & `GET /api/v1/services/:id/parts`
- **Actor:** All authenticated users
- **Mục tiêu:** Cung cấp danh mục linh kiện chính hãng do FixHome cung cấp, phân biệt với linh kiện ngoài do thợ tự mua mang đến.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "id": "part-uuid-01",
        "serviceId": "service-uuid-01",
        "name": "Tụ quạt dàn lạnh Daikin 2.5uF",
        "code": "PART-DK-001",
        "price": 120000,
        "warrantyMonths": 6,
        "isFixHomeProvided": true,
        "description": "Linh kiện chính hãng FixHome cung ứng"
      }
    ]
  }
  ```

---

### 2.7 Standardized Service Areas

#### `GET /api/v1/service-areas`
- **Mục tiêu:** Danh mục khu vực hành chính chuẩn hóa (Hồ Chí Minh, Hà Nội) phục vụ matching thợ, loại bỏ chuỗi tự do (free-text mismatch).
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "provinceCode": "79",
        "provinceName": "Thành phố Hồ Chí Minh",
        "districts": [
          { "districtCode": "760", "districtName": "Quận 1" },
          { "districtCode": "769", "districtName": "Thành phố Thủ Đức" },
          { "districtCode": "770", "districtName": "Quận Bình Thạnh" }
        ]
      }
    ]
  }
  ```

---

### 2.8 Technician Schedule & Platform Dues

#### `GET /api/v1/technicians/me/schedule` & `PUT /api/v1/technicians/me/schedule`
- **Actor:** TECHNICIAN
- **Mục tiêu:** Cài đặt ca làm việc trong tuần (thứ 2 - chủ nhật, các khung giờ hoạt động) phục vụ thuật toán lọc thợ khả dụng khi khách đặt lịch.

#### `GET /api/v1/technicians/me/platform-dues`
- **Actor:** TECHNICIAN
- **Mục tiêu:** Xem chi tiết công nợ nền tảng phát sinh từ hoa hồng dịch vụ hoàn tất và tiền đối soát linh kiện FixHome.

---

## 3. Bảng tổng hợp mã lỗi nghiệp vụ mới (Business Error Codes)

| Mã lỗi | HTTP Status | Diễn giải |
| :--- | :---: | :--- |
| `ERR_RESCHEDULE_NOT_ALLOWED` | 400 | Đơn hàng đã bắt đầu sửa chữa hoặc đã kết thúc, không thể đổi lịch |
| `ERR_SLOT_UNAVAILABLE` | 409 | Khung giờ mới thợ đã kín lịch hoặc ngoài giờ làm việc |
| `ERR_WITHDRAW_FORBIDDEN` | 403 | Thợ đã check-in tại nhà khách, không được phép rút đơn trực tiếp |
| `ERR_PAYMENT_MANUAL_BYPASS` | 400 | Chặn yêu cầu tự set PAID mà không qua xác nhận 2 chiều |
| `ERR_EVIDENCE_REQUIRED` | 422 | Thiếu ảnh BEFORE khi bắt đầu sửa hoặc thiếu ảnh AFTER khi hoàn tất |
| `ERR_GPS_OUT_OF_BOUNDS` | 422 | Khoảng cách GPS vượt quá ngưỡng cho phép tại địa chỉ nhà khách |
