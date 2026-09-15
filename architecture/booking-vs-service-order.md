# FixHome – Booking vs Service Order Architecture

> **Version**: Spec v1.4 Baseline  
> **Last Updated**: 2026-09-16  

## 1. Phân biệt cốt lõi (Core Distinction)

Trong hệ thống FixHome, **Booking** và **Service Order** là 2 thực thể độc lập đại diện cho 2 giai đoạn kế tiếp nhau trong vòng đời phục vụ khách hàng:

```text
+-------------------------------------------------------------------------+
|                                GIAI ĐOẠN 1                              |
|                    Customer Request & Scheduling (BOOKING)              |
|                                                                         |
|  Customer -> Chọn dịch vụ -> Ảnh/Mô tả (AI Advisory) -> Chọn giờ/địa chỉ|
|              -> Lọc danh sách thợ khả dụng (Tối đa 5 ứng viên)         |
|                                     ↓                                   |
|                          BOOKING CREATED (REQUESTED)                    |
|                (Hỗ trợ Đổi lịch hẹn trước khi bắt đầu sửa)             |
+-------------------------------------------------------------------------+
                                      ↓
+-------------------------------------------------------------------------+
|                                GIAI ĐOẠN 2                              |
|           Sequential Invitation & Atomic Assignment (INVITATION)        |
|                                                                         |
|         Hệ thống gửi lời mời tuần tự cho từng ứng viên theo thứ tự      |
|             (Ứng viên 1 từ chối/hết hạn -> Tự động chuyển ứng viên 2)   |
|                                     ↓                                   |
|      Thợ bấm CHẤP THUẬN (ACCEPT) với khóa hàng CSDL (Pessimistic Lock)  |
+-------------------------------------------------------------------------+
                                      ↓
+-------------------------------------------------------------------------+
|                                GIAI ĐOẠN 3                              |
|                  Execution & State Machine (SERVICE ORDER)              |
|                                                                         |
|       ACCEPTED ──(Di chuyển)──> EN_ROUTE ──(GPS Check-in + BEFORE Photo)│
|                                             ↓                           |
|      UNDER_REPAIR ──(Báo giá khảo sát / Phát sinh D-11 duyệt)           |
|                   ──(AFTER Photo + Khách nghiệm thu + Tiền mặt 2 chiều) │
|                                             ↓                           |
|                                         COMPLETED                       |
+-------------------------------------------------------------------------+
                                      ↓
+-------------------------------------------------------------------------+
|                                GIAI ĐOẠN 4                              |
|                      Post-Service (REVIEW & WARRANTY)                   |
|                                                                         |
|  - Customer đánh giá thợ D-09 (duy nhất 1 đánh giá / đơn hàng)          |
|  - Lịch sử sửa chữa (Repair History = Query service_orders COMPLETED)   |
|  - Yêu cầu bảo hành (Warranty Claims) theo chính sách linh kiện         |
+-------------------------------------------------------------------------+
```

---

## 2. So sánh chi tiết

| Đặc điểm | Booking (Đặt lịch) | Service Order (Đơn dịch vụ) |
| :--- | :--- | :--- |
| **Mục đích** | Ghi nhận nhu cầu đặt lịch, địa chỉ và ứng viên mong muốn | Quản lý toàn bộ quá trình thực hiện sửa chữa và tài chính tại nhà |
| **Chủ thể khởi tạo**| Khách hàng (Customer) | Hệ thống tự động tạo đồng thời khi KTV đầu tiên bấm `ACCEPT` |
| **Dữ liệu chính** | Dịch vụ, thời gian hẹn, địa chỉ, mô tả, ảnh lỗi ban đầu, danh sách shortlist thợ | KTV phụ trách, trạng thái thực thi D-22, GPS check-in, ảnh BEFORE/AFTER, báo giá chi tiết, các khoản phát sinh, biên nhận tiền mặt |
| **Trạng thái** | `REQUESTED`, `COMPLETED`, `CANCELLED` | `ACCEPTED`, `EN_ROUTE`, `UNDER_REPAIR`, `COMPLETED`, `CANCELLED` |
| **Quyền can thiệp** | Khách hàng có thể Đổi lịch hẹn (Reschedule) hoặc Hủy lịch | KTV cập nhật trạng thái di chuyển/sửa chữa; Khách duyệt báo giá; Cấm hủy tùy tiện khi đang sửa |

---

## 3. Quy tắc Ràng buộc Kỹ thuật

1. **Khởi tạo nguyên tử (Atomic Creation)**: Tuyệt đối không tạo `ServiceOrder` trước khi có KTV chấp thuận lời mời. Khi KTV bấm `ACCEPT`, Backend tạo giao dịch trong CSDL: chuyển Invitation sang `ACCEPTED`, tạo `ServiceOrder` ở trạng thái `ACCEPTED`, gán `TechnicianAssignment`, và đánh dấu các lời mời cạnh tranh khác thành `EXPIRED`.
2. **KTV rút khỏi đơn (Technician Withdrawal)**: Trước khi KTV check-in tại nhà khách (`ACCEPTED` hoặc `EN_ROUTE`), KTV có thể rút lui kèm lý do chính đáng. Hệ thống thu hồi đơn và tự động chuyển quyền nhận việc cho ứng viên tiếp theo trong shortlist.
3. **Chặn hủy đơn khi đang sửa chữa (`UNDER_REPAIR`)**: Khi KTV đã check-in và bắt đầu tháo lắp máy móc, nút "Hủy đơn" của khách hàng bị ẩn và thay thế bằng "Yêu cầu hỗ trợ" để Quản lý dịch vụ can thiệp, tránh việc khách hủy ngang gây thiệt hại cho thợ.
4. **Truy vấn Lịch sử sửa chữa**: Không tạo bảng riêng `repair_history`. Toàn bộ lịch sử được truy xuất trực tiếp từ bảng `service_orders` với điều kiện `status = 'COMPLETED'`.
