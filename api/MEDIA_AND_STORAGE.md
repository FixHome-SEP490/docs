# FixHome API — Media & Cloudinary Storage Boundary

> **Base Path**: `/api/v1`  
> **Auth Required**: Bearer JWT (Access Token)  
> **Storage Provider**: Cloudinary Authenticated Private Storage  
> **Standard Response**: `{ "success": boolean, "statusCode": number, "message": string, "data": any }`

---

## 1. Tổng Quan Kiến Trúc Lưu Trữ (Storage Architecture)

Toàn bộ hình ảnh tài liệu nhạy cảm (CCCD, chân dung thợ, ảnh hiện trạng đặt lịch `booking-photo` và ảnh bằng chứng sửa chữa `order-evidences`) được lưu trữ tại **Cloudinary Authenticated Private Storage** thay vì các bucket công khai.

```text
Client Upload (File Buffer)
        │
        ▼ (Magic Bytes & MIME Validation)
NestJS Backend (OrderEvidenceStorage / PrivateBookingPhotoStorage)
        │
        ▼ (Upload stream với type: 'authenticated')
Cloudinary Private Vault (Không thể truy cập trực tiếp bằng URL thường)
        │
        ▼ (Sinh chữ ký có thời hạn expires_at = now + 300s)
Signed URL (5 phút) trả về cho Client có thẩm quyền xem
```

### 1.1 Quy Chuẩn Định Dạng Tham Chiếu (Reference Format)
Tất cả hình ảnh private được lưu trữ trong cơ sở dữ liệu dưới dạng URI mờ (Opaque Reference URI):
- Bằng chứng sửa chữa đơn hàng: `cloudinary://evidence/fixhome/evidence/{orderId}/{ownerId}/{uuid}`
- Ảnh sự cố đặt lịch của khách hàng: `cloudinary://evidence/fixhome/bookings/{bookingId}/{ownerId}/{uuid}`

Tuyệt đối không lưu URL công khai trần trong cơ sở dữ liệu để chống rò rỉ dữ liệu khách hàng.

### 1.2 Kiểm Tra Tính Toàn Vẹn File (Magic Bytes Validation)
Hệ thống kiểm tra buffer nhị phân thực tế để chống giả mạo header MIME (`Content-Type`):
- **JPEG**: Kiểm tra 3 byte đầu `Buffer.from([255, 216, 255])` (`FF D8 FF`).
- **PNG**: Kiểm tra 8 byte đầu `Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])`.
- **WebP**: Kiểm tra byte 0-4 là `'RIFF'` và byte 8-12 là `'WEBP'`.
- **Kích thước tối đa**: 10 MB. Tệp rỗng (0 bytes) hoặc vượt quá 10MB sẽ bị từ chối với mã lỗi `400 Bad Request`.

---

## 2. Media Endpoints

### 2.1 Tải Ảnh Đặt Lịch Riêng Tư (Booking Photo Upload)
- **Method & Path**: `POST /api/v1/media/booking-photo-upload`
- **Roles**: `customer`
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (ảnh JPG, PNG, WebP)
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "data": {
      "id": "c1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
      "storageReference": "cloudinary://evidence/fixhome/bookings/b1/u1/photo-uuid.png",
      "signedUrl": "https://res.cloudinary.com/demo/image/authenticated/s--signature--/v1/fixhome/bookings/b1/u1/photo-uuid.png"
    }
  }
  ```

### 2.2 Tải Ảnh Bằng Chứng Sửa Chữa (Repair Evidence Upload)
- **Method & Path**: `POST /api/v1/service-orders/:id/evidence`
- **Roles**: `technician` (thợ được phân công đơn)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `file`: Ảnh (tối đa 10MB)
  - `evidenceType`: `'BEFORE'` hoặc `'AFTER'`
  - `caption`: Mô tả (tùy chọn)
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "data": {
      "id": "evidence-uuid-01",
      "serviceOrderId": "order-uuid-123",
      "evidenceType": "BEFORE",
      "storageReference": "cloudinary://evidence/fixhome/evidence/order-123/tech-456/uuid.jpg",
      "signedUrl": "https://res.cloudinary.com/.../authenticated/...",
      "createdAt": "2026-09-24T13:30:00.000Z"
    }
  }
  ```

### 2.3 Xóa Ảnh Bằng Chứng (Evidence Deletion)
- **Method & Path**: `DELETE /api/v1/service-orders/:id/evidence/:evidenceId`
- **Roles**: `technician` (người tải ảnh lên)
- **Hành vi**: Xóa bản ghi trong bảng `order_evidences` và gọi `cld.uploader.destroy()` để hủy object vật lý trên Cloudinary.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Xóa ảnh bằng chứng thành công"
  }
  ```

### 2.4 Cấp URL Chữ Ký Có Thời Hạn (Signed URL Issuance)
- **Thời hạn hiệu lực**: 300 giây (5 phút). Sau 5 phút, URL tự động vô hiệu hóa.
- **Quyền hạn truy cập**: Chỉ chủ sở hữu đơn hàng, kỹ thuật viên phụ trách, Service Manager và Admin mới có quyền yêu cầu tạo Signed URL.
