# FixHome – Architecture Overview

> **Version**: Spec v2.1 Ecosystem  
> **Last Updated**: 2026-09-25  

## 1. System Architecture Diagram

```text
+------------------------------------+         +--------------------------------------+
|          Vue.js 3 Web Client       |         |          React Native Mobile         |
|  (Customer, Tech, Manager, Admin)  |         |      (Customer & Technician App)     |
|   32+ pages, Notification Bell,    |         |        Expo SDK 57, Zustand          |
|   Evidence Lightbox, Live Map      |         |                                      |
+------------------+-----------------+         +-------------------+------------------+
                   |                                               |
                   +-----------------------+-----------------------+
                                           | REST API (JWT Dual-Token + RBAC) & Socket.IO
                                           v
                   +-----------------------------------------------+
                   |              NestJS Backend API               |
                   |      (18 Modular Domains, TypeORM, Vitest)    |
                   +-----------+-----------------------+-----------+
                               |                       |
                  TypeORM / SQL|                       | HTTP Client (Axios)
                               v                       v
                   +-----------+----------+  +---------+-----------+
                   | PostgreSQL Database  |  |  FastAPI AI Service |
                   |   (PostgreSQL 16,    |  +---------+-----------+
                   |    33 Migrations)    |            |
                   +-----------+----------+            | Provider Abstraction
                               |                       v
                   +-----------+----------+  +---------+-----------+
                   |  Cloudinary Storage  |  | Gemini / OpenAI API |
                   |  (Signed Access URLs)|  +---------------------+
                   +-----------+----------+
                               |
                   +-----------+----------+
                   |  VNPay Online Gateway|
                   |  (HMAC-SHA512 IPN)   |
                   +----------------------+
```

---

## 2. Actor Platform Mapping

| Actor | Nền tảng chính | Trách nhiệm cốt lõi |
| :--- | :--- | :--- |
| **Customer** | Web & Mobile App | Đăng ký, chụp ảnh chẩn đoán AI, đặt lịch Booking 5 bước, chọn thợ shortlist, đổi lịch hẹn, duyệt báo giá & phát sinh, nghiệm thu hoàn tất, xem thư viện ảnh Before/After/Additional kèm lightbox, nhận thông báo thời gian thực từ chuông thông báo, thanh toán tiền mặt 2 chiều hoặc trực tuyến qua VNPay, đánh giá dịch vụ và yêu cầu bảo hành. |
| **Technician** | Web & Mobile App | Quản lý hồ sơ & chứng chỉ KYC, thiết lập ca làm việc trong tuần, nhận lời mời việc, rút khỏi đơn khi có sự cố trước khi đến nơi, di chuyển, check-in GPS, tải ảnh bằng chứng trước/sau sửa kèm ghi chú, tạo báo giá khảo sát thực tế, yêu cầu linh kiện FixHome và quét QR bàn giao, quyết toán công nợ FixHome. |
| **Service Manager** | Web Admin Portal | Giám sát vận hành đơn hàng, điều phối thợ thủ công khi cần, can thiệp xử lý sự cố / tranh chấp, xuất mã QR bàn giao linh kiện cho thợ, đối soát thanh toán tiền mặt. |
| **Admin** | Web Admin Portal | Quản lý danh mục dịch vụ & giá gốc, quản lý danh mục linh kiện chính hãng (791 món), quản lý tài khoản người dùng, phê duyệt KYC và xác minh kỹ năng thợ, cấu hình hệ thống, kiểm toán vận hành (Audit Logs). |

---

## 3. Nguyên tắc AI Chẩn đoán (AI Advisory Principle)

1. **AI chỉ mang tính tham khảo (Advisory Only)**: Mọi kết quả chẩn đoán từ AI (nguyên nhân, mức độ khẩn cấp, khoảng giá dự tính) đều là gợi ý sơ bộ hỗ trợ khách hàng và thợ, không phải kết luận kỹ thuật tuyệt đối.
2. **Không chặn luồng nghiệp vụ (Non-blocking Fallback)**: Nếu AI Service gặp sự cố (timeout, lỗi provider, rate limit, ảnh không rõ...), hệ thống tự động kích hoạt fallback cho phép khách hàng tự chọn danh mục dịch vụ và tiếp tục tạo Booking bình thường.
3. **Cấu hình ngưỡng tin cậy (Confidence Threshold)**: Nếu điểm confidence của AI thấp hơn ngưỡng cấu hình (mặc định 0.6), hệ thống gắn cờ cảnh báo `isLowConfidence: true` để giao diện hiển thị ghi chú nhắc nhở người dùng.

---

## 4. Lifecycle & State Machine của Service Order (D-22)

```text
         [ Customer Booking: REQUESTED ]
                        │
             (Sequential Invitation)
                        ↓
            [ Technician ACCEPT ] ──(Rút đơn trước khi đến)──> [ RE-DISPATCHING ]
                        │
          (Tạo đơn: ACCEPTED)
                        │
               (Technician Starts)
                        ↓
                  [ EN_ROUTE ] ────(Rút đơn trước khi đến)──> [ RE-DISPATCHING ]
                        │          (Auto-dispatch notif: TECHNICIAN_EN_ROUTE)
            (GPS Check-in + BEFORE Photo)
                        ↓          (Auto-dispatch notif: TECHNICIAN_ARRIVED)
                [ UNDER_REPAIR ] ──(Hủy tùy tiện: BỊ CHẶN, yêu cầu Quản lý hỗ trợ)
                        │
          (Thợ hoàn thành sửa + Báo giá duyệt)
          (AFTER Photo + Thợ báo xong)
                        │          (Auto-dispatch notif: COMPLETION_REQUESTED)
          (Khách nghiệm thu + VNPay / Trả tiền mặt 2 chiều)
                        ↓
                  [ COMPLETED ] (Terminal)
```

Backend kiểm soát chặt chẽ tính hợp lệ của mọi bước chuyển trạng thái (State Transition Validation) và áp dụng chuỗi 5 lớp bảo vệ (Guards chain) cùng khóa dòng cơ sở dữ liệu (`pessimistic_write`).

