# FixHome API — Bookings, Invitations & Service Orders

> **Base Path**: `/api/v1`  
> **Auth Required**: Bearer JWT (Access Token)  
> **Standard Response Format**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Booking Endpoints

### 1.1 Create Booking
- **Method & Path**: `POST /bookings`
- **Roles**: `customer`
- **Description**: Khách hàng khởi tạo lịch hẹn dịch vụ mới (5-step booking wizard).
- **Request Body**:
  ```json
  {
    "serviceId": "099a888c-7f5b-4c07-b371-3cb523f03b01",
    "customerAddressId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    "scheduledDate": "2026-09-20",
    "scheduledTimeSlot": "09:00 - 11:00",
    "description": "Máy lạnh không lạnh, quạt gió kêu to",
    "problemImageUrl": "https://storage.fixhome.vn/evidences/issue-01.jpg",
    "candidateTechnicianIds": [
      "tech-uuid-01",
      "tech-uuid-02"
    ]
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Tạo lịch hẹn thành công",
    "data": {
      "id": "booking-uuid-123",
      "status": "REQUESTED",
      "scheduledDate": "2026-09-20",
      "scheduledTimeSlot": "09:00 - 11:00",
      "createdAt": "2026-09-16T08:00:00.000Z"
    }
  }
  ```

### 1.2 Reschedule Booking (Đổi lịch hẹn)
- **Method & Path**: `POST /bookings/:id/reschedule`
- **Roles**: `customer`
- **Description**: Khách hàng đổi ngày hoặc khung giờ hẹn khi đơn chưa sửa chữa.
- **Request Body**:
  ```json
  {
    "scheduledDate": "2026-09-21",
    "scheduledTimeSlot": "14:00 - 16:00",
    "reason": "Bận việc đột xuất"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Đổi lịch hẹn thành công",
    "data": {
      "id": "booking-uuid-123",
      "scheduledDate": "2026-09-21",
      "scheduledTimeSlot": "14:00 - 16:00",
      "rescheduleCount": 1
    }
  }
  ```

### 1.3 Cancel Booking (Hủy lịch)
- **Method & Path**: `POST /bookings/:id/cancel`
- **Roles**: `customer`, `service_manager`, `admin`
- **Request Body**:
  ```json
  {
    "reason": "Khách hàng không còn nhu cầu"
  }
  ```

---

## 2. Technician Invitations Endpoints

### 2.1 Get My Invitations
- **Method & Path**: `GET /invitations`
- **Roles**: `technician`
- **Description**: Danh sách lời mời nhận việc được gửi tới thợ (hỗ trợ phân trang và lọc trạng thái `PENDING`, `ACCEPTED`, `DECLINED`, `EXPIRED`).

### 2.2 Accept Invitation (Nhận việc - Atomic Row Lock)
- **Method & Path**: `POST /invitations/:id/accept`
- **Roles**: `technician`
- **Description**: Thợ chấp thuận lời mời. Backend thực thi giao dịch với PostgreSQL khóa dòng (`pessimistic_write`):
  - Chuyển Invitation thành `ACCEPTED`.
  - Khởi tạo đồng thời `ServiceOrder` ở trạng thái `ACCEPTED` và `TechnicianAssignment`.
  - Đánh dấu các lời mời cạnh tranh khác của cùng Booking thành `EXPIRED`.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Chấp thuận lời mời thành công, đơn dịch vụ đã được khởi tạo",
    "data": {
      "serviceOrderId": "order-uuid-456",
      "status": "ACCEPTED"
    }
  }
  ```

### 2.3 Decline Invitation (Từ chối lời mời)
- **Method & Path**: `POST /invitations/:id/decline`
- **Roles**: `technician`
- **Request Body**:
  ```json
  {
    "reason": "Trùng lịch bảo trì cá nhân"
  }
  ```
- **Description**: Đánh dấu lời mời thành `DECLINED`. Hệ thống tự động gửi lời mời tiếp theo cho ứng viên thứ 2 trong shortlist.

---

## 3. Service Orders Endpoints (State Machine D-22)

### 3.1 Start Travel (Bắt đầu di chuyển)
- **Method & Path**: `POST /service-orders/:id/en-route`
- **Roles**: `technician` (thợ được phân công)
- **Valid Transition**: `ACCEPTED -> EN_ROUTE`

### 3.2 GPS Arrival Check-in
- **Method & Path**: `POST /service-orders/:id/check-in`
- **Roles**: `technician`
- **Request Body**:
  ```json
  {
    "latitude": 10.7769,
    "longitude": 106.7009
  }
  ```
- **Description**: Xác minh tọa độ GPS thực tế của KTV nằm trong bán kính cho phép tại địa chỉ của khách hàng.

### 3.3 Upload Repair Evidence (Tải ảnh bằng chứng)
- **Method & Path**: `POST /service-orders/:id/evidence`
- **Roles**: `technician`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `file`: Ảnh JPG/PNG/WEBP (tối đa 10MB)
  - `evidenceType`: `'BEFORE'` hoặc `'AFTER'`
  - `caption`: Mô tả tình trạng (tùy chọn)
- **Rule**:
  - Bắt buộc ít nhất 1 ảnh `BEFORE` trước khi chuyển sang `UNDER_REPAIR`.
  - Bắt buộc ít nhất 1 ảnh `AFTER` trước khi chuyển sang `COMPLETED`.

### 3.4 Technician Withdraw (Rút khỏi đơn trước khi đến nơi)
- **Method & Path**: `POST /service-orders/:id/withdraw`
- **Roles**: `technician`
- **Request Body**:
  ```json
  {
    "reason": "Sự cố phương tiện giao thông trên đường"
  }
  ```
- **Condition**: Đơn ở trạng thái `ACCEPTED` hoặc `EN_ROUTE` (chưa check-in và chưa vào `UNDER_REPAIR`).
- **Effect**: Lưu lý do rút đơn, chuyển đơn về trạng thái tìm thợ và điều phối ứng viên tiếp theo.

### 3.5 Request Completion (Thợ yêu cầu hoàn tất)
- **Method & Path**: `POST /service-orders/:id/request-completion`
- **Roles**: `technician`
- **Condition**: Đã tải ảnh `AFTER`, không còn chi phí phát sinh đang chờ duyệt.

### 3.6 Confirm Completion (Khách hàng nghiệm thu)
- **Method & Path**: `POST /service-orders/:id/confirm-completion`
- **Roles**: `customer`
- **Description**: Khách hàng xác nhận dịch vụ đã hoàn thành tốt đẹp.

### 3.7 Dual-Confirmation Cash Payment (Thanh toán tiền mặt 2 chiều)
- **Method & Path**: `POST /service-orders/:id/pay-cash`
- **Roles**: `technician` hoặc `customer`
- **Request Body**:
  ```json
  {
    "amountPaid": 350000,
    "note": "Khách hàng đã thanh toán đầy đủ tiền mặt cho thợ"
  }
  ```
- **Description**: Ghi nhận khoản thu tiền mặt tại chỗ, xác nhận thanh toán hợp lệ và chuyển đơn sang `COMPLETED`. Tuyệt đối chặn client gọi API fake `PAID`.

### 3.8 Dynamic Order Timeline
- **Method & Path**: `GET /service-orders/:id/timeline`
- **Roles**: All authenticated roles
- **Description**: Lấy toàn bộ dòng thời gian thực từ bảng `order_status_history` của cơ sở dữ liệu.

### 3.9 Delete Repair Evidence (Xóa ảnh bằng chứng)
- **Method & Path**: `DELETE /service-orders/:id/evidence/:evidenceId`
- **Roles**: `technician`
- **Description**: Xóa ảnh bằng chứng hư hại hoặc ảnh sau sửa chữa tải nhầm; đồng thời xóa file vật lý trên Cloudinary.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Xóa ảnh bằng chứng thành công"
  }
  ```

### 3.10 Public Order Tracking (Tra cứu tiến độ đơn không cần đăng nhập)
- **Method & Path**: `GET /orders/track?code=:orderCode&phone=:customerPhone`
- **Roles**: Public (Không cần JWT)
- **Description**: Cho phép tra cứu tiến độ đơn hàng và vị trí GPS của thợ di chuyển theo thời gian thực dựa trên mã đơn và số điện thoại khách hàng.

