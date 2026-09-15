# FixHome – Functional Requirements (FR)

> **Baseline**: Master Project Specification v1.4  
> **Last Updated**: 2026-09-16  

## FR-01: Quản lý Xác thực & Phân quyền (Auth & RBAC)
- Đăng ký và đăng nhập đa nền tảng (Web + Mobile).
- Cơ chế JWT Dual-Token (Access Token 15 phút, Refresh Token 7 ngày với băm SHA-256 trong CSDL).
- Phân quyền chặt chẽ theo 4 vai trò: `Customer`, `Technician`, `Service Manager`, `Admin`.
- Kiểm soát chống truy cập chéo tài nguyên người dùng khác (IDOR & Ownership Guard).

## FR-02: AI Chẩn đoán Sự cố Sơ bộ (AI Diagnosis)
- Khách hàng gửi ảnh chụp thiết bị hỏng + mô tả triệu chứng.
- AI phản hồi gợi ý: chẩn đoán nguyên nhân, mức độ khẩn cấp (Urgency), khoảng giá dự tính sơ bộ, khuyến cáo an toàn ban đầu và danh mục dịch vụ phù hợp.
- Cơ chế Fallback tự động khi AI gặp sự cố (timeout, rate limit) để không làm gián đoạn luồng đặt lịch.

## FR-03: Đặt lịch Sửa chữa (Customer Booking)
- Quy trình Đặt lịch 5 bước (Chọn dịch vụ, địa chỉ, chọn khung giờ, mô tả sự cố & ảnh, chọn ứng viên thợ).
- Khám phá và chọn shortlist tối đa 5 thợ kỹ thuật đủ điều kiện trong khu vực.

## FR-04: Đổi lịch Hẹn (Customer Reschedule)
- Khách hàng chủ động chọn ngày và khung giờ mới trên đơn hàng khi đơn chưa bắt đầu sửa chữa.
- Kiểm tra tính hợp lệ của ca làm việc thợ và xung đột lịch.

## FR-05: Lời mời & Điều phối Thợ (Matching & Sequential Invitation)
- Hệ thống gửi lời mời nhận việc tuần tự tới từng thợ trong shortlist.
- Thợ nhận việc với giao dịch khóa hàng (`pessimistic_write`), đồng thời tạo `ServiceOrder` và `TechnicianAssignment`.

## FR-06: Thợ Rút khỏi Đơn (Technician Withdrawal)
- Thợ có quyền rút lui trước khi check-in tại nhà khách hàng kèm lý do rõ ràng.
- Hệ thống tự động chuyển tiếp lời mời cho ứng viên tiếp theo trong danh sách.

## FR-07: Vòng đời Đơn Dịch vụ (Service Order State Machine D-22)
- Kiểm soát các bước chuyển trạng thái: `ACCEPTED -> EN_ROUTE -> UNDER_REPAIR -> COMPLETED`.
- Bắt buộc Check-in GPS Geofencing tại vị trí nhà khách hàng.
- Chốt chặn bằng chứng ảnh: Bắt buộc có ảnh `BEFORE` trước khi vào `UNDER_REPAIR`; bắt buộc có ảnh `AFTER` trước khi vào `COMPLETED`.
- Chặn hành vi hủy đơn tùy tiện của khách khi thợ đang thao tác sửa chữa (`UNDER_REPAIR`).

## FR-08: Báo giá & Chi phí Phát sinh (Quotations & Additional Costs)
- Thợ gửi báo giá khảo sát thực tế (bóc tách tiền công và tiền linh kiện).
- Khách hàng duyệt hoặc từ chối báo giá.
- Quy định chi phí phát sinh D-11 bất biến với chuỗi liên kết phiên bản `supersedesId`.

## FR-09: Thanh toán Tiền mặt 2 Chiều (Cash Dual-Confirmation)
- Chặn đứng hoàn toàn việc client tự ý gửi trạng thái `PAID`.
- Thợ xác nhận đã nhận đủ tiền mặt từ khách, khách hàng nghiệm thu và xác nhận số tiền; Quản lý dịch vụ đối soát công nợ.

## FR-10: Danh mục Linh kiện & Bảo hành (Parts & Warranties)
- Phân định rõ ràng giữa Linh kiện chính hãng FixHome (hưởng chính sách bảo hành nền tảng 6-12 tháng) và Linh kiện ngoài do thợ tự mua (mặc định không bảo hành, có tùy chọn gói bảo đảm nền tảng).
- Khách hàng xem danh sách phiếu bảo hành và gửi yêu cầu bảo hành cho đơn đã hoàn tất.

## FR-11: Module Thông báo (In-App Notifications)
- Hệ thống thông báo tự động khi có biến động trạng thái đơn, lời mời nhận việc, báo giá mới.
- Chuông thông báo hiển thị số lượng tin chưa đọc theo thời gian thực.

## FR-12: Đánh giá & Phản hồi (Reviews & Ratings - D-09)
- Khách hàng đánh giá sao (1-5) và nhận xét dịch vụ sau khi hoàn tất.
- Ràng buộc duy nhất 1 lượt đánh giá trên mỗi đơn hàng; tự động tính lại điểm trung bình cho thợ.
