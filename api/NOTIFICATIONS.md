# FixHome API — Notifications Module

> **Base Path**: `/api/v1/notifications`  
> **Auth Required**: Bearer JWT (Mọi người dùng đã đăng nhập: Customer, Technician, Service Manager, Admin)  
> **Response Format**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Get My Notifications (Lấy danh sách thông báo)

- **Method & Path**: `GET /notifications`
- **Query Parameters**:
  - `page`: number (mặc định 1)
  - `limit`: number (mặc định 20, tối đa 100)
- **Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "e2a4a754-080d-4091-8d26-bb4d64239851",
        "userId": "user-uuid-123",
        "title": "Kỹ thuật viên đang di chuyển",
        "message": "Kỹ thuật viên đang trên đường đến địa chỉ của bạn cho đơn hàng #ORD-2026-001.",
        "type": "TECHNICIAN_EN_ROUTE",
        "referenceId": "order-uuid-456",
        "referenceType": "SERVICE_ORDER",
        "isRead": false,
        "createdAt": "2026-09-25T08:00:00.000Z"
      }
    ],
    "total": 12
  }
  ```

---

## 2. Get Unread Notifications Count (Đếm số tin chưa đọc)

- **Method & Path**: `GET /notifications/unread-count`
- **Description**: Dùng để hiển thị badge số đỏ trên biểu tượng quả chuông thông báo (Header Notification Bell). Frontend poll endpoint này mỗi 30 giây khi tab hiện tại đang active.
- **Response (200 OK)**:
  ```json
  {
    "count": 3
  }
  ```

---

## 3. Send Notification (Gửi thông báo — Admin, SM, Technician)

- **Method & Path**: `POST /notifications`
- **Auth**: Bearer JWT — Roles: `ADMIN`, `SERVICE_MANAGER`, `TECHNICIAN`
- **Description**: Tạo thông báo gửi đến một người dùng cụ thể. Dùng khi thợ/SM/Admin cần thông báo cho khách hàng.
- **Request Body**:
  ```json
  {
    "userId": "customer-uuid-123",
    "title": "Kỹ thuật viên đã đến nơi",
    "message": "Kỹ thuật viên đã có mặt tại điểm hẹn cho đơn hàng #ORD-2026-001.",
    "type": "TECHNICIAN_ARRIVED",
    "referenceId": "order-uuid-456",
    "referenceType": "SERVICE_ORDER"
  }
  ```
- **Validation Rules (class-validator)**:
  - `userId`: UUID (bắt buộc)
  - `title`: string, không rỗng (bắt buộc)
  - `message`: string, không rỗng (bắt buộc)
  - `type`: string (tùy chọn, ví dụ: `INFO`, `TECHNICIAN_EN_ROUTE`)
  - `referenceId`: UUID (tùy chọn, liên kết đến đơn hàng hoặc booking)
  - `referenceType`: string (tùy chọn, ví dụ: `SERVICE_ORDER`, `BOOKING`)
- **Response (201 Created)**:
  ```json
  {
    "id": "notif-uuid-789",
    "userId": "customer-uuid-123",
    "title": "Kỹ thuật viên đã đến nơi",
    "message": "Kỹ thuật viên đã có mặt tại điểm hẹn cho đơn hàng #ORD-2026-001.",
    "type": "TECHNICIAN_ARRIVED",
    "referenceId": "order-uuid-456",
    "referenceType": "SERVICE_ORDER",
    "isRead": false,
    "createdAt": "2026-09-25T09:30:00.000Z"
  }
  ```

---

## 4. Mark As Read (Đánh dấu đã đọc 1 tin)

- **Method & Path**: `PATCH /notifications/:id/read`
- **Description**: Cập nhật `isRead = true` cho thông báo có ID tương ứng của người dùng hiện tại. Chống IDOR: chỉ chủ sở hữu thông báo mới được đánh dấu.
- **Error Cases**:
  - `404 Not Found`: Thông báo không tồn tại.
  - `403 Forbidden`: Thông báo thuộc người dùng khác.
- **Response (200 OK)**:
  ```json
  {
    "id": "e2a4a754-080d-4091-8d26-bb4d64239851",
    "userId": "user-uuid-123",
    "title": "Kỹ thuật viên đang di chuyển",
    "message": "...",
    "isRead": true,
    "createdAt": "2026-09-25T08:00:00.000Z"
  }
  ```

---

## 5. Mark All As Read (Đánh dấu tất cả là đã đọc)

- **Method & Path**: `PATCH /notifications/read-all`
- **Description**: Cập nhật toàn bộ thông báo chưa đọc của người dùng hiện tại thành `isRead = true`.
- **Response (200 OK)**:
  ```json
  {
    "affected": 5
  }
  ```

---

## 6. Notification Entity Schema

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID tự sinh từ BaseEntity |
| `userId` | UUID (FK → users.id) | Người nhận thông báo |
| `title` | VARCHAR(255) | Tiêu đề thông báo |
| `message` | TEXT | Nội dung chi tiết |
| `type` | VARCHAR(50), default `INFO` | Phân loại: `TECHNICIAN_EN_ROUTE`, `TECHNICIAN_ARRIVED`, `COMPLETION_REQUESTED`, `ADMIN_ANNOUNCEMENT`, `SM_ORDER_UPDATE`, ... |
| `referenceId` | UUID, nullable | ID tham chiếu đến entity liên quan (service_order, booking, ...) |
| `referenceType` | VARCHAR(50), nullable | Loại entity: `SERVICE_ORDER`, `BOOKING` |
| `isRead` | BOOLEAN, default `false` | Trạng thái đọc |
| `createdAt` | TIMESTAMP | Thời điểm tạo |

**Database Indexes**:
- `idx_notifications_user_id` — `(userId)` — tăng tốc truy vấn theo user
- `idx_notifications_user_unread` — `(userId, isRead)` — tăng tốc đếm chưa đọc

---

## 7. Auto-dispatched Notification Types (Tự động gửi bởi Backend)

Các thông báo sau được `ServiceOrdersService` tự động gửi đến khách hàng khi đơn hàng chuyển trạng thái:

| Type | Trigger | Nội dung |
| :--- | :--- | :--- |
| `TECHNICIAN_EN_ROUTE` | Thợ bắt đầu di chuyển (`enRoute()`) | "Kỹ thuật viên đang trên đường đến địa chỉ của bạn cho đơn hàng #..." |
| `TECHNICIAN_ARRIVED` | Thợ check-in GPS thành công (`checkIn()` VALID) | "Kỹ thuật viên đã có mặt tại điểm hẹn cho đơn hàng #..." |
| `COMPLETION_REQUESTED` | Thợ yêu cầu nghiệm thu (`requestCompletion()`) | "Kỹ thuật viên đã hoàn thành công việc cho đơn #... Vui lòng kiểm tra và xác nhận." |

> **Lưu ý**: Notification dispatch là **non-blocking** (sử dụng `void` + try/catch). Nếu notification service không khả dụng, luồng nghiệp vụ chính không bị ảnh hưởng. `NotificationsService` được inject với `@Optional()` decorator trong `ServiceOrdersService`.

---

## 8. Frontend Integration (Web)

### 8.1 Notification Bell (Icon Chuông)

- **Component**: `NotificationBellDropdown.vue` — tích hợp vào `CustomerLayout.vue` header
- **Vị trí**: Bên phải nút "Đặt thợ ngay", bên trái avatar người dùng
- **Tính năng**:
  - Badge đỏ hiển thị số thông báo chưa đọc (tối đa `99+`)
  - Ping animation cho badge khi có thông báo mới
  - Dropdown popover với danh sách thông báo (tabs: Tất cả / Chưa đọc)
  - Click thông báo → đánh dấu đã đọc + điều hướng đến đơn hàng/booking liên quan
  - Nút "Đã đọc hết" để đánh dấu tất cả
  - Nút "Xem tất cả thông báo" → `/app/notifications`

### 8.2 Notifications Center Page

- **Route**: `/app/notifications` → `CustomerNotificationsPage.vue`
- **Tính năng**:
  - Tìm kiếm theo nội dung/mã đơn
  - Lọc theo danh mục người gửi: Kỹ thuật viên / Quản lý dịch vụ (SM) / Quản trị viên (Admin)
  - Toggle chỉ hiện thông báo chưa đọc
  - Click → điều hướng đến chi tiết đơn hàng/booking

### 8.3 Notification Category Detection

Frontend tự động phân loại nguồn thông báo dựa trên `type` và nội dung (`title`, `message`):

| Category | Icon | Trigger Keywords |
| :--- | :--- | :--- |
| **Kỹ thuật viên** | 🔧 Wrench (xanh dương) | `TECHNICIAN*`, `COMPLETION_REQUESTED`, `kỹ thuật viên`, `thợ` |
| **Quản lý dịch vụ (SM)** | 🛡️ Shield (tím) | `SM*`, `MANAGER*`, `quản lý`, `điều phối` |
| **Quản trị viên (Admin)** | ✨ Sparkles (vàng cam) | `ADMIN*`, `SYSTEM*`, `hệ thống`, `ban quản trị` |

### 8.4 Polling Mechanism

- **Store**: `notifications.store.ts` (Pinia)
- **Polling interval**: 30 giây (chỉ khi tab đang visible + user đã đăng nhập)
- **Auto-start**: `startPolling()` gọi trong `onMounted` của `NotificationBellDropdown`
- **Auto-cleanup**: `stopPolling()` gọi trong `onUnmounted`
