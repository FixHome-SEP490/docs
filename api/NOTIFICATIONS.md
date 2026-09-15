# FixHome API — Notifications Module

> **Base Path**: `/api/v1/notifications`  
> **Auth Required**: Bearer JWT (Mọi người dùng đã đăng nhập: Customer, Technician, Service Manager, Admin)  
> **Response Format**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Get My Notifications (Lấy danh sách thông báo)

- **Method & Path**: `GET /notifications`
- **Query Parameters**:
  - `page`: number (mặc định 1)
  - `limit`: number (mặc định 20)
  - `unreadOnly`: boolean (lọc riêng tin chưa đọc, tùy chọn)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Lấy danh sách thông báo thành công",
    "data": {
      "items": [
        {
          "id": "e2a4a754-080d-4091-8d26-bb4d64239851",
          "userId": "user-uuid-123",
          "title": "Thợ đã nhận việc",
          "content": "Kỹ thuật viên Nguyễn Văn A đã nhận lịch sửa chữa của bạn.",
          "type": "ORDER_STATUS",
          "referenceId": "order-uuid-456",
          "isRead": false,
          "createdAt": "2026-09-16T08:00:00.000Z"
        }
      ],
      "total": 12,
      "page": 1,
      "totalPages": 1
    }
  }
  ```

---

## 2. Get Unread Notifications Count (Đếm số tin chưa đọc)

- **Method & Path**: `GET /notifications/unread-count`
- **Description**: Dùng để hiển thị badge số đỏ trên biểu tượng quả chuông thông báo (Header Notification Bell).
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "unreadCount": 3
    }
  }
  ```

---

## 3. Mark As Read (Đánh dấu đã đọc 1 tin)

- **Method & Path**: `PATCH /notifications/:id/read`
- **Description**: Cập nhật `isRead = true` cho thông báo có ID tương ứng của người dùng hiện tại (chống IDOR).
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Đã đánh dấu thông báo là đã đọc",
    "data": {
      "id": "e2a4a754-080d-4091-8d26-bb4d64239851",
      "isRead": true
    }
  }
  ```

---

## 4. Mark All As Read (Đánh dấu tất cả là đã đọc)

- **Method & Path**: `PATCH /notifications/read-all`
- **Description**: Cập nhật toàn bộ thông báo chưa đọc của người dùng hiện tại thành `isRead = true`.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Đã đánh dấu tất cả thông báo là đã đọc",
    "data": {
      "updatedCount": 3
    }
  }
  ```
