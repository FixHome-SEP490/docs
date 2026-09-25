# FixHome — Final Integration Checklist trước demo

Theo audit ngày 16/09/2026. AI/chat ngoài phạm vi. Checkbox chưa chọn là việc chưa có đủ bằng chứng thực hiện, không mặc định là lỗi.

## Gate đã chạy

- [x] Backend lint/typecheck/build; 623 unit tests đạt (80 suites, 100% green).
- [x] Backend HTTP/JWT/PostgreSQL E2E: 57 tests đạt trên database cô lập.
- [x] Web build (gồm typecheck)/lint; 335 tests đạt (39 test suites, 100% green).
- [x] Mobile typecheck/lint; 2 tests đạt; Expo dependencies compatible.
- [x] Customer không dùng được technician profile API sau sửa (403).
- [x] Web booking/order không còn fake success fallback trong các API đã sửa.
- [x] Web refresh concurrency/retry thất bại hữu hạn có regression.
- [x] Web Notification Bell & dropdown, notifications Pinia store đạt 4/4 test cases.
- [x] Order Evidence Storage isolation test suite đạt 100% không leak mock state.

## Smoke demo tối thiểu — dùng dữ liệu thật

- [ ] Máy demo/CI Mobile dùng Node >=22.13; Web VITE_API_BASE_URL và Mobile EXPO_PUBLIC_API_BASE_URL trỏ đúng `/api/v1`; device thật dùng LAN/HTTPS truy cập được.
- [ ] Backend DB/migrations/demo actors sẵn; CORS đúng origin; login riêng Customer/Technician/Manager/Admin.
- [ ] Login, reload/app restart, access token hết hạn, refresh hết hạn, logout: session nhất quán và protected API trả 401/403 đúng.
- [ ] Customer tạo địa chỉ có tọa độ, chọn service ID thật và lịch tương lai; reload vẫn còn địa chỉ/booking.
- [ ] Không dùng public service detail fallback `mock-1`, tracking mẫu hoặc lịch sử mẫu làm bằng chứng API.
- [ ] Booking → candidates → shortlist dùng technician userId thật; Technician nhận invitation thật, Accept; DB chỉ có một order/assignment phù hợp.
- [ ] Technician En Route → GPS thật hợp lệ; từ chối permission GPS không báo check-in thành công; Backend tự động gửi notification `TECHNICIAN_EN_ROUTE` và `TECHNICIAN_ARRIVED` đến Customer.
- [ ] Private evidence storage thật cấu hình; upload ảnh before/after kèm ghi chú thợ; sai MIME/quá 10 MB bị chặn; customer khác không đọc được private evidence.
- [ ] Customer xem thư viện ảnh Before/After/Additional trong `CustomerOrderDetailPage`, bấm mở Lightbox zoom to ảnh nét cao và hiển thị ghi chú của thợ.
- [ ] Customer xem bảng kê chi tiết sửa chữa (tiền công, linh kiện kèm thời hạn bảo hành, chi phí phát sinh đã duyệt và khối tổng kết thanh toán).
- [ ] Chuông thông báo khách hàng: hiển thị badge đỏ số tin chưa đọc, dropdown xem nhanh tab Tất cả / Chưa đọc, click chuyển hướng đến trang đơn hàng tương ứng.
- [ ] Trang trung tâm thông báo `/app/notifications`: tìm kiếm, lọc theo nguồn (Thợ / SM / Admin) và toggle chưa đọc hoạt động mượt mà.
- [ ] Tạo quotation → Customer approve/reject → reload hai bên thấy cùng version/status/total.
- [ ] Additional cost pending không vào tổng; approve/reject được lưu; không sửa giá đã duyệt âm thầm.
- [ ] Kiểm tra riêng FixHome parts, technician parts, warranty fee và commission snapshot khi config thay đổi.
- [ ] Start repair chỉ thành công khi đủ điều kiện; accepted→completed, completed→under_repair, cancelled→under_repair bị Backend reject.
- [ ] Nhóm thống nhất Pending Confirmation thuộc booking/invitation hay order; không tuyên bố đã có enum order này khi chưa implement.
- [ ] Request completion → customer confirmation → cash declaration/confirmation đúng thứ tự Backend; invoice/order/dues giữ đúng khi reload.
- [ ] Không demo online payment thành công với UnconfiguredPaymentVerificationAdapter; VNPay test mode với HMAC-SHA512 checksum và callback URL chuẩn.
- [ ] Review thực sự gửi API và lưu DB; repair history load dữ liệu của đúng Customer.
- [ ] Admin KYC review qua authentication; Technician không tự approve; Manager không được dùng Admin-only API.
- [ ] Console waive strike/priority boost gọi Backend, reload không mất kết quả; bỏ success alert giả trước demo các tính năng này.
- [ ] Các màn Mobile matching/tracking/quotation/completed/review đã nối orderId thật trước khi demo toàn luồng Mobile.
- [ ] Mobile GPS/evidence/invitations có implementation thật; hiện check-in chưa hỗ trợ và đã chặn request tọa độ giả.
- [ ] Timeout/mất mạng/400/401/403/404/409/500 hiện thông báo phù hợp, loading dừng, không tạo dữ liệu mẫu thay lỗi.

## Điều kiện công bố PASS

- [ ] Mỗi feature có bằng chứng UI → API call → endpoint → DTO → RBAC/owner → business logic → DB reload → error handling → build/test.
- [ ] Ghi rõ screen nào MOCK/UI ONLY/PARTIAL; không dùng tỷ lệ test pass làm tỷ lệ hoàn thiện dự án.
- [ ] Lưu kết quả smoke theo actor, booking/order ID của dữ liệu test và expected/actual; không lưu token/credentials/PII trong report.

Chi tiết lỗi, matrix và giới hạn tại [FULL-API-INTEGRATION-REPORT.md](FULL-API-INTEGRATION-REPORT.md).

