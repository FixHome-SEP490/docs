# FixHome API — Parts Catalog, Quotations & Additional Costs

> **Base Path**: `/api/v1`  
> **Auth Required**: Bearer JWT (Access Token)  
> **Standard Response Format**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Parts Catalog Endpoints (Danh mục linh kiện chính hãng FixHome)

### 1.1 Get Parts Catalog
- **Method & Path**: `GET /parts`
- **Roles**: All authenticated roles
- **Query Parameters**: `serviceId` (tùy chọn để lọc theo dịch vụ), `search` (tên hoặc mã linh kiện)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "id": "part-uuid-01",
        "serviceId": "service-uuid-01",
        "name": "Tụ ngậm quạt dàn lạnh Daikin 2.5uF",
        "code": "PART-DK-001",
        "price": 120000,
        "warrantyMonths": 6,
        "isFixHomeProvided": true,
        "description": "Linh kiện chính hãng FixHome cung ứng"
      }
    ]
  }
  ```

### 1.2 Get Parts by Service
- **Method & Path**: `GET /services/:id/parts`
- **Roles**: All authenticated roles

---

## 2. Quotation Endpoints (Báo giá dịch vụ)

### 2.1 Create Quotation (Tạo báo giá sau khảo sát)
- **Method & Path**: `POST /quotations`
- **Roles**: `technician` (thợ được phân công cho đơn hàng)
- **Condition**: Đơn hàng đang ở trạng thái `EN_ROUTE` hoặc `UNDER_REPAIR` và chưa có báo giá đã duyệt.
- **Request Body**:
  ```json
  {
    "serviceOrderId": "order-uuid-456",
    "laborCost": 150000,
    "items": [
      {
        "partId": "part-uuid-01",
        "name": "Tụ ngậm quạt dàn lạnh Daikin 2.5uF",
        "quantity": 1,
        "unitPrice": 120000,
        "isFixHomeProvided": true,
        "warrantyMonths": 6
      },
      {
        "name": "Ống đồng Thái Lan 0.71mm (1m)",
        "quantity": 2,
        "unitPrice": 180000,
        "isFixHomeProvided": false,
        "warrantyMonths": 0
      }
    ],
    "note": "Khảo sát thực tế phát hiện quạt chập tụ và xì ống đồng"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Gửi báo giá khảo sát thành công",
    "data": {
      "id": "quote-uuid-789",
      "serviceOrderId": "order-uuid-456",
      "laborCost": 150000,
      "partsCost": 480000,
      "totalAmount": 630000,
      "status": "PENDING_APPROVAL"
    }
  }
  ```

### 2.2 Get Quotation by Order
- **Method & Path**: `GET /quotations/order/:orderId`
- **Roles**: `customer` (chủ đơn), `technician` (thợ phân công), `service_manager`, `admin`

### 2.3 Customer Approve Quotation (Duyệt báo giá)
- **Method & Path**: `POST /quotations/:id/approve`
- **Roles**: `customer`
- **Description**: Khách hàng đồng ý với mức giá khảo sát. Báo giá trở thành bất biến (`APPROVED`), đơn hàng được phép tiến hành sửa chữa (`UNDER_REPAIR`).

### 2.4 Customer Reject Quotation (Từ chối báo giá)
- **Method & Path**: `POST /quotations/:id/reject`
- **Roles**: `customer`
- **Request Body**:
  ```json
  {
    "reason": "Mức giá linh kiện ngoài quá cao so với dự kiến"
  }
  ```

---

## 3. Additional Costs Endpoints (Chi phí phát sinh D-11)

### 3.1 Request Additional Cost (Thợ gửi yêu cầu phát sinh)
- **Method & Path**: `POST /quotations/:id/additional-costs`
- **Roles**: `technician`
- **Condition**: Đơn hàng đang ở trạng thái `UNDER_REPAIR`.
- **Request Body**:
  ```json
  {
    "additionalLabor": 50000,
    "additionalParts": 100000,
    "reason": "Phát hiện mối hàn dàn nóng bị rỉ sét cần gia cố thêm",
    "supersedesId": null
  }
  ```
- **Rule D-11**: Nếu khách từ chối và thợ đề xuất lại, trường `supersedesId` phải trỏ tới ID của yêu cầu phát sinh trước đó để tạo chuỗi lịch sử phiên bản bất biến.

### 3.2 Customer Approve Additional Cost
- **Method & Path**: `POST /quotations/additional-costs/:costId/approve`
- **Roles**: `customer`

### 3.3 Customer Reject Additional Cost
- **Method & Path**: `POST /quotations/additional-costs/:costId/reject`
- **Roles**: `customer`
- **Request Body**:
  ```json
  {
    "reason": "Không có nhu cầu thực hiện hạng mục gia cố thêm"
  }
  ```
