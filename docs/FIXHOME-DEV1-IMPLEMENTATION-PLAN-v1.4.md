# FIXHOME – DEV 1 IMPLEMENTATION PLAN
## Customer + Technician + Core Booking / Matching / ServiceOrder Flow
**Project:** FixHome  
**Baseline:** Master Project Specification v1.4 – 14/09/2026  
**Target Stack:** NestJS + TypeScript + PostgreSQL/Supabase + React Native + Vue.js/TailwindCSS as applicable  
**Primary Actors:** Customer, Technician  
**Primary Ownership:** Booking, Matching, Recommendation, Shortlist, Invitation, Assignment, ServiceOrder, Arrival, Evidence, Quotation, Additional Cost, Completion, Review, Repair History, Rebooking flow  
**Status:** Execution Guide for Implementation + QA Verification

---

# 1. Mục tiêu của Dev 1

Dev 1 chịu trách nhiệm xây dựng **core marketplace + execution workflow** của FixHome từ lúc Customer chọn dịch vụ đến khi ServiceOrder hoàn tất.

Luồng trung tâm phải chạy được:

```text
Login
→ View Service
→ Select Service
→ Create Booking
→ View eligible Technicians
→ Select / shortlist max 5
→ Sequential Invitation
→ Technician receives Booking
→ Technician Accept
→ CREATE ServiceOrder = ACCEPTED
→ EN_ROUTE
→ Arrival Check-in
→ BEFORE Evidence
→ FIXED_PRICE: Repair base scope
   hoặc
   INSPECTION_REQUIRED: Official Quotation → Customer Approve
→ UNDER_REPAIR
→ Additional Cost nếu phát sinh
→ AFTER Evidence
→ Customer Completion Confirmation
→ Payment condition satisfied
→ COMPLETED
→ Review / Repair History
→ Rebooking
```

## Kết quả tối thiểu cần đạt

Sau khi Dev 1 hoàn thành core scope:

- Customer xem Service thật từ Backend.
- Customer tạo Booking đúng 1 Primary Service.
- Booking có preferred time window.
- Hệ thống lọc Technician hợp lệ.
- Customer shortlist tối đa 5 Technician.
- Invitation chạy tuần tự.
- Technician Accept tạo `ServiceOrder + TechnicianAssignment` atomically.
- State Machine đúng:
  `ACCEPTED → EN_ROUTE → UNDER_REPAIR → COMPLETED`
- Arrival/evidence hoạt động.
- FIXED_PRICE flow chạy không cần quote base scope.
- INSPECTION_REQUIRED flow có Official Quotation + Customer decision.
- Additional Cost có approve/reject.
- Completion có Customer confirmation + payment condition.
- History hiển thị dữ liệu đã snapshot.
- Rebooking tạo **Booking mới**, không reopen Booking cũ.
- Dev 1 không tự viết Auth/KYC/Service Catalog/Part Catalog/Payment infrastructure trùng với Dev 2.

---

# 2. Ownership Boundary – tránh đè code với Dev 2

## 2.1 Dev 1 OWN

```text
src/modules/
├── bookings/
├── booking-media/
├── recommendations/
├── matching/
├── shortlist/
├── invitations/
├── assignments/
├── service-orders/
├── arrival-checkins/
├── repair-evidence/
├── quotations/
├── additional-costs/
├── completion/
├── reviews/
├── repair-history/
└── rebooking/
```

Nếu project không muốn module `rebooking/` riêng thì action rebooking có thể nằm trong `bookings/`.

## 2.2 Dev 1 KHÔNG OWN

Không tự sửa business authority chính trong:

```text
auth/
users/
roles/
technician-verification/
services/
service-categories/
parts-catalog/
configs/
payments/
cash-settlements/
platform-dues/
support/
audit/
admin/
```

Dev 1 chỉ gọi public service/API contract do Dev 2 cung cấp.

## 2.3 Shared code dễ conflict

Các phần shared phải thống nhất trước:

```text
Role enum
PricingMode enum
VerificationStatus enum
PaymentStatus enum
shared API response format
pagination
common exception
app.module.ts
database schema root
```

Không tự duplicate enum ở module riêng.

---

# 3. Business Rules bắt buộc Dev 1 phải giữ

## 3.1 Booking

- 1 Booking = 1 Primary Service.
- Related work cùng job → Quotation / Additional Cost trong cùng ServiceOrder.
- Service khác hoàn toàn → Booking mới.
- Customer chọn preferred time window.
- ServiceOrder chưa tồn tại trong matching.
- Reschedule chỉ trước khi repair bắt đầu và phải check state + Technician availability.
- Booking lifecycle phải tách khỏi ServiceOrder lifecycle.

## 3.2 Matching

Hard filters chạy trước ranking:

- Technician VERIFIED.
- account/work status active.
- service phù hợp.
- schedule phù hợp.
- không Time Off.
- không conflict active assignment.
- service area phù hợp.
- operational availability.
- không active work suspension.
- không active unpaid PlatformDue.

Sau đó:

```text
eligibleSet
→ conventional ranking
→ optional AI soft reranking
```

AI failure không được block matching.

## 3.3 Shortlist / Invitation

- Customer shortlist tối đa 5.
- Chỉ shortlist Technician qua hard filter.
- Có priority order.
- Invitations gửi sequential.
- Re-check eligibility trước mỗi invitation.
- Decline trước Accept không phải cancellation strike.
- Invitation hết hạn không được Accept.
- Accept hợp lệ không cần Customer confirm Technician lần 2.

## 3.4 Accept Transaction

Accept phải atomically:

```text
lock invitation/booking context
→ validate invitation active
→ re-check Technician eligibility
→ mark invitation ACCEPTED
→ create ServiceOrder(status=ACCEPTED)
→ create TechnicianAssignment(status=ACTIVE)
→ close/cancel remaining open invitations
→ commit
```

Không được tạo ServiceOrder từ lúc Customer Submit Booking.

## 3.5 ServiceOrder

Canonical State Machine:

```text
ACCEPTED
→ EN_ROUTE
→ UNDER_REPAIR
→ COMPLETED

ACCEPTED      → CANCELLED
EN_ROUTE      → CANCELLED
UNDER_REPAIR  → CANCELLED only allowed exception/business rule
```

Không dùng `ARRIVED`, `QUOTE_PENDING`, `AWAITING_PAYMENT` làm ServiceOrderStatus nếu chỉ là milestone phụ.

## 3.6 Pricing

### FIXED_PRICE

- Admin quản price.
- Booking snapshot price + quantity + scope.
- Technician không sửa fixed price.
- base scope không cần Official Quotation.
- phát sinh ngoài scope → Additional Cost.

### INSPECTION_REQUIRED

- Listed Labor Price chỉ reference.
- Official Quotation sau assignment + arrival + inspection.
- Customer Approve mới binding.

## 3.7 Parts

- Mọi Parts item có source:
  - FIXHOME
  - TECHNICIAN
- Parts không commission.
- FIXHOME Part price/warranty lấy từ Part Catalog.
- TECHNICIAN Part phải explicit name/price.
- TECHNICIAN Part mặc định `NO_WARRANTY`.
- Optional paid warranty nếu Customer chọn:
  - warrantyFee
  - warrantyTerm
  - provider = Technician
- Không invent inventory.

## 3.8 Completion

COMPLETED chỉ khi:

- work completed;
- AFTER evidence/completion note theo policy;
- Customer confirmation hoặc audited exception;
- payment condition satisfied;
- không còn required approval blocking.

Dev 1 không được tự set Payment=PAID.

---

# 4. Thứ tự triển khai Dev 1

Khuyến nghị:

```text
D1-00 Current Code Review + Contract Lock
        ↓
D1-01 Customer Service Discovery
        ↓
D1-02 Booking
        ↓
D1-03 Booking Media / Address / Schedule
        ↓
D1-04 Technician Recommendation + Hard Filter
        ↓
D1-05 Shortlist
        ↓
D1-06 Sequential Invitation
        ↓
D1-07 Technician Invitation Inbox
        ↓
D1-08 Accept Transaction + Assignment
        ↓
D1-09 ServiceOrder State Machine
        ↓
D1-10 En Route + Arrival
        ↓
D1-11 Repair Evidence
        ↓
D1-12 Fixed Price Execution
        ↓
D1-13 Official Quotation
        ↓
D1-14 Parts Source / Warranty Snapshot Integration
        ↓
D1-15 Additional Cost
        ↓
D1-16 Completion Confirmation
        ↓
D1-17 Payment Completion Integration
        ↓
D1-18 Booking / Repair History
        ↓
D1-19 Review
        ↓
D1-20 Rebooking
        ↓
D1-21 Reschedule / Cancellation Recovery
        ↓
D1-22 Realtime / Notifications Integration
        ↓
D1-23 Full Integration + Regression + Security
```

Nếu deadline gấp, ưu tiên `D1-01 → D1-12 → D1-16 → D1-20`.

---

# 5. TASK D1-00 – Current Code Review + Contract Lock

## Mục tiêu

Không code mới trước khi biết các module đã có và API nào thuộc Dev 2.

## Việc cần làm

- Run Backend.
- Run Customer/Technician UI.
- Kiểm tra schema hiện tại.
- Kiểm tra Booking hiện có.
- Kiểm tra ServiceOrder có bị tạo quá sớm không.
- Kiểm tra state enum.
- Kiểm tra matching hiện tại.
- Kiểm tra invitation lifecycle.
- Kiểm tra relation Booking → ServiceOrder.
- Kiểm tra auth service contract.
- Kiểm tra Service Catalog API.
- Kiểm tra Technician verification field authority.
- Kiểm tra PlatformDue gate.
- Kiểm tra Payment API.

## Deliverable

`docs/dev1-current-code-gap.md`

Table:

```text
Module | Current Behavior | v1.4 Rule | Gap | Action
```

## Done Check

- [ ] Không duplicate Booking module.
- [ ] Biết ServiceOrder hiện được tạo khi nào.
- [ ] Biết exact API của Dev 2.
- [ ] Biết schema/migration convention.
- [ ] Biết mobile/web nào dành cho Customer/Technician.
- [ ] Có danh sách breaking conflict cần PM/Leader xử lý.

---

# 6. TASK D1-01 – Customer Service Discovery

## Actor

Customer

## Dependency Dev 2

```http
GET /services
GET /services/:id
```

## Mục tiêu

Customer xem và chọn Service thật từ Service Catalog.

## UI

### Customer Service List

Hiển thị:

- name
- category
- pricing mode
- fixed price nếu FIXED_PRICE
- reference range nếu có
- unit
- scope description

Không hiển thị Listed Labor Price như fixed official price.

## Business Validation

- chỉ active service.
- không hard-code Service ở frontend.
- FIXED_PRICE hiển thị base price rõ.
- INSPECTION_REQUIRED phải ghi là cần kiểm tra/báo giá sau inspection.

## Test

- service active visible.
- service inactive hidden.
- fixed price render đúng.
- inspect required không hiển thị sai binding price.

## Done Check

- [ ] API data thật.
- [ ] UI loading/error/empty.
- [ ] pricingMode hiển thị đúng.
- [ ] Customer chọn được `primaryServiceId`.
- [ ] Không hard-code catalog.

---

# 7. TASK D1-02 – Booking Core

## Actor

Customer

## Entity

### Booking

Direction:

```text
id
customerId
primaryServiceId
problemDescription
preferredStartAt
preferredEndAt
status
repairAddressId/ref?
fixedUnitPriceSnapshot?
fixedQuantity?
fixedScopeSnapshot?
createdAt
updatedAt
```

Exact BookingStatus enum còn TBD trong source.

Khuyến nghị implementation:

```text
SUBMITTED
MATCHING
MATCHED
CANCELLED
CLOSED
```

Đây là **implementation recommendation**, không phải enum FINALIZED của spec.

## API

```http
POST /bookings
GET  /bookings/:id
GET  /bookings/me
```

Create DTO:

```json
{
  "primaryServiceId": "...",
  "problemDescription": "...",
  "repairAddressId": "...",
  "preferredTimeWindow": {
    "start": "...",
    "end": "..."
  },
  "quantity": 1
}
```

## Business Rules

- 1 Primary Service.
- owner = current Customer từ JWT, không nhận `customerId` tùy ý.
- preferred start < preferred end.
- service active.
- FIXED_PRICE:
  - snapshot unit price
  - snapshot quantity
  - snapshot scope
- không tạo ServiceOrder.

## Transaction

Create Booking nên atomically lưu:

- Booking
- fixed snapshot nếu có
- linked address snapshot/ref
- initial media references nếu trong cùng request strategy

## Test

- valid Booking.
- inactive service.
- invalid window.
- quantity <= 0.
- technician gọi create → 403.
- create Booking không tạo ServiceOrder.

## Done Check

- [ ] Booking tồn tại độc lập.
- [ ] ServiceOrder count vẫn 0 sau submit.
- [ ] Owner đúng JWT.
- [ ] Fixed Price snapshot đúng.
- [ ] DTO validation.
- [ ] Integration test pass.

---

# 8. TASK D1-03 – Booking Media + Address + Schedule

## Actors

Customer

## Booking Media

Entity direction:

```text
id
bookingId
storageRef
mediaType
createdAt
```

## File Rules

- image MIME allowlist.
- size limit.
- count limit.
- private storage/reference.
- không trust filename.
- ownership validation.

## Address

Spec cho phép RepairAddress entity + Booking snapshot/ref.

Khuyến nghị:

Booking phải giữ enough snapshot để lịch sử không đổi nếu Customer sửa address book sau này.

Ví dụ:

```text
addressTextSnapshot
latitudeSnapshot
longitudeSnapshot
```

hoặc ref + immutable snapshot fields tương đương.

## Preferred Time Window

```text
preferredStartAt
preferredEndAt
```

Không phải exact arrival minute.

## API

```http
POST /bookings/:id/media
DELETE /bookings/:id/media/:mediaId   // chỉ trước rule lock phù hợp
PATCH /bookings/:id/schedule
```

## Done Check

- [ ] Customer khác không upload vào Booking không phải của mình.
- [ ] private file.
- [ ] MIME/size/count validated.
- [ ] time window valid.
- [ ] historical address snapshot không đổi ngoài ý muốn.

---

# 9. TASK D1-04 – Technician Recommendation + Hard Filter

## Actors

Customer

## Mục tiêu

Trả về Technician đủ điều kiện cho Booking/Service context.

## Dependency Dev 2

Dev 2 cung cấp:

- verification status
- account status
- TechnicianService
- Service
- PlatformDue gate
- config nếu có

## Hard Filter

Pseudo:

```ts
eligible =
  verified
  && accountActive
  && workingActive
  && offersService
  && scheduleAvailable
  && !approvedTimeOff
  && !assignmentConflict
  && inServiceArea
  && operationalAvailable
  && !workSuspended
  && !hasActiveUnpaidPlatformDue
```

## Ranking

Conventional rank có thể dùng:

- distance
- rating
- service fit
- experience
- availability/workload
- priority boost
- admin weights

Exact formula không được coi là FINALIZED.

## AI

AI soft reranking:

```text
hard filter
→ conventional rank
→ try AI rerank
→ AI fail/timeout?
   return conventional rank
```

Không cho AI add Technician fail hard filter.

## API

```http
GET /technicians/recommendations?bookingId=...
```

hoặc service-context equivalent.

## Response

```text
technicianId
profile
rating
distance
listedLaborPrice
typicalWarranty
availabilitySummary
```

Không expose private KYC.

## Tests

- unverified excluded.
- wrong service excluded.
- schedule conflict excluded.
- unpaid PlatformDue excluded.
- AI fail vẫn có result.
- hard-filtered Tech không được AI add lại.

## Done Check

- [ ] hard filter server-side.
- [ ] reason/query test được.
- [ ] AI optional.
- [ ] private fields hidden.
- [ ] deterministic fallback.

---

# 10. TASK D1-05 – Customer Shortlist max 5

## Actor

Customer

## Entity

### BookingShortlist / CandidatePreference

```text
id
bookingId
technicianId
priority
createdAt
```

## Constraints

- max 5.
- priority unique within Booking.
- technician unique within Booking.
- only eligible Technician.
- Booking owner only.

## API

```http
PUT /bookings/:id/shortlist
```

DTO:

```json
{
  "technicians": [
    {"technicianId": "A", "priority": 1},
    {"technicianId": "B", "priority": 2}
  ]
}
```

## Business Rule

Backend re-check eligibility lúc set shortlist.

Không trust recommendation result cache như authority.

## Test

- 1..5 valid.
- 6 Tech → 400.
- duplicate Tech → 400.
- duplicate priority → 400.
- ineligible Tech → reject.
- other Customer → 403.

## Done Check

- [ ] max 5 enforce DB/service.
- [ ] ordered.
- [ ] ownership.
- [ ] eligibility re-check.

---

# 11. TASK D1-06 – Sequential Invitation Engine

## Actors

System + Technician

## Entity

### BookingInvitation

```text
id
bookingId
technicianId
priority
status
sentAt
expiresAt
respondedAt?
createdAt
```

Status:

```text
PENDING
ACCEPTED
DECLINED
EXPIRED
CANCELLED
```

## Flow

```text
Booking shortlist ready
→ pick priority #1
→ re-check eligibility
→ create/send invitation
→ wait accept/decline/expire
→ if decline/expire:
   priority #2
→ ...
→ max 5
```

## Rules

- chỉ một invitation active tại một thời điểm cho normal sequential flow.
- trước mỗi invite phải re-check eligibility.
- stale invitation cannot accept.
- decline không strike.
- all 5 fail → refresh/reselect normal flow trước Manager escalation.

## Background Handling

Nếu cần expiration:

- scheduler/cron/job hoặc request-time expiration strategy.
- không cần queue platform phức tạp nếu scope nhỏ.

## Done Check

- [ ] sequential đúng.
- [ ] không send 5 cùng lúc.
- [ ] expiration handled.
- [ ] next candidate triggered.
- [ ] 5 failed path returns Customer to refresh/reselect.

---

# 12. TASK D1-07 – Technician Invitation Inbox

## Actor

Technician

## API

```http
GET /invitations/me
GET /invitations/:id
POST /invitations/:id/decline
```

Accept nằm task riêng.

## UI

Hiển thị:

- Customer problem summary
- primary service
- media permitted
- repair area/address data phù hợp privacy
- preferred window
- fixed base price hoặc reference info
- chat access theo Booking policy nếu module chat đã có

## Security

Chỉ invited Technician xem invitation đó.

Không expose full Customer private data ngoài requirement.

## Decline

- set `DECLINED`
- trigger next sequential invitation
- no strike

## Done Check

- [ ] technician chỉ thấy invitation của mình.
- [ ] decline idempotent hoặc duplicate-safe.
- [ ] next candidate invited.
- [ ] no strike creation.

---

# 13. TASK D1-08 – Accept Transaction + Assignment

## Đây là task critical nhất

## Actors

Current invited Technician

## API

```http
POST /invitations/:id/accept
```

## Transaction bắt buộc

```text
BEGIN
lock invitation / booking context

validate:
- invitation=PENDING
- not expired
- Booking not already matched
- Technician still eligible
- no active unpaid PlatformDue
- schedule still valid
- no conflict

mark invitation ACCEPTED

create:
ServiceOrder
  bookingId
  status=ACCEPTED

create:
TechnicianAssignment
  serviceOrderId
  technicianId
  status=ACTIVE

mark Booking matched

cancel remaining open invitations

COMMIT
```

## Race Conditions cần test

- Technician double click.
- invitation expire đúng lúc accept.
- hai invitation do bug cùng active và cùng accept.
- Booking already matched.
- Technician vừa có conflict mới.
- Technician vừa có PlatformDue.

## DB Strategy

Dùng:

- transaction
- row lock / equivalent ORM locking
- unique/conditional constraint nếu khả thi
- application guard

## Test bắt buộc

Concurrent accept test.

Expected:

```text
1 ServiceOrder
1 active Assignment
1 accepted Invitation
remaining invitations cancelled
```

## Done Check

- [ ] ServiceOrder chỉ tạo tại Accept.
- [ ] initial status ACCEPTED.
- [ ] atomic.
- [ ] no double assignment.
- [ ] stale accept rejected.
- [ ] eligibility re-check.
- [ ] notification publish sau commit.

---

# 14. TASK D1-09 – ServiceOrder State Machine

## Actors

Technician / Customer tùy command

## Entity

### ServiceOrder

```text
id
bookingId
status
createdAt
updatedAt
completedAt?
cancelledAt?
```

Historical fields bổ sung theo schema thực tế.

## Canonical States

```text
ACCEPTED
EN_ROUTE
UNDER_REPAIR
COMPLETED
CANCELLED
```

## State Service

Khuyến nghị centralize:

```ts
canTransition(from, to, context)
transition(order, to, actor)
```

Không rải:

```ts
if status...
```

khắp controller.

## Allowed normal transitions

```text
ACCEPTED → EN_ROUTE
EN_ROUTE → UNDER_REPAIR
UNDER_REPAIR → COMPLETED
```

Cancellation theo explicit rules.

## Preconditions

### ACCEPTED → EN_ROUTE

- assigned Technician.
- assignment active.

### EN_ROUTE → UNDER_REPAIR

Phụ thuộc pricing mode:

FIXED_PRICE:
- arrival/check-in/evidence policy satisfied.
- base scope accepted from Booking snapshot.
- all required parts/additional approvals satisfied if already introduced.

INSPECTION_REQUIRED:
- arrival valid.
- Official Quotation APPROVED.
- required parts source/warranty approvals included.

### UNDER_REPAIR → COMPLETED

Không direct command nếu completion/payment conditions chưa đủ.

## Tests

- illegal skip ACCEPTED→UNDER_REPAIR.
- Customer cannot mark En Route.
- non-assigned Tech forbidden.
- completed immutable normal flow.

## Done Check

- [ ] central state guard.
- [ ] actor checked.
- [ ] preconditions checked.
- [ ] illegal transition test.
- [ ] audit/timeline event if project implements.

---

# 15. TASK D1-10 – En Route + Arrival Check-in

## Actors

Assigned Technician / Customer view

## API

```http
POST /service-orders/:id/en-route
POST /service-orders/:id/arrival-check-ins
GET  /service-orders/:id/arrival-check-ins
```

## Arrival Entity

```text
id
serviceOrderId
technicianId
latitude
longitude
accuracy
distanceToRepairAddress
verificationResult
checkedInAt
```

## Rule

Mobile gửi GPS.

Backend:

- validate assignment.
- calculate distance.
- check geofence threshold.
- consider accuracy threshold.
- abnormal không auto-verified.

Google Maps hỗ trợ map/geocoding/route, nhưng không phải sole proof.

## Status

Arrival không cần thành ServiceOrderStatus riêng.

## Abnormal

```text
poor accuracy
outside geofence
→ retry
or
→ Manager/manual evidence path
```

## Security

Không cho client tự gửi:

```text
verified=true
distance=10m
```

và backend tin.

## Done Check

- [ ] assigned Tech only.
- [ ] backend computes validation.
- [ ] geofence config.
- [ ] abnormal path.
- [ ] Customer view appropriate arrival status.
- [ ] no fake client verification.

---

# 16. TASK D1-11 – Repair Evidence

## Actor

Assigned Technician

## Entity

### RepairEvidence

```text
id
serviceOrderId
type
storageRef
note?
uploadedBy
createdAt
```

Type:

```text
BEFORE
AFTER
ADDITIONAL
```

## API

```http
POST /service-orders/:id/evidence
GET  /service-orders/:id/evidence
```

## Storage

Supabase Storage/private policy theo baseline.

## Rules

- assigned Technician upload.
- Customer owner view permitted.
- BEFORE trước repair.
- AFTER trước completion.
- Additional evidence optional/required by policy.

## Validation

- file type.
- file size.
- count.
- status/timing.
- ownership.

## Done Check

- [ ] private storage.
- [ ] type validation.
- [ ] correct order ownership.
- [ ] BEFORE/AFTER usable in timeline.
- [ ] completion precondition có thể query evidence.

---

# 17. TASK D1-12 – FIXED_PRICE Execution

## Mục tiêu

Đây là happy path nên code sớm nhất.

## Actor

Customer + Technician

## Booking Snapshot

Dev 1 phải lưu:

```text
fixedUnitPriceSnapshot
quantity
fixedScopeSnapshot
fixedBaseAmount
```

Formula:

```text
FixedBaseAmount =
FixedUnitPriceSnapshot × Quantity
```

## Rules

- Technician không sửa fixed price.
- Customer đã accept base price khi Booking.
- Không tạo Official Quotation lại cho base scope.
- Nếu phát hiện work ngoài scope:
  → Additional Cost.
- Parts tách riêng.

## Flow

```text
Booking fixed service
→ Tech Accept
→ ACCEPTED
→ EN_ROUTE
→ Arrival
→ BEFORE Evidence
→ begin base work
→ UNDER_REPAIR
→ AFTER Evidence
→ completion
```

Nếu UI/business muốn explicit “start repair”, endpoint có thể:

```http
POST /service-orders/:id/start-repair
```

backend chuyển sang UNDER_REPAIR sau precondition.

## Test quan trọng

Admin thay Fixed Price sau Booking:

```text
Booking old snapshot remains unchanged
```

## Done Check

- [ ] no Official Quote required base.
- [ ] historical price snapshot.
- [ ] Technician cannot edit price.
- [ ] additional work cannot silently modify base.

---

# 18. TASK D1-13 – Official Quotation

## Chỉ áp dụng INSPECTION_REQUIRED base scope

## Actors

Assigned Technician → create/submit  
Customer owner → approve/reject

## Entity

### Quotation

```text
id
serviceOrderId
version
status
createdByTechnicianId
submittedAt?
decidedAt?
createdAt
```

### QuotationItem

```text
id
quotationId
type
description
quantity
unitPrice
amount
partSource?
partCatalogId?
partNameSnapshot?
partWarrantyOption?
warrantyFee?
warrantyTerm?
```

Status:

```text
DRAFT
PENDING_APPROVAL
APPROVED
REJECTED
SUPERSEDED
```

## API

```http
POST /service-orders/:id/quotations
PATCH /quotations/:id
POST /quotations/:id/submit
POST /quotations/:id/decision
```

## Preconditions

- assigned Tech.
- arrival/check-in.
- actual inspection.
- INSPECTION_REQUIRED.

## Rules

- distinguish LABOR vs PARTS_EQUIPMENT.
- Approved quote immutable.
- change after approved → new revision / Additional Cost.
- Customer decision idempotent.
- reject → no forced repair; close/cancel reason phù hợp.

## Done Check

- [ ] only assigned Tech.
- [ ] only owner Customer decides.
- [ ] fixed-price base không quote lại.
- [ ] approved immutable.
- [ ] decision idempotent.
- [ ] parts validation connected.

---

# 19. TASK D1-14 – Parts Source + Warranty Snapshot Integration

## Đây không phải inventory module

Dev 1 chỉ xử lý Parts trong Quote/Additional Cost/Invoice input.

## FIXHOME Part

Dependency Dev 2:

```http
GET /parts/catalog
```

Snapshot khi Customer approve:

```text
partSource=FIXHOME
partCatalogId
partNameSnapshot
sellingPriceSnapshot
warrantyDaysSnapshot
warrantyPolicySnapshot
provider=FIXHOME
```

Technician không sửa price.

## TECHNICIAN Part

Technician input:

```text
partSource=TECHNICIAN
partName
model?
price
notes?
warrantyOption
```

Default:

```text
NO_WARRANTY
```

Optional:

```text
PAID_WARRANTY
warrantyFee
warrantyTerm
provider=TECHNICIAN
```

## Customer Decision

Customer phải thấy:

- part source
- price
- warranty option
- warranty fee nếu có
- warranty term

trước approve.

## Pickup Confirmation

Nếu FIXHOME Part:

```http
POST /service-orders/:id/parts/:itemId/pickup-confirmation
```

có thể module nhỏ theo integration với Dev 2.

## Rule

Picked up but not used:
- exclude invoice.
- physical return offline.
- không stock transaction.

## Done Check

- [ ] source required.
- [ ] FixHome price locked.
- [ ] Technician part explicit.
- [ ] default no warranty.
- [ ] paid warranty snapshot.
- [ ] no inventory fields.
- [ ] unused FixHome part not invoiced.

---

# 20. TASK D1-15 – Additional Cost

## Actors

Assigned Technician → request  
Customer owner → approve/reject

## Entity

### AdditionalCostRequest

```text
id
serviceOrderId
status
reason
createdBy
createdAt
submittedAt?
decidedAt?
```

### AdditionalCostItem

Same financial semantics as quotation item.

Status:

```text
DRAFT
PENDING_APPROVAL
APPROVED
REJECTED
CANCELLED
EXPIRED
```

## API

```http
POST /service-orders/:id/additional-costs
POST /additional-costs/:id/decision
```

## Rules

- reason required.
- LABOR/PARTS classification.
- Parts source/warranty rules apply.
- only APPROVED item performed/invoiced.
- approved immutable.
- Customer reject:
  - base feasible → continue base.
  - base not feasible → stop/cancel reason.
- không ép Customer trả rejected item.

## Decision Idempotency

Double approve không duplicate financial item.

## Done Check

- [ ] reason.
- [ ] item validation.
- [ ] owner decision.
- [ ] idempotent.
- [ ] rejected item not invoiced.
- [ ] approved immutable.

---

# 21. TASK D1-16 – Completion Confirmation

## Actors

Technician + Customer

## Mục tiêu

Tách “Technician says work finished” khỏi “ServiceOrder truly COMPLETED”.

## Suggested Records

### CustomerServiceConfirmation

```text
id
serviceOrderId
customerId
confirmed
confirmedAt
note?
```

Có thể có Technician completion note trong ServiceOrder/evidence domain.

## API

```http
POST /service-orders/:id/completion-request
POST /service-orders/:id/completion-confirmation
```

Exact endpoint có thể normalize.

## Preconditions

Trước Customer confirm:

- UNDER_REPAIR.
- AFTER evidence per policy.
- no pending required approval.
- final amount determinable.

## COMPLETED Precondition

Dev 1 gọi Payment/Settlement authority của Dev 2.

```text
customer confirmation satisfied
AND
payment condition satisfied
AND
required evidence satisfied
AND
no blocking approval
```

Sau đó mới transition `COMPLETED`.

## Exception

Nếu Customer không response/abnormal:
- Manager audited exception path.
- không tự auto-confirm nếu source không cho phép.

## Done Check

- [ ] technician cannot self-complete final state alone.
- [ ] customer owner only.
- [ ] evidence checked.
- [ ] payment checked.
- [ ] illegal early completion rejected.

---

# 22. TASK D1-17 – Payment Completion Integration

## Dev 1 không sở hữu Payment Infrastructure

Dependency Dev 2.

## Contract cần có

Ví dụ:

```ts
paymentService.isOrderPaymentSatisfied(orderId)
```

hoặc API/event equivalent.

## Online

Dev 1:

```text
Final Invoice ready
→ Customer payment flow
→ backend provider verified by Dev 2
→ PaymentStatus=PAID
→ completion service re-evaluates
```

Không trust frontend callback.

## Cash

Dev 2 cash settlement:

```text
Tech confirm
→ Customer confirm
→ CONFIRMED
```

Sau Customer-side payment resolution, ServiceOrder có thể complete theo rule.

PlatformDue là Technician obligation riêng, không giữ Customer order mở.

## Done Check

- [ ] Dev 1 không set PaymentTransaction PAID.
- [ ] completion reads server authority.
- [ ] PlatformDue pending không giữ Customer ServiceOrder open nếu Customer side payment resolved.
- [ ] no circular dependency.

---

# 23. TASK D1-18 – Booking History + Repair History

## Actors

Customer / Technician

## Customer History

Hiển thị:

- Booking
- Service
- Technician assigned
- time
- order status/final status
- financial summary
- evidence refs phù hợp
- warranty status
- review state

## Technician History

Hiển thị:

- assignment
- service
- customer-safe info
- timeline
- completion/payment summary phù hợp quyền
- PlatformDue link nếu cần qua Dev 2

## Rule

History phải dùng approved/snapshot historical values.

Không lấy:

```text
current Service price
current Part price
current Technician profile price
```

rồi giả là giá lịch sử.

## API

```http
GET /bookings/me/history
GET /service-orders/me/history
GET /repair-history/:orderId
```

## Security

- owner Customer.
- assigned/history Technician.
- no cross-account leak.

## Done Check

- [ ] pagination.
- [ ] correct snapshots.
- [ ] ownership.
- [ ] completed/cancelled visible.
- [ ] no current config mutate history.

---

# 24. TASK D1-19 – Rating / Review

## Actor

Customer

## Entity

### RatingReview

```text
id
serviceOrderId
customerId
technicianId
rating
comment?
createdAt
updatedAt?
```

## Rules

- completed job only.
- order owner only.
- linked Technician.
- one review per order theo normal MVP direction.
- rating range validate.
- review có thể feed ranking signal sau này.

## API

```http
POST /reviews
GET  /technicians/:id/reviews
```

## Done Check

- [ ] completed only.
- [ ] owner only.
- [ ] unique review/order.
- [ ] range validation.
- [ ] rating aggregate update/query consistent.

---

# 25. TASK D1-20 – Rebooking

## Quan trọng: spec v1.4 không định nghĩa Rebooking như canonical module riêng

Vì user yêu cầu luồng có Rebooking, implementation an toàn nhất là:

> **Rebooking = tạo Booking mới từ dữ liệu lịch sử, không reopen Booking/ServiceOrder cũ.**

Đây là **implementation recommendation**, không phải business rule đã FINALIZED trong v1.4.

## Actor

Customer

## API đề xuất

```http
POST /bookings/:oldBookingId/rebook
```

hoặc frontend prefill rồi:

```http
POST /bookings
```

## Có thể prefill

- primaryServiceId nếu service còn active
- repair address
- problem description optional/reference

## Phải chọn/xác nhận lại

- preferred time window
- quantity nếu Fixed Price
- Technician shortlist

## Matching

Rebooking phải chạy lại:

```text
active Service validation
→ hard filters
→ ranking
→ shortlist
→ invitation
```

Không auto-assign old Technician.

Nếu UI muốn “Đặt lại với thợ cũ”:

- old Tech có thể được suggest/preference;
- nhưng vẫn phải pass hard filter;
- vẫn qua invitation/Accept.

## Historical Integrity

- old Booking unchanged.
- old ServiceOrder unchanged.
- new Booking có id mới.
- current Service fixed price phải snapshot mới cho new Booking.
- không reuse old quote/payment.

## Test

- old service inactive → yêu cầu chọn service khác / reject safe.
- old Technician suspended → không selectable.
- old price changed → new Booking snapshot new current price.
- old Booking history remains intact.

## Done Check

- [ ] new Booking id.
- [ ] no reopen.
- [ ] new eligibility.
- [ ] new time selection.
- [ ] historical integrity.
- [ ] UI label rõ “Đặt lại”.

---

# 26. TASK D1-21 – Reschedule + Cancellation Recovery

## Reschedule

API:

```http
PATCH /bookings/:id/schedule
```

## Rules

Allowed trước repair bắt đầu.

Backend check:

- current Booking/Order phase.
- Technician availability nếu đã matched.
- schedule.
- time off.
- assignment conflict.

Không chỉ update timestamp trực tiếp.

## Cancellation

Cancellation event phải lưu:

```text
actor
reason
timestamp
phase
evidence/ref if applicable
```

Không auto strike.

## Important cases

### Before Accept

Customer cancel Booking:
- close matching/invitations.
- no ServiceOrder.

### Technician decline invitation

- not cancellation.
- no strike.
- invite next.

### Technician cancel after Accept, before arrival

- end assignment.
- evaluate policy separately.
- next candidate if possible.
- Dev 1 handles operational fallback; Manager exception if needed.

### Quote not agreed / unable to service

- no repair.
- close/cancel reason.
- no auto violation assumption.

## Done Check

- [ ] reschedule guarded.
- [ ] no conflict introduced.
- [ ] cancellation record.
- [ ] no auto strike.
- [ ] next candidate path.
- [ ] history preserved.

---

# 27. TASK D1-22 – Notification / Realtime Integration

## Core rule

```text
business transaction
→ COMMIT
→ create/publish notification
→ WebSocket/external transport
```

Notification failure không rollback domain transaction.

## Events cần notify

Customer:

- booking submitted
- invitation matching progress if needed
- Technician accepted
- Technician en route
- quote submitted
- additional cost submitted
- completion request
- payment/cash status

Technician:

- new invitation
- invitation expiry
- Customer quote decision
- additional cost decision
- completion confirmation
- warranty/support event if scope later

## Chat

Spec v1.4 final text section 8.6 says:

- chat opens after Customer Submit Booking;
- linked BookingId;
- invited Technician can communicate;
- accepted Technician conversation continues;
- other conversation read-only after match.

Tuy nhiên Decision Delta/TBD still contains chat inconsistency references.

Do not invent more permissive pre-booking chat than source supports.

## Done Check

- [ ] persisted notification.
- [ ] WebSocket after commit.
- [ ] reconnect doesn't lose core state.
- [ ] unauthorized subscription prevented.
- [ ] chat tied to Booking/assignment context.

---

# 28. Database / ERD Checklist Dev 1

Entities likely owned/integrated:

```text
Booking
BookingMedia
BookingShortlist
BookingInvitation
ServiceOrder
TechnicianAssignment
ArrivalCheckIn
RepairEvidence
Quotation
QuotationItem
AdditionalCostRequest
AdditionalCostItem
CustomerServiceConfirmation
RatingReview
```

History may be query model rather than separate entity.

## Cardinality

```text
Customer 1 ── * Booking
Booking * ── 1 Service
Booking 1 ── * BookingInvitation
Booking 1 ── * ShortlistPreference
Booking 1 ── 0..1 ServiceOrder
ServiceOrder 1 ── * TechnicianAssignment
ServiceOrder 1 ── * Quotation
Quotation 1 ── * QuotationItem
ServiceOrder 1 ── * AdditionalCostRequest
ServiceOrder 1 ── * RepairEvidence
```

## Constraints

- shortlist technician unique.
- priority unique within Booking.
- max 5 via application validation.
- one ServiceOrder per Booking.
- one active assignment per ServiceOrder.
- approved quote immutable by service logic.
- indexes:
  - Booking(customer,status,time)
  - Invitation(technician,status,expiry)
  - ServiceOrder(status)
  - Assignment(serviceOrder,status)

## Done Check

- [ ] FK clear.
- [ ] no duplicate authority fields.
- [ ] no destructive cascade financial/history.
- [ ] fresh migration pass.
- [ ] index core queries.

---

# 29. API Quality Checklist Dev 1

Mỗi endpoint:

- [ ] Actor rõ.
- [ ] JWT.
- [ ] RBAC.
- [ ] Object ownership.
- [ ] DTO validation.
- [ ] State validation.
- [ ] Transaction nếu cần.
- [ ] Idempotency nếu decision/accept.
- [ ] Error code consistency.
- [ ] No sensitive leak.
- [ ] Swagger.
- [ ] unit test.
- [ ] integration test.
- [ ] negative authorization test.

---

# 30. Security Checklist Dev 1

## Booking

- [ ] customerId from JWT.
- [ ] owner check.
- [ ] no IDOR.

## Invitation

- [ ] only invited Technician.
- [ ] stale invitation reject.
- [ ] race-safe accept.

## ServiceOrder

- [ ] assigned Technician only for Technician actions.
- [ ] owner Customer only for Customer decisions.
- [ ] state transition server-side.

## Media

- [ ] private storage.
- [ ] signed access.
- [ ] MIME/size/count.
- [ ] no filename trust.

## Financial approvals

- [ ] Customer decision server-side.
- [ ] approved immutable.
- [ ] no client amount authority.
- [ ] Parts source required.

## Location

- [ ] backend calculates geofence result.
- [ ] no trust client “verified”.

---

# 31. QA/QC Unit Test Plan

## Booking

- create valid.
- invalid service.
- inactive service.
- invalid window.
- fixed snapshot.

## Matching

- verified only.
- correct service.
- schedule.
- area.
- conflict.
- PlatformDue.
- AI fail fallback.

## Shortlist

- 5 allowed.
- 6 denied.
- duplicate denied.
- ineligible denied.

## Invitation

- sequential.
- decline next.
- expire next.
- stale accept denied.

## Assignment

- one active only.
- race-safe.

## State

- valid transitions.
- invalid transitions.
- actor authorization.

## Quote

- inspection only.
- Customer decision.
- approved immutable.

## Additional Cost

- rejected not invoiced.
- approved immutable.

## Completion

- missing evidence fail.
- missing payment fail.
- valid pass.

## Rebooking

- creates new Booking.
- current price snapshot.
- old Tech re-filtered.

---

# 32. Integration Test Plan

## Integration 1 – Fixed Price Happy Path

```text
Customer login
→ GET services
→ select fixed service
→ create Booking
→ recommendations
→ shortlist
→ invite Tech A
→ Tech A accept
→ ServiceOrder ACCEPTED
→ EN_ROUTE
→ arrival
→ BEFORE evidence
→ UNDER_REPAIR
→ AFTER evidence
→ Customer confirm
→ payment satisfied
→ COMPLETED
→ history
```

## Integration 2 – Inspection Required

```text
Booking
→ Tech accept
→ arrival
→ quote
→ Customer approve
→ UNDER_REPAIR
→ complete
```

## Integration 3 – Quote Reject

```text
quote submitted
→ Customer reject
→ no repair
→ close/cancel reason
```

## Integration 4 – Additional Cost Reject but Base Feasible

```text
base approved
→ extra request
→ reject
→ base continues
→ rejected amount excluded
```

## Integration 5 – PlatformDue gate

```text
Tech has unpaid due
→ recommendation excludes
→ stale invitation accept also rejects
```

## Integration 6 – Rebooking

```text
Completed order
→ history
→ Rebook
→ new Booking
→ new price snapshot
→ new matching
```

---

# 33. Mandatory Concurrency Tests

## Case A – Accept double click

Expected:

```text
1 accepted Invitation
1 ServiceOrder
1 active Assignment
```

## Case B – Two Tech accept race

Even nếu data abnormal creates two pending invitations:

Expected only one final assignment.

## Case C – Schedule conflict after recommendation

Tech recommended earlier but now busy.

Accept must re-check and reject.

## Case D – PlatformDue appears after recommendation

Accept must re-check and reject.

## Case E – Customer cancels while Tech accepting

Transaction/order locking must choose one consistent outcome.

No orphan assignment/order.

---

# 34. Error Code Direction

Follow project convention, but semantics nên có:

```text
BOOKING_NOT_FOUND
BOOKING_NOT_OWNER
BOOKING_ALREADY_MATCHED
INVALID_TIME_WINDOW
SERVICE_INACTIVE
TECHNICIAN_NOT_ELIGIBLE
SHORTLIST_LIMIT_EXCEEDED
INVITATION_NOT_FOUND
INVITATION_EXPIRED
INVITATION_ALREADY_RESOLVED
ASSIGNMENT_CONFLICT
ILLEGAL_ORDER_TRANSITION
ARRIVAL_VERIFICATION_FAILED
QUOTATION_NOT_ALLOWED
QUOTATION_ALREADY_DECIDED
ADDITIONAL_COST_ALREADY_DECIDED
PART_SOURCE_REQUIRED
PART_WARRANTY_INVALID
COMPLETION_PRECONDITION_FAILED
PAYMENT_NOT_SATISFIED
REBOOK_SOURCE_NOT_FOUND
```

---

# 35. Frontend / Mobile Screens Dev 1

## Customer

### C1 – Service List
### C2 – Service Detail
### C3 – Create Booking
### C4 – Technician Recommendation
### C5 – Technician Profile
### C6 – Shortlist / Priority
### C7 – Matching Status
### C8 – Active Order
### C9 – Quote Decision
### C10 – Additional Cost Decision
### C11 – Completion Confirmation
### C12 – Payment navigation/status
### C13 – Booking / Repair History
### C14 – Review
### C15 – Rebook

## Technician

### T1 – Invitation Inbox
### T2 – Invitation Detail
### T3 – Accept / Decline
### T4 – Active Assignment
### T5 – En Route
### T6 – Arrival Check-in
### T7 – BEFORE Evidence
### T8 – Quote
### T9 – Part Source Selection
### T10 – Start Repair / Under Repair
### T11 – Additional Cost
### T12 – AFTER Evidence
### T13 – Completion Request
### T14 – Job History

## UI Rules

- frontend không tự transition state.
- button availability dựa trên server state nhưng backend vẫn enforce.
- loading/error/empty states.
- optimistic update chỉ dùng khi safe.
- decision actions chống double click.

---

# 36. Dev 1 ↔ Dev 2 Integration Contracts

## Contract A – Auth

Dev 1 consumes:

```text
currentUser.id
currentUser.role
JWT guards
```

## Contract B – Service Catalog

Dev 1 reads:

```text
service.id
pricingMode
fixedPrice
unit
scope
active
```

## Contract C – KYC

Matching reads one authority:

```text
verificationStatus=VERIFIED
```

## Contract D – TechnicianService

Matching reads:

```text
serviceId
active
listedLaborPrice
typicalWarranty
```

## Contract E – PlatformDue

Before ranking / invitation / Accept:

```text
hasActiveUnpaidPlatformDue(techId)
```

## Contract F – Part Catalog

Quote/Additional Cost reads:

```text
active
sellingPrice
warranty
```

## Contract G – Payment

Completion reads:

```text
payment/cash settlement satisfied
```

## Contract H – Support

Dev 1 abnormal flow may escalate:

```text
SupportCase
```

Dev 1 không tự resolve Manager-only case.

---

# 37. Definition of Done – từng Task

Một task Dev 1 chỉ DONE khi:

## CODE

- [ ] implementation complete.
- [ ] lint.
- [ ] build.
- [ ] no dead/duplicate module.

## DATABASE

- [ ] migration.
- [ ] FK.
- [ ] unique/index.
- [ ] historical integrity.

## API

- [ ] DTO.
- [ ] validation.
- [ ] RBAC.
- [ ] ownership.
- [ ] Swagger.

## BUSINESS

- [ ] v1.4 rule.
- [ ] correct state.
- [ ] correct actor.
- [ ] no ServiceOrder before Accept.
- [ ] no silent financial mutation.

## TEST

- [ ] unit.
- [ ] integration.
- [ ] negative auth.
- [ ] edge case.
- [ ] concurrency if applicable.

## SECURITY

- [ ] no IDOR.
- [ ] no public sensitive media.
- [ ] no trust client state/amount/geofence.

## INTEGRATION

- [ ] Dev 2 contract works.
- [ ] no circular dependency.
- [ ] no breaking shared enums.

---

# 38. Pull Request Checklist Dev 1

PR description:

```text
Task ID:
Actor:
Business Rule:
State affected:
API:
DB:
Dev 2 dependency:
Concurrency concern:
Tests:
Screenshot/Postman evidence:
```

Review:

- [ ] không sửa Dev 2 module ngoài thỏa thuận.
- [ ] state transition đúng.
- [ ] Accept transaction atomic.
- [ ] ownership.
- [ ] no inventory scope.
- [ ] no commission formula duplicate.
- [ ] tests pass.
- [ ] migration safe.

---

# 39. Git Branch Strategy

```text
feature/d1-booking
feature/d1-recommendation
feature/d1-shortlist
feature/d1-invitation
feature/d1-assignment
feature/d1-service-order
feature/d1-arrival
feature/d1-evidence
feature/d1-fixed-price-flow
feature/d1-quotation
feature/d1-additional-cost
feature/d1-completion
feature/d1-history
feature/d1-rebooking
```

Flow:

```text
feature/*
→ PR
→ code review
→ develop
→ integration test
→ release
```

Không merge nhiều business module khổng lồ trong một PR.

---

# 40. Priority Backlog Dev 1

## Sprint D1-A – Happy Path Marketplace

- [ ] D1-00 Review
- [ ] D1-01 Service Discovery
- [ ] D1-02 Booking
- [ ] D1-04 Recommendation
- [ ] D1-05 Shortlist
- [ ] D1-06 Invitation
- [ ] D1-07 Invitation Inbox
- [ ] D1-08 Accept Transaction

### Milestone

```text
Customer Create Booking
→ choose Tech
→ Tech Accept
→ ServiceOrder exists
```

---

## Sprint D1-B – Fixed Price Execution

- [ ] D1-09 State Machine
- [ ] D1-10 En Route / Arrival
- [ ] D1-11 Evidence
- [ ] D1-12 Fixed Price Repair
- [ ] D1-16 Completion
- [ ] D1-17 Payment Integration

### Milestone

```text
Booking
→ Accept
→ En Route
→ Repair
→ Complete
```

Đây là milestone demo quan trọng nhất.

---

## Sprint D1-C – Inspection / Financial Approval

- [ ] D1-13 Quotation
- [ ] D1-14 Parts Snapshot
- [ ] D1-15 Additional Cost

### Milestone

```text
Inspection Required
→ Quote
→ Parts
→ Additional
→ Customer approval
```

---

## Sprint D1-D – History / Reuse / Recovery

- [ ] D1-18 History
- [ ] D1-19 Review
- [ ] D1-20 Rebooking
- [ ] D1-21 Reschedule/Cancellation

### Milestone

```text
Completed
→ History
→ Review
→ Rebook
```

---

## Sprint D1-E – Hardening

- [ ] D1-22 Notifications/Realtime
- [ ] D1-23 Regression
- [ ] concurrency testing
- [ ] security test
- [ ] API docs
- [ ] demo seed
- [ ] final integration

---

# 41. Demo Checklist Dev 1

## Demo 1 – Booking

```text
Customer Login
→ View Service
→ Select Fixed Service
→ Create Booking
```

Verify DB:

```text
Booking exists
ServiceOrder does NOT exist
```

## Demo 2 – Matching

```text
recommendation
→ Customer shortlist 3
→ invitation Tech A
→ Tech A decline
→ Tech B invited
→ Tech B accept
```

Verify DB:

```text
1 ServiceOrder
1 active Assignment
```

## Demo 3 – Fixed Price Execution

```text
ACCEPTED
→ EN_ROUTE
→ Arrival
→ BEFORE
→ UNDER_REPAIR
→ AFTER
→ Customer confirm
→ payment resolved
→ COMPLETED
```

## Demo 4 – Inspection Required

```text
arrival
→ quote
→ approve
→ repair
```

## Demo 5 – Additional Cost

```text
additional request
→ Customer reject
→ base feasible
→ base continues
```

## Demo 6 – History + Rebooking

```text
Completed
→ History
→ Rebook
→ new Booking id
→ new matching
```

---

# 42. Final Acceptance Gate Dev 1

Dev 1 scope được coi là hoàn thành khi:

## Booking

- [ ] 1 Booking = 1 Primary Service.
- [ ] preferred time window.
- [ ] no ServiceOrder before Accept.
- [ ] fixed price snapshot.

## Matching

- [ ] hard filter before ranking.
- [ ] verified only.
- [ ] PlatformDue gate.
- [ ] max 5 shortlist.
- [ ] sequential invitation.

## Accept

- [ ] atomic.
- [ ] no race duplicate.
- [ ] create ServiceOrder ACCEPTED.
- [ ] create one active Assignment.

## Execution

- [ ] state machine enforced.
- [ ] en route.
- [ ] arrival.
- [ ] evidence.
- [ ] fixed-price flow.
- [ ] inspection quote flow.

## Financial Approval

- [ ] parts source snapshot.
- [ ] additional cost.
- [ ] approved immutable.
- [ ] rejected not invoiced.

## Completion

- [ ] Customer confirmation.
- [ ] payment condition server-side.
- [ ] COMPLETED only when valid.

## Post-service

- [ ] history.
- [ ] review.
- [ ] rebooking creates new Booking.

## Quality

- [ ] unit tests.
- [ ] integration tests.
- [ ] concurrency tests.
- [ ] negative auth.
- [ ] build/lint.
- [ ] no critical/high security issue.
- [ ] Dev 2 integration contracts stable.

---

# 43. Các lỗi kiến trúc Dev 1 tuyệt đối tránh

## Sai 1

```text
Customer Submit Booking
→ create ServiceOrder PENDING
```

**Sai baseline v1.4.**

Đúng:

```text
Booking exists
→ matching
→ Technician Accept
→ create ServiceOrder ACCEPTED
```

## Sai 2

```text
Send invitation to all 5 Technicians at once
```

Sai.

Đúng:

```text
Sequential Invitation
```

## Sai 3

AI quyết Technician assignment.

Sai.

AI chỉ optional soft rerank sau hard filter.

## Sai 4

Frontend tự đổi:

```text
order.status = COMPLETED
```

Sai.

Backend state machine authority.

## Sai 5

Technician sửa Fixed Price.

Sai.

Fixed Price từ Admin catalog + Booking snapshot.

## Sai 6

Parts không ghi source.

Sai.

Bắt buộc:

```text
FIXHOME
TECHNICIAN
```

## Sai 7

Technician Part tự có warranty.

Sai.

Default:

```text
NO_WARRANTY
```

Chỉ có coverage khi Customer mua `PAID_WARRANTY`.

## Sai 8

Rebooking mở lại ServiceOrder cũ.

Không nên.

Tạo Booking mới.

## Sai 9

History lấy current catalog price.

Sai.

Dùng historical snapshot.

## Sai 10

Dev 1 tự code Payment=PAID để demo.

Sai.

Phải consume Dev 2 payment authority / sandbox provider contract.

---

# 44. Kết luận triển khai

Dev 1 nên được xem là owner của:

> **Customer Booking Experience + Technician Matching + Assignment + Repair Execution + Approval Workflow + Completion + History**

Core vertical slice phải ưu tiên trước:

```text
Service
→ Booking
→ Technician Recommendation
→ Shortlist
→ Invitation
→ Accept
→ ServiceOrder
→ En Route
→ Repair
→ Complete
→ History
→ Rebooking
```

Sau khi flow trên chạy ổn mới mở rộng:

```text
Official Quotation
→ Parts Source
→ Paid Part Warranty
→ Additional Cost
→ Advanced Recovery
→ Realtime polish
```

Mục tiêu cuối cùng không phải là “nhiều màn hình”, mà là một luồng có thể chứng minh đầy đủ:

```text
Requirement
→ Database
→ API
→ State Machine
→ UI
→ Integration
→ Test
→ Audit/History
```

và không mâu thuẫn với FixHome Master Project Specification v1.4.
