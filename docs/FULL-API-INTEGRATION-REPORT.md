# FixHome — API integration audit và sửa lỗi

Ngày: 16/09/2026. Phạm vi: Backend, Web, Mobile; **AI và chat được loại khỏi đợt sửa/đánh giá này theo yêu cầu**. Lượt cuối ưu tiên kết thúc nhanh, chỉ chạy các gate sẵn có và regression cần thiết.

## A. Executive summary

Backend đã có phần lớn nhóm nghiệp vụ cốt lõi và persistence PostgreSQL; Web có các luồng API thật nhưng còn nhiều trang mẫu; Mobile có lớp API nhưng nhiều màn hình chưa sử dụng. **Chưa đủ bằng chứng để tuyên bố toàn hệ thống hoàn chỉnh end-to-end.**

| Chỉ số yêu cầu | Kết quả có thể chứng minh |
|---|---|
| Backend completeness | Chưa xác định % hoàn thiện sản phẩm. Kiểm kê được 157 route gồm alias, ngoài AI/chat; không phải 157 feature hoàn chỉnh. |
| Web ↔ Backend integration | 79/79 vị trí gọi HTTP với đường dẫn literal có route cùng method: **100% khớp sự tồn tại route trong tập scan**. Không phải 100% tích hợp UI/DTO. |
| Mobile ↔ Backend integration | 24/24 vị trí gọi HTTP với đường dẫn literal có route cùng method: **100% khớp sự tồn tại route trong tập scan**. Không tính được các đường dẫn dựng qua constants bằng phép đếm này. |
| Critical flow readiness | Chưa xác định %. Backend HTTP/DB đã có bằng chứng; chưa chạy browser/device E2E và storage thật. Các bước AI/chat không đánh giá. |
| Automated test result | Backend unit 332/332; Backend HTTP/DB E2E 57/57; Web 109/109; Mobile 2/2. Tổng **500/500 = 100% số test đã chạy**, không phải test coverage hay completeness. |

Quy tắc: `PASS` cho feature đòi hỏi UI → API → DTO → RBAC → business logic → DB → error handling → build/test. Vì chưa chạy UI trên browser/device xuyên suốt, các feature đã nối API bên dưới vẫn ghi `PARTIAL`. Kết quả gate test riêng có thể ghi PASS. `MOCK` nghĩa là có dữ liệu/thao tác giả; `UI ONLY` ghi trong cột nhận xét, không thay status quy định.

## B. Inventory và bằng chứng

- [Inventory đầy đủ: endpoint, method, actor/permission, guard, vị trí client gọi, API chưa có static reference, keyword hits](integration-audit/INVENTORY.md).
- [Bằng chứng máy đọc: controller handler, parameters, implementation body, client expression](integration-audit/inventory.json).
- Tái tạo: `node docs/audit-integration.cjs` từ workspace root. Scanner dùng TypeScript AST, hỗ trợ decorator aliases; không kết luận chỉ từ tên file.

| Layer | Phạm vi source đã thống kê |
|---|---|
| Backend ngoài module AI/chat | 339 file TS; 24 module files; 30 controller files; 27 service files; 48 DTO files; 48 entity files; 7 guard files; 0 gateway files |
| Web | 91 file source; 43 file dưới pages, gồm 42 Vue pages và 1 utility TS |
| Mobile ngoài 2 màn hình AI/chat | 46 file source; 19 screens |

Các số module/service/DTO là số file theo convention, không phải số class hay tỷ lệ feature. Inventory không bao gồm node_modules/dist. Keyword hits không phát hiện hết các array hard-code không có từ khóa; các bảng thủ công bên dưới bổ sung bằng đọc implementation. Không khẳng định đã chứng minh mọi endpoint dưới mọi payload.

## C. Critical issues và kết quả sửa

Đường dẫn ngắn trong bảng tính từ `Backend-FixHome/src`, `Frontend-FixHome/src` hoặc `Mobi-FixHome/src` theo layer.

| ID | Severity | Layer | Issue / impact | File/API | Fix / trạng thái |
|---|---|---|---|---|---|
| SEC-01 | CRITICAL | BE | Customer gọi profile Technician có thể tạo/sửa technician profile | modules/technicians/technicians.controller.ts; /technicians/me/* | Đã thêm JWT + RolesGuard + TECHNICIAN ở class; DTO profile; E2E Customer 403, Technician 200 |
| AUTH-01 | HIGH | Web | Refresh token chưa hoàn chỉnh; logout xóa bearer trước khi revoke | api/client.ts; stores/auth.store.ts; api/auth.api.ts | Đã lưu/rotate refresh token, gom refresh đồng thời, retry một lần, revoke trước clear |
| AUTH-02 | HIGH | Mobile | Refresh queue có thể treo; boot chưa phục hồi session; so sánh role sai | api/client.ts; App.tsx; navigation/AppNavigator.tsx; LoginScreen.tsx | Đã sửa queue, token/store, boot và enum; chưa test device |
| API-01 | HIGH | Web | Tạo booking sai lịch/envelope; fake ID khi lỗi; candidate dùng nhầm ID | api/bookings.api.ts; NewBookingWizardPage.vue | Đã sửa start/end, urgency, unwrap, userId; lỗi không trả booking giả |
| API-02 | HIGH | Web | Sai contract bắt đầu sửa, quotation/decision, evidence; mock order che lỗi | api/orders.api.ts; TechnicianJobDetailPage.vue | Đã sửa endpoint/body/multipart, bỏ fallback order giả |
| FLOW-01 | CRITICAL | Web | Cash action đợi COMPLETED trong khi backend cần cash để hoàn tất; optimistic paid/completed | TechnicianJobDetailPage.vue; CustomerOrderDetailPage.vue | Đã nối request-completion/customer confirmation, bật khai báo theo completion request, reload authoritative state |
| FIN-01 | CRITICAL | BE | Warranty fee hợp lệ gây 409; platform dues cộng cả linh kiện riêng của thợ | modules/finance/finance.service.ts | Đã kiểm tra tổng đúng warranty fee; platform chỉ commission + FixHome parts; E2E đạt |
| API-03 | HIGH | Web | Edit catalog gửi cả entity (id, relation, timestamp…) gây ValidationPipe reject | api/catalog.api.ts | Đã whitelist trường writable; update loại code/id/metadata |
| GEO-01 | HIGH | Web/BE | Address thiếu tọa độ làm booking fail; technician check-in/evidence từng dùng mẫu | address.dto.ts; CustomerProfilePage.vue; TechnicianJobDetailPage.vue | Đã thêm nhập/lấy tọa độ, range validation; GPS và file thật trên Web |
| GEO-02 | HIGH | Mobile | Check-in gửi tọa độ cố định, thiếu accuracy | TechnicianJobsScreen.tsx | Đã bỏ request giả; thông báo chưa hỗ trợ native GPS. Chức năng vẫn PARTIAL, cần implement trước demo Mobile |
| MOB-01 | BLOCKER | Mobile | Matching → tracking → quotation → completed/review là nhiều màn hình mẫu, không truyền order thật xuyên suốt | screens/customer/* trong bảng D | Chưa nối trọn luồng; không thể demo Mobile end-to-end như đã hoàn thành |
| WEB-01 | HIGH | Web | Public tracking/history/strike/boost báo dữ liệu hoặc thành công giả | TrackOrderPage.vue; CustomerHistoryPage.vue; ConsoleStrikesPage.vue; ConsoleCancellationsPage.vue | Còn tồn tại; cần nối API và reload DB |
| FIN-02 | HIGH | BE | Invoice dùng commission.rate_bps nhưng Finance đối chiếu cố định 10% | service-orders.service.ts:906; finance.service.ts:987 | Còn tồn tại khi đổi cấu hình; cần dùng invoice commissionRateSnapshot nhất quán, không tự đổi business rule trong lượt chốt nhanh |
| PAY-01 | HIGH | BE/Web | Provider thanh toán online chưa có implementation thật | finance/unconfigured-payment-verification.adapter.ts | Fail-closed unavailable; không được demo online payment thành công. Web đã bỏ tự gán PAID |
| DTO-01 | MEDIUM | BE | Nhiều inline body types không có runtime validation tương đương DTO class; query parseInt chưa chặn mọi invalid/range | technicians schedule/areas/time-off; booking media; warranty/cancellation review | Cần bổ sung DTO theo từng contract; profile và address đã sửa phần trực tiếp gặp |
| RT-01 | HIGH | Toàn hệ thống | Không có WebSocket gateway/client integration chứng minh được | Inventory gateway=0; không có luồng socket đã nối | NOT IMPLEMENTED; refresh/polling không phải realtime |
| ENV-01 | MEDIUM | Mobile | Device thật không dùng localhost/10.0.2.2 như emulator; shell Node 20.19.5 thấp hơn engines >=22.13 | constants/config.ts; package.json | Android default đã sửa; cần URL LAN/HTTPS và Node 22.13+ trên máy demo/CI |

Không có cơ sở để nói đã xử lý hết BLOCKER/CRITICAL toàn dự án. Các lỗi sửa an toàn ở trên đã qua gate; Mobile end-to-end còn BLOCKER.

## D. Web API integration matrix

Tất cả endpoint nghiệp vụ có prefix `/api/v1`. Các trace đi qua shared Axios client; response global envelope cần unwrap đúng. Cột DB nêu service/entity implementation, không đồng nghĩa đã chạy UI thật.

| Feature | Web page/action → frontend API | Backend controller → service / DB | Request match | Response match | Status |
|---|---|---|---|---|---|
| Register/login/logout/refresh | auth pages → auth store → auth.api/client | AuthController → AuthService → users/session token records | Đã sửa token/revoke | Đã sửa session sync | PARTIAL |
| Customer profile/address | CustomerProfilePage → profile.api | Me/Users/Addresses controllers → UsersService → users/user_addresses | Đã thêm coordinates | Đã unwrap | PARTIAL |
| Public service catalog | ServicesPage | GET /categories, /services có thật | UI dùng danh sách tĩnh | Không lấy catalog thật | MOCK |
| Public service detail | ServiceDetailPage → catalogApi.getService(slug) | GET /services/:id | Route param slug cần đối chiếu UUID endpoint | Catch trả fallbackService mock-1 | MOCK |
| Chọn dịch vụ/địa chỉ/lịch đặt | NewBookingWizardPage → catalog/profile/bookings APIs | BookingsController → BookingsService → bookings snapshots | Đã sửa DTO lịch/urgency/ID | Đã unwrap, không fake booking | PARTIAL |
| Ảnh booking | NewBookingWizardPage; media API | MediaController → MediaService local file; booking media relation | Cần smoke upload/attach thật | URL/persistence chưa browser verify | PARTIAL |
| Chọn thợ | BookingCandidatesPage → bookings.api | GET candidates, POST shortlist → booking_invitations | Đã sửa candidate userId | Đã unwrap | PARTIAL |
| Accept/decline | TechnicianInvitationsPage → bookings.api | InvitationsController → BookingsService → invitations/order/assignment | Match | Đã bỏ success khi decline lỗi | PARTIAL |
| Danh sách/detail orders | CustomerOrders/CustomerOrderDetail; TechnicianJobs/TechnicianJobDetail → orders.api | ServiceOrdersController → ServiceOrdersService → orders/assignments | Match | Normalize lower enums/snapshots, bỏ mock | PARTIAL |
| En route/GPS | TechnicianJobDetail → orders.api | POST en-route/check-in → arrival evidence + order | GPS thật + accuracy | Check kết quả valid | PARTIAL |
| Evidence/start repair | TechnicianJobDetail → multipart/startRepair | ServiceOrdersService → private storage + repair_evidence + status | File,type,note; start-repair | Hydrate evidence/state khi reload | PARTIAL |
| Quotation | TechnicianJobDetail/CustomerOrderDetail → orders.api | QuotationsController → QuotationsService → quotations/items | Endpoint/item enum/action đã sửa | Map envelope/status/items | PARTIAL |
| Additional cost | Chưa có UI đầy đủ | QuotationsController → additional cost records/decisions | Chưa nối Web UI | Chưa nối | NOT IMPLEMENTED |
| Parts/warranty options | TechnicianJobDetail; CustomerWarranties | Quotations/ServiceOrders → items/coverage | Quote dùng linh kiện riêng no_warranty; thiếu UI đầy đủ paid/FixHome options | List warranty chỉ trên trang orders đang tải | PARTIAL |
| Completion/cash | TechnicianJobDetail/CustomerOrderDetail → orders.api | Request/confirm completion; Finance → invoice/settlement/dues | Đã sửa thứ tự + số tiền khai báo | Server authoritative, reload | PARTIAL |
| Online payment | CustomerOrderDetail → payInvoice | FinanceController → unavailable verification adapter | Đã thêm idempotencyKey | Không còn giả PAID; provider chưa có | PARTIAL |
| Customer repair history | CustomerHistoryPage | GET /repair-history có thật | UI ONLY | Records mẫu | MOCK |
| Review/rating | Chưa có action Web thật được xác nhận | POST /service-orders/:id/reviews → ReviewsService/DB | Chưa nối | Chưa nối | NOT IMPLEMENTED |
| Customer dashboard | CustomerDashboard | GET /dashboard/customer | recentOrders hard-code | Không phải DB snapshot | MOCK |
| Technician profile/availability/skills/area | TechnicianProfilePage | /technicians/me/profile, /services, /service-areas… | Nhiều thao tác local | Verified badge/KPI mẫu | MOCK |
| Technician dashboard/earnings | TechnicianDashboard/TechnicianEarningsPage | Dashboard/finance APIs | Dữ liệu tĩnh | Chưa chứng minh payouts DB | MOCK |
| Order operations | ConsoleOrders/ConsoleOrderDetail → orders.api | ServiceOrders → related order queries/DB | Có API thật | Chưa UI E2E | PARTIAL |
| Technician verification review | ConsoleTechnicians → admin verification API | AdminTechnicianVerifications → verification/documents DB | Chỉ Admin có quyền review | Signed storage chưa thật | PARTIAL |
| Catalog/service areas | CatalogManagement/ServiceAreas → APIs | Admin category/service + service-area services/entities | Whitelist catalog đã sửa | Envelopes có adapter | PARTIAL |
| Support/dispute/cash operations | SupportQueue/Detail/CashDetail → support/finance APIs | SupportCases/Finance → support_cases/cash records | Có API/DTO thật | Có tests adapter/component; chưa browser E2E | PARTIAL |
| Cancellation/strike/boost | ConsoleCancellations/ConsoleStrikes | GET/POST cancellations; GET/POST strikes | UI ONLY | Local mutation + success alert | MOCK |
| Admin users/config/parts/audit/dues | AdminUsers/Config/Parts/AuditLogs/PlatformDues → APIs | Admin controllers + PermissionGuard → repositories | Có API/DTO thật | Tests sẵn có đạt; chưa browser E2E | PARTIAL |
| Console dashboard | ConsoleDashboard | GET /dashboard/operations, /system | KPI/pendingOrders mẫu | Không lấy DB thật | MOCK |
| Notifications/realtime | Chưa xác nhận UI API integration | NotificationsController → notification repository; không gateway | Notification UI chưa nối | Không socket event | NOT IMPLEMENTED |

## E. Mobile API integration matrix

Có API wrapper **không đồng nghĩa** screen gọi wrapper. Mobile chỉ có Customer/Technician UI; không coi thiếu console Admin/Manager trên Mobile là lỗi nếu console Web là scope đã chọn.

| Feature | Mobile screen/action | Mobile API → Backend API / persistence | Contract / integration | Status |
|---|---|---|---|---|
| Login/register | LoginScreen/RegisterScreen | auth.api → /auth/login, /register → users | Đã sửa identifier, role lowercase, bỏ fallback credentials | PARTIAL |
| Session/refresh/logout | App/AppNavigator, profile screens | client/auth.api → refresh/logout/me | SecureStore + Zustand/boot/queue đã sửa; chưa device | PARTIAL |
| Home service/category | CustomerHomeScreen | services.api → /categories,/services | Có request nhưng POPULAR_SERVICES/ADDRESSES vẫn tĩnh | PARTIAL |
| Service catalog/detail | CustomerServices/CustomerServiceDetail | services.api có wrapper nhưng screen dùng ALL_SERVICES/detail tĩnh | UI ONLY; pricing fields khác Backend | MOCK |
| Profile/addresses | CustomerProfileScreen | users API → /me,/addresses → DB | Có CRUD; chưa UI tọa độ cho booking | PARTIAL |
| Booking create | Không xác nhận đường screen → createBooking thật ngoài phạm vi loại trừ | bookings.api → POST /bookings có wrapper | Không đánh giá bước AI/chat; chuỗi booking thật chưa được chứng minh | PARTIAL |
| Matching/candidate selection | CustomerMatchingScreen | candidate/shortlist wrappers có; UI dùng TECHNICIANS | Timer/data mẫu; chưa tạo invitation thật từ UI | MOCK |
| Technician found | CustomerTechFoundScreen | Không có order-backed action xuyên luồng | UI ONLY | MOCK |
| Customer orders list | CustomerBookingsScreen | orders.api → /service-orders/my → order DB | Có request; sang màn tracking chưa mang order xuyên suốt | PARTIAL |
| Tracking | CustomerTrackingScreen | Không có request/order state thật xuyên màn hình | Hard-code technician/map/status | MOCK |
| Quotation approve | CustomerQuotationScreen | quotations wrappers có; button chỉ navigation | Không lưu quyết định customer xuống DB | MOCK |
| Under repair | CustomerUnderRepairScreen | Không có state/API đầy đủ | Timeline/cost mẫu | MOCK |
| Completion | CustomerCompletedScreen | Không có confirm-completion thật trên screen | UI ONLY | MOCK |
| Review | CustomerReviewScreen | review wrapper có; submit chỉ success Alert | Không gửi review, không persistence | MOCK |
| Technician home/jobs | TechnicianHome/TechnicianJobs | orders.api → my/en-route | List thật; KPI dựa tập tải hạn chế; GPS đã chặn vì chưa có native implementation | PARTIAL |
| Technician invitations/detail/evidence/quote | Chưa có các screen tương ứng nối đủ | Backend có invitations, evidence, quotation APIs | UI thiếu; không thể hoàn tất đơn từ Mobile | NOT IMPLEMENTED |
| Technician profile/KYC/skills/area | TechnicianProfileScreen | Một phần /me và orders; technician/KYC APIs không có UI đầy đủ | User profile khác technician profile; stats/settings còn local | PARTIAL |
| Notifications | CustomerNotifications/TechnicianNotifications | Backend có GET/PATCH notifications | Arrays tĩnh, không load/read thật | MOCK |
| Additional cost/warranty/payment | Không có UI nối đủ | Wrapper hoặc Backend endpoint có | Chưa đủ screen → action → DB | NOT IMPLEMENTED |
| Realtime | Không có kết nối đã implement | Backend không gateway | Refresh không được tính realtime | NOT IMPLEMENTED |

## F. Broken contracts: đã sửa và còn lại

| Loại | Consumer / hiện tượng | Contract Backend / xử lý |
|---|---|---|
| Endpoint/method | Web start sửa dùng action không đúng | Đã dùng POST /service-orders/:id/start-repair |
| Endpoint/body | Web quotation create/approve | Đã dùng POST /service-orders/:id/quotations và POST /quotations/:id/decision với action |
| Request enum | Web item LABOR/PARTS gửi trực tiếp | Đã map labor/parts_equipment |
| Request | Booking preferredAt và urgency UI | Đã gửi preferredStartAt/preferredEndAt; map urgency lowercase; giữ lịch người dùng |
| Response | Profile/address/booking đọc cả envelope như entity | Đã unwrap data; snapshot names map cho UI |
| Identity | Candidate profile id so với technician userId | Đã dùng userId khi shortlist |
| Upload | Evidence gửi URL mẫu/JSON | Đã dùng multipart File + type + note trên Web; Mobile chưa hỗ trợ |
| Payment | Mobile gửi paymentMethod; Web tự coi tạo payment là paid | Đã gửi idempotencyKey; Web chỉ theo response xác thực của server |
| Request whitelist | Catalog update gửi read-only entity fields | Đã lọc writable fields riêng create/update |
| Remaining parameter | Public ServiceDetailPage lấy route.params.slug rồi gọi /services/:id | Cần dùng canonical ID hoặc contract lookup slug được Backend hỗ trợ; hiện catch che lỗi bằng fallbackService |
| Remaining enum/field | Mobile ServiceItem pricingMode FIXED/CUSTOM_QUOTE; fixedUnitPrice/scope | Backend fixed_price/inspection_required, fixedPrice/scopeDescription; chưa đồng bộ adapter |
| Remaining pagination | Mobile services.getServices dùng pageSize | Services query dùng limit; không được áp dụng một tên pagination cho mọi module |
| Remaining enum | Mobile BookingItem urgency LOW/NORMAL/HIGH/EMERGENCY nhưng normalize uppercases medium/critical | Có thể runtime MEDIUM/CRITICAL trái TS union; cần map hai chiều |
| Lifecycle design | Prompt có Pending Confirmation là order state | DB order chỉ accepted/en_route/under_repair/completed/cancelled; pending hiện nằm ở booking/invitation |

`/me`, `/categories`, `/admin/categories` có controller alias thật: **không phải endpoint missing**. Login Backend có alias email/identifier; sửa Mobile dùng identifier canonical, không kết luận email không tồn tại.

## G. Mock / hard-code còn tồn tại

Các path Web dưới `Frontend-FixHome/src/pages/`, Mobile dưới `Mobi-FixHome/src/screens/`. Đây là các phát hiện đã đọc implementation, không phải lời khẳng định mọi constant đều là mock.

| File | Function/data | Mock/hard-code | Expected API | Severity |
|---|---|---|---|---|
| Web public/TrackOrderPage.vue | handle search / mockFoundOrder | Timer trả order mẫu theo input | Authenticated order lookup; public lookup chưa có contract | HIGH |
| Web public/ServicesPage.vue | catalog arrays | Dịch vụ/giá tĩnh | GET /services, /categories | HIGH |
| Web public/ServiceDetailPage.vue | fallbackService / catch | mock-1 che lỗi API | GET /services/:id với ID thật | HIGH |
| Web public/LandingPage.vue | categories/stats | Marketing số liệu/catalog tĩnh | Catalog/dashboard nếu trình bày là số liệu thật | LOW |
| Web customer/CustomerDashboard.vue | recentOrders | Đơn gần đây mẫu | /dashboard/customer hoặc /service-orders/my | HIGH |
| Web customer/CustomerHistoryPage.vue | history list | Lịch sử/photos mẫu | /repair-history | HIGH |
| Web technician/TechnicianDashboard.vue | KPI/jobs | Mẫu | /dashboard/technician | MEDIUM |
| Web technician/TechnicianEarningsPage.vue | earnings/payouts | Số tiền/lịch sử tĩnh | Finance reporting đã thống nhất | HIGH |
| Web technician/TechnicianProfilePage.vue | skills/area/available/stats | Update local, badge verified tĩnh | /technicians/me/*; verification status | HIGH |
| Web console/ConsoleDashboard.vue | pendingOrders/KPI | Mẫu | /dashboard/operations, /system | MEDIUM |
| Web console/ConsoleCancellationsPage.vue | handleGrantBoost | Local resolved + success alert | POST /cancellations/:id/review | HIGH |
| Web console/ConsoleStrikesPage.vue | confirmWaive | Local waived + success alert | POST /strikes/:id/waive | HIGH |
| Mobile customer/CustomerHomeScreen.tsx | POPULAR_SERVICES/ADDRESSES/offers | Dịch vụ/địa chỉ/khuyến mãi/128 thợ mẫu | Catalog/address APIs; không giả ưu đãi nếu thiếu scope | HIGH |
| Mobile customer/CustomerServicesScreen.tsx | ALL_SERVICES | Danh sách tĩnh | GET /services | HIGH |
| Mobile customer/CustomerServiceDetailScreen.tsx | service detail | Chi tiết dịch vụ tĩnh | GET /services/:id | HIGH |
| Mobile customer/CustomerMatchingScreen.tsx | TECHNICIANS/timer | Ghép thợ giả | candidates + shortlist + invitations | BLOCKER |
| Mobile customer/CustomerTechFoundScreen.tsx | technician/detail | Mẫu | Booking/order assigned technician | HIGH |
| Mobile customer/CustomerTrackingScreen.tsx | map/status | Mẫu | Order/arrival API | HIGH |
| Mobile customer/CustomerQuotationScreen.tsx | costs/approve | Giá mẫu, navigate thay lưu | quotation decision | BLOCKER |
| Mobile customer/CustomerUnderRepairScreen.tsx | progress/cost | Mẫu | Order/approved additional costs | HIGH |
| Mobile customer/CustomerCompletedScreen.tsx | completed summary | UI ONLY | Customer confirmation + invoice | HIGH |
| Mobile customer/CustomerReviewScreen.tsx | submit | Alert thành công không API | POST reviews | HIGH |
| Mobile customer/CustomerNotificationsScreen.tsx | notifications | Array mẫu | GET/PATCH /notifications | MEDIUM |
| Mobile technician/TechnicianNotificationsScreen.tsx | notifications | Array mẫu | GET/PATCH /notifications | MEDIUM |
| Mobile technician/TechnicianProfileScreen.tsx | stats/settings | Một phần user API; stats/settings local | Technician/profile/skills/config APIs | MEDIUM |

Keyword scan bổ sung tại inventory. `setTimeout` dùng animation/navigation, localhost default dev, test mocks không tự động là lỗi sản phẩm. AI/chat không được phân loại hay sửa trong báo cáo này.

## H. Backend APIs có nhưng client chưa dùng đầy đủ

Inventory có từng route và static references; bảng này phân biệt wrapper với UI.

| Backend endpoint | Web | Mobile | Recommendation |
|---|---|---|---|
| GET /dashboard/customer, /technician, /operations, /system | Nhiều dashboard còn mẫu | Home lấy tập orders hạn chế | Dùng aggregate API đúng actor |
| GET/PATCH /notifications… | Chưa có integration xác nhận | Notification screens mẫu | Nối list/count/read trước realtime |
| POST/GET /service-orders/:id/additional-costs; decision/revise | Thiếu UI | Wrapper chưa có screen thật | Nối proposal + approve/reject/revise; reload approved totals |
| POST /service-orders/:id/reviews; GET reviews | Thiếu submit UI | Submit Alert | Gửi orderId thật, chặn duplicate theo Backend |
| GET /repair-history | History mẫu | Chưa trace tới history screen riêng | Nối pagination/history thật |
| GET /technicians/me/profile; schedule/time-off/areas/services mutations | Local profile controls | Thiếu screen đầy đủ | Profile riêng technician, runtime DTO |
| GET/POST cancellations/review; strikes/waive | Local arrays/actions | Không console scope | Nối Web operations và refresh sau action |
| PATCH /bookings/:id/schedule; POST cancel/rebook | Chưa nối đầy đủ UI | Wrapper không chứng minh screen | Tạo action theo state/owner hiện có |
| POST/GET /service-orders/:id/warranty-claims | Chưa có claim flow đầy đủ | Chưa có UI | Nối claim/coverage; không suy warranty từ label |

Aliases có thể không có reference riêng nhưng cùng handler vẫn đang được dùng; không xóa API chỉ vì scanner báo `No static call`.

## I. Missing APIs / implementation

- Forgot/reset password: không thấy route trong AuthController; không tự thêm khi chưa chốt channel xác thực.
- WebSocket notification/order/quotation events: chưa implement gateway/auth subscription.
- Public tra cứu bằng code + phone: chưa có contract/backend lookup tương ứng với TrackOrderPage. Không mở public order endpoint hoặc bỏ ownership để khớp mock UI.
- Real online payment verification adapter: endpoint tồn tại nhưng provider implementation chưa có.
- Dynamic role-management CRUD: không thấy API tổng quát; hiện là roles/permissions được seed và các thao tác quản trị user. Cần xác nhận có nằm trong scope bảo vệ hay không.
- Additional cost, review, history, technician configuration **không thiếu Backend chỉ vì UI chưa nối**; xem mục H.
- Native GPS và các màn hình Mobile thiếu là thiếu client implementation, không phải thiếu Backend.

## J. Authentication, RBAC và security

Flow đã trace: Login → tokens → Web storage/Mobile SecureStore → Authorization Bearer → JWT strategy/guard → Roles/PermissionGuard → service ownership → repository → logout revoke. Web router guard và Mobile navigator chỉ bảo vệ UX.

| Actor | Backend enforcement / bằng chứng | Giới hạn |
|---|---|---|
| Customer | Permission + order/address ownership trong service; E2E sai owner và technician profile 403 | Không coi role guard đủ cho mọi IDOR; chưa thử mọi ID ở mọi endpoint |
| Technician | Own assignment/order guards; không thể dùng Admin KYC review | me/* role đã bổ sung; một số config body chưa DTO class |
| Service Manager | Operations permissions; Admin-only controllers vẫn reject | KYC hiện Admin-only; không tự mở quyền Manager |
| Admin | Admin controllers có JWT + RolesGuard, nhiều route thêm PermissionGuard | Mobile không có console dành Admin/Manager; hiện cần dùng Web |

Registration Backend chỉ customer/technician, không nhận admin/service_manager. Mobile Register hiện chỉ customer. Private KYC/evidence dùng Supabase signed access; chưa kiểm thử credentials/provider thật. General media `/media/files/:filename` là public local-file route: cần phân loại ảnh được phép public, không dùng cho hồ sơ nhạy cảm. Không thay đổi storage architecture trong đợt này.

Mobile dependency install báo 13 moderate advisories; chưa triage dependency audit nên không kết luận security clean hoặc tự chạy `npm audit fix --force`. Runtime dùng Node 20.19.5 chạy được các gate hiện có nhưng chưa đáp ứng engines Mobile >=22.13.

## K. Order state machine và end-to-end trace

`ServiceOrderStateMachine` chỉ cho accepted → en_route → under_repair → completed, với các nhánh cancel và quyền theo role. Completed/cancelled là terminal. Unit tests có accepted→completed, completed→under_repair và terminal/backward rejection. Backend HTTP/DB E2E có owner/GPS/evidence/approval/completion/cash gates; không phải browser/device test.

| Bước | Web | Mobile | Backend/DB và permission | Kết luận |
|---|---|---|---|---|
| Service/address/schedule → create booking | Wizard/API đã sửa | Chưa xác nhận UI submit thật | Booking DTO; owner address; service/address/time snapshot trong bookings | PARTIAL |
| Upload ảnh | Multipart/API có | Chưa screen upload xuyên luồng | General media local; booking_media attachment | PARTIAL; real provider/browser chưa verify |
| Candidates → shortlist | Candidates page có | Matching mẫu | Owner booking; booking_invitations; không order trước Accept | PARTIAL |
| Accept → service order | Invitations page có | Chưa UI đủ | Duplicate Accept/overlap được test; order accepted + assignment/history | PARTIAL |
| En route → arrival | Web GPS thật | GPS chưa hỗ trợ | Assigned technician; distance/accuracy; arrival persistence | PARTIAL |
| Before evidence + quotation | File input/quote API | Chưa screen | Evidence ref; immutable/versioned quotation items; customer decision | PARTIAL |
| Under repair | Start-repair API đã sửa | Screen mẫu | State-machine + required conditions; order update DB | PARTIAL |
| Additional cost | Thiếu UI | Thiếu UI | Owner decision, approved-only totals, revision/expiry checks | PARTIAL |
| Complete/cash/confirmation | Nối lại thứ tự hành động | Screen completed mẫu | Evidence/completion flags; invoice/cash/commission/platform dues; transaction | PARTIAL |
| Review/history | History mẫu, thiếu review UI | Alert/mẫu | Review/history APIs có DB | PARTIAL |

**Pending Confirmation discrepancy:** Backend không có order ở trạng thái này. Booking submitted/matching + pending invitation đứng trước order accepted. Do đó `Pending Confirmation → Accepted/Completed` không thể test như transition enum order hiện có. Cần thống nhất requirement hay mapping trước migration; không tự thêm trạng thái.

**Cancellation discrepancy:** State machine hiện cho customer cancel khi accepted/en_route; operations có thể cancel under_repair. Có rematch khi technician rút trước arrival trên cùng order và lưu assignment history. Đây là khác biệt cần đối chiếu business spec, không được sửa tùy ý. Đã thêm state-machine gate tại đường auto-complete của Finance, chưa khẳng định mọi status write trong toàn repo đều thống nhất.

Quotation service có versions/superseded và kiểm tra trạng thái đã approved; additional cost chỉ được tính khi approved. UI hiện chưa bao phủ toàn bộ linh kiện FixHome/technician, paid warranty và warranty decision/history. Cần kiểm tra thủ công opt-out warranty và lịch sử invoice/version trước tuyên bố giá bất biến đầy đủ.

## L. Contract/error/upload verification

- Backend prefix `/api/v1`; health có exclusions. ValidationPipe whitelist + forbidNonWhitelisted; implicit conversion tắt. Dùng UUID thực, số/boolean JSON đúng type.
- Success envelope: `{ success, statusCode, message, data, meta? }`. Error: `{ success:false, statusCode, error:{code,message,details?}, timestamp, path }`. Frontend phải lấy `error.message`, không giả định message luôn ở root.
- Pagination khác module: catalog dùng page/limit/full meta; một số order/operations dùng pageSize và chỉ total. Không gắn PASS chỉ vì TS compile.
- Web/Mobile shared client timeout 15 giây. Refresh retry hữu hạn; Web có regression đồng thời, failure, 403/login và repeated 401. Chưa giả lập mất mạng trên mọi screen.
- Backend filter che stack/SQL với 500/503; validation/ownership/conflict có HTTP E2E. 422 được filter hỗ trợ nhưng chưa có test route riêng chứng minh; không ép tất cả validation thành 422.
- General upload: jpg/png/webp, magic bytes + MIME, tối đa 10 MB, UUID filename, local filesystem. Repair evidence: private Supabase reference + signed URL + DB evidence record. Không phải Cloudinary/Firebase như mô tả stack ban đầu.
- E2E dùng HTTP/JWT/PostgreSQL thật; **Supabase upload/signed URL được stub** trong `Backend-FixHome/test/dev1-cases.ts`. Vì vậy storage provider/multiple images/device upload/reconnect chưa PASS.

## M. Build/test cuối và giới hạn

| Gate | Kết quả |
|---|---|
| Backend lint, typecheck, build | PASS |
| Backend unit | PASS — 332 tests / 48 files trong đợt sửa |
| Backend HTTP/PostgreSQL E2E cuối | PASS — 57 tests / 1 file; isolated PostgreSQL 16 ở localhost:55432 |
| Web tests | PASS — 109 tests / 14 files; gồm API contract + token-refresh regression |
| Web build/typecheck/lint | PASS — build gồm vue-tsc và Vite |
| Mobile typecheck/lint/tests | PASS — 2 auth-store tests / 1 suite |
| Mobile Expo compatibility | PASS — expo patch ~57.0.23, expo install --check up to date |
| git diff --check | PASS ở Backend/Web/Mobile; CRLF normalization warnings không phải lỗi test |
| Real browser E2E / Android/iOS build/device | NOT VERIFIED |
| Supabase/provider thực, network disconnect toàn màn hình, load/security penetration testing | NOT VERIFIED |
| AI/chat | Ngoài phạm vi; không sửa |

Lượt Backend gần cuối có 56/57 do bài rollback/reapply toàn bộ migrations vượt timeout mặc định 5 giây. Đã tăng riêng bài này lên 30 giây, giữ nguyên assertions; chạy lại toàn bộ E2E đạt 57/57. Không sửa production logic để che timeout. Không bật synchronize, không migrate database dev của nhóm; DB test cô lập và schema test riêng.

## N. Kết luận bàn giao

1. Backend: có nền tảng nghiệp vụ/persistence đáng kể, HTTP/DB suite đạt; còn payment provider, realtime, DTO/config/state-spec gaps.
2. Web: auth, booking/order, quotation/cash và nhiều console API thật; còn các trang mẫu liệt kê ở D/G.
3. Mobile: auth/profile/order list có kết nối; chuỗi booking/repair/review chưa hoàn chỉnh.
4. Hoàn chỉnh end-to-end theo DoD gồm UI: **chưa feature nào được cấp PASS trong đợt kiểm tra này**; không đồng nghĩa tất cả feature hỏng. Backend E2E chứng minh phần server, không thay UI/device.
5. UI ONLY/mock: xem D/E/G; không dùng các màn này để khẳng định dữ liệu được lưu DB.
6. Mismatch: phần đã sửa và còn tồn tại tách rõ ở F.
7. Missing APIs/implementation và API chưa dùng: I/H; không đánh đồng hai nhóm.
8. Ưu tiên tiếp: Mobile end-to-end; public catalog/tracking/history thật; Finance commission snapshot; additional-cost/warranty UI; operations actions thật.
9. Các gate đã chạy sau sửa đạt; native build, storage thật, full UI E2E chưa xác minh.
10. [Final Integration Checklist trước demo](FINAL-INTEGRATION-CHECKLIST.md).
