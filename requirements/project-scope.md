# FixHome – Project Scope

> **Baseline**: Master Project Specification v1.4  
> **Last Updated**: 2026-09-16  

## 1. Mục tiêu dự án
FixHome là nền tảng Web + Mobile đặt lịch sửa chữa và bảo trì tại nhà, kết nối:
- Khách hàng (Customer) — Web & Mobile
- Thợ kỹ thuật (Technician) — Web & Mobile
- Quản lý dịch vụ (Service Manager) — Web Admin Portal
- Quản trị viên (Admin) — Web Admin Portal

Hệ thống tích hợp AI hỗ trợ chẩn đoán sơ bộ hư hỏng từ ảnh và mô tả để nâng cao độ chính xác khi phân loại và gợi ý dịch vụ/thợ (vai trò cố vấn - Advisory Only).

---

## 2. Phạm vi hệ thống (In-Scope — Spec v1.4)
- **Quản lý người dùng & phân quyền (RBAC)**: JWT Dual-token, bcrypt, 4 vai trò, sổ địa chỉ, hồ sơ KYC thợ.
- **Quản lý danh mục & linh kiện**: Dịch vụ giá cố định (`FIXED_PRICE`) và khảo sát báo giá (`INSPECTION_REQUIRED`), danh mục linh kiện chính hãng FixHome.
- **Khu vực hoạt động chuẩn hóa**: Danh mục mã hành chính quận/huyện tại Hà Nội và TP.HCM.
- **Đặt lịch (Booking)**: Đặt lịch 5 bước, chọn shortlist tối đa 5 thợ, đổi lịch hẹn (Reschedule) trước khi sửa.
- **Điều phối thợ (Matching & Invitation)**: Gửi lời mời tuần tự, nhận việc với khóa hàng CSDL (`pessimistic_write`).
- **Thợ rút khỏi đơn (Technician Withdrawal)**: Rút đơn trước khi đến nơi, tự động chuyển ứng viên tiếp theo.
- **AI Chẩn đoán (AI Diagnosis)**: Phân tích ảnh/mô tả lỗi, dự đoán nguyên nhân, urgency, ước tính chi phí sơ bộ với cơ chế fallback tự động.
- **Đơn dịch vụ (Service Order State Machine D-22)**: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`.
- **Kiểm soát GPS & Bằng chứng**: GPS Geofence arrival check-in; chốt chặn ảnh `BEFORE` và `AFTER`.
- **Báo giá & Phát sinh**: Báo giá khảo sát bóc tách công/linh kiện, chi phí phát sinh D-11 bất biến với liên kết `supersedesId`.
- **Thanh toán Tiền mặt 2 Chiều (Cash Dual-Confirmation)**: Khách hàng và thợ cùng xác nhận giao dịch tiền mặt, Quản lý dịch vụ đối soát.
- **Thông báo (In-App Notification)**: Module thông báo trong ứng dụng, đếm số tin chưa đọc.
- **Đánh giá & Bảo hành**: Đánh giá D-09 (duy nhất 1 lần/đơn), cấp và quản lý phiếu bảo hành dịch vụ/linh kiện.
- **Mobile Responsive Web**: Thanh điều hướng đáy (Bottom Navigation Bar) cho Customer và Technician trên màn hình di động.

---

## 3. Ngoài phạm vi hiện tại (Out-of-Scope)
- **Module Chat giữa Khách hàng và Thợ**: **HOÀN TOÀN KHÔNG THUỘC PHẠM VI DEV 1**. Các bảng dữ liệu chat đã được drop sạch sẽ qua migration `1725901000000-DropDev1ChatTables.ts` để bàn giao sạch sẽ cho developer chuyên trách.
- **Cổng thanh toán online trực tiếp (VNPay / Momo)**: Đang chờ thông tin Merchant ID và Secret từ đối tác thanh toán; hiện tại quy trình vận hành trơn tru qua Cash Dual-Confirmation.
- **Live GPS tracking thời gian thực liên tục**: Sử dụng trạng thái di chuyển và GPS Check-in tại điểm đến.
- **Quản lý kho vận vật lý phức tạp (Physical Warehouse / Inventory Management)**: Nền tảng quản lý danh mục giá niêm yết linh kiện và nghĩa vụ đối soát công nợ mà không quản lý xuất nhập tồn đa kho.
- **Tích hợp phần cứng IoT / Nhà thông minh**.
