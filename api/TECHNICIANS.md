# FixHome API — Technicians Module

> **Base Path**: `/api/v1`  
> **Auth Required**: Bearer JWT (Roles: `technician`, `admin`, `service_manager`)  
> **Standard Response Format**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Technician Profile & Operations

### 1.1 Get My Profile
- **Method & Path**: `GET /technicians/me/profile`
- **Roles**: `technician`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "id": "tech-uuid-01",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0901234567",
      "rating": 4.85,
      "ratingCount": 42,
      "verificationStatus": "APPROVED",
      "isActive": true
    }
  }
  ```

---

## 2. Working Schedule (Ca làm việc)

### 2.1 Get Working Schedule
- **Method & Path**: `GET /technicians/me/schedule`
- **Roles**: `technician`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "dayOfWeek": 1,
        "dayName": "Thứ Hai",
        "slots": [
          { "startTime": "08:00", "endTime": "12:00" },
          { "startTime": "13:30", "endTime": "17:30" }
        ],
        "isActive": true
      }
    ]
  }
  ```

### 2.2 Update Working Schedule
- **Method & Path**: `PUT /technicians/me/schedule`
- **Roles**: `technician`
- **Request Body**:
  ```json
  {
    "schedules": [
      {
        "dayOfWeek": 1,
        "slots": [
          { "startTime": "08:00", "endTime": "12:00" },
          { "startTime": "13:30", "endTime": "17:30" }
        ],
        "isActive": true
      }
    ]
  }
  ```

---

## 3. Standardized Service Areas (Khu vực hoạt động)

### 3.1 Get My Service Areas
- **Method & Path**: `GET /technicians/me/service-areas`
- **Roles**: `technician`

### 3.2 Update My Service Areas
- **Method & Path**: `PATCH /technicians/me/service-areas`
- **Roles**: `technician`
- **Request Body**:
  ```json
  {
    "provinceCode": "79",
    "districtCodes": ["760", "769", "770"]
  }
  ```
- **Description**: Kỹ thuật viên chọn các quận/huyện mình có khả năng phục vụ theo danh mục hành chính chuẩn hóa (loại bỏ ô nhập chữ tự do để chống lệch mã matching).

---

## 4. Platform Dues (Công nợ FixHome)

### 4.1 Get Platform Dues Summary
- **Method & Path**: `GET /technicians/me/platform-dues`
- **Roles**: `technician`
- **Description**: Xem danh sách chi tiết các khoản phí hoa hồng dịch vụ (10% công thợ) và tiền linh kiện FixHome cần thanh toán/đối soát.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "totalDue": 125000,
      "items": [
        {
          "id": "due-uuid-01",
          "serviceOrderId": "order-uuid-456",
          "orderCode": "ORD-20260916-01",
          "type": "COMMISSION",
          "amount": 25000,
          "description": "Hoa hồng 10% tiền công đơn hàng ORD-20260916-01",
          "status": "PENDING",
          "createdAt": "2026-09-16T11:00:00.000Z"
        },
        {
          "id": "due-uuid-02",
          "serviceOrderId": "order-uuid-456",
          "orderCode": "ORD-20260916-01",
          "type": "PART_SETTLEMENT",
          "amount": 100000,
          "description": "Tiền linh kiện FixHome xuất kho",
          "status": "PENDING",
          "createdAt": "2026-09-16T11:00:00.000Z"
        }
      ]
    }
  }
  ```
