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

## FR-13: Thư viện Bằng chứng Ảnh & Lightbox Phóng to (Evidence Gallery & Lightbox Viewer)
- Hiển thị toàn bộ ảnh chụp hiện trạng thiết bị của đơn hàng theo 4 tab lọc: Tất cả, Trước khi sửa (`BEFORE`), Sau khi hoàn thành (`AFTER`), Ảnh chi tiết phát sinh (`ADDITIONAL`).
- Hiển thị ghi chú giải thích của kỹ thuật viên và mốc thời gian chụp ảnh thực tế.
- Hộp thoại Lightbox Modal: bấm vào ảnh bất kỳ để phóng to độ phân giải cao, hiển thị huy hiệu loại ảnh và ghi chú đầy đủ.

## FR-14: Bóc Tách Chi Tiết Hạng Mục Đơn Sửa Chữa (Detailed Repair Itemization)
- Bảng danh mục bóc tách minh bạch công việc:
  1. Hạng mục công việc & nhân công sửa chữa (Labor items).
  2. Linh kiện thay thế (Parts items) kèm số lượng, đơn giá và thời hạn bảo hành từng món (`warrantyDays` ngày hoặc theo chuẩn nhà sản xuất).
  3. Chi phí phát sinh đã được khách hàng phê duyệt (Approved Additional Costs).
- Khối tổng kết thanh toán trực quan (Grand Summary Box) phân định rõ tổng tiền công và tiền linh kiện, hiển thị trạng thái thanh toán (`PAID` / `PENDING`).

## FR-15: Trung Tâm Thông Báo & Chuông Thông Báo Khách Hàng (Customer Notification Bell & Center)
- Icon chuông thông báo trên thanh tiêu đề khách hàng (`CustomerLayout.vue`) với badge số đỏ hiển thị lượng tin chưa đọc (tối đa 99+) kèm hiệu ứng động (ping).
- Popover dropdown nhanh với hai tab "Tất cả" và "Chưa đọc", click vào thông báo tự động đánh dấu đã đọc và điều hướng đến chi tiết đơn hàng hoặc đối tượng liên quan.
- Polling ngầm mỗi 30 giây qua Pinia store (`notifications.store.ts`), chỉ kích hoạt khi tab đang hiển thị và người dùng đã xác thực.
- Trang Trung tâm Thông báo toàn diện (`/app/notifications`) hỗ trợ tìm kiếm theo từ khóa, lọc theo nguồn gửi (Kỹ thuật viên / Service Manager / Admin / Hệ thống) và toggle tin chưa đọc.
- Cơ chế tự động gửi thông báo từ backend (Auto-dispatch) khi:
  - Thợ bắt đầu di chuyển (`TECHNICIAN_EN_ROUTE`).
  - Thợ check-in GPS đến nơi thành công (`TECHNICIAN_ARRIVED`).
  - Thợ tải ảnh xong và gửi yêu cầu nghiệm thu (`COMPLETION_REQUESTED`).

## FR-16: Tra Cứu Đơn Hàng Công Khai (Public Order Tracking & Live Map)
- Khách hàng vãng lai tra cứu tiến độ đơn hàng và vị trí GPS của thợ di chuyển theo thời gian thực mà không cần đăng nhập (`POST /service-orders/public/track`).
- Hiển thị bản đồ trực tiếp (Live Map) với lộ trình di chuyển của kỹ thuật viên khi đơn ở trạng thái `EN_ROUTE`.

## FR-17: Cổng Thanh Toán Trực Tuyến VNPay (VNPay Payment Gateway)
- Khởi tạo URL chuyển hướng thanh toán VNPay (`POST /invoices/:id/vnpay-url`).
- Xác minh chữ ký mật mã HMAC-SHA512, tự động xử lý IPN webhook và return URL callback, cập nhật hóa đơn sang `PAID` và hoàn tất đơn hàng.
- Kết hợp song song cùng phương thức Thanh toán tiền mặt xác nhận 2 chiều (Cash Dual-Confirmation).

## FR-18: Quản Trị Vòng Đời Yêu Cầu Linh Kiện FixHome (Parts Request Lifecycle & QR Handover)
- Quản lý danh mục linh kiện chính hãng FixHome (FixHome Parts Catalog) với 791 mặt hàng, thông số, giá niêm yết và chính sách bảo hành.
- Quy trình yêu cầu linh kiện (Parts Request Flow): Thợ đề xuất -> Service Manager chuẩn bị linh kiện và xuất mã QR -> Bàn giao quét mã QR (`qrToken`) -> Cập nhật trạng thái sử dụng (`USED` hoặc `RETURNED`).
- Tự động quyết toán linh kiện khi đơn hàng hoàn tất hoặc đóng yêu cầu linh kiện khi đơn bị hủy.
