# FixHome API — Technician Verification (KYC)

> Specification and reference for Technician Credential Submission (KYC) and Administrator Verification Review.

---

## 1. Overview & Verification Lifecycle

FixHome requires all technician accounts to be verified before they can accept bookings or orders.
The canonical verification status lifecycle (`VerificationStatus` enum):
- `pending`: Application submitted by technician, awaiting operational review.
- `verified` (alias `approved` for backwards-compatibility): Reviewed and confirmed by an Admin.
- `rejected`: Application rejected with a specific explanation (`rejectionReason`). Technicians can re-submit after correcting their profile.

### Document Requirements & Privacy
To protect personally identifiable information (PII), all KYC media are kept in **Private Storage** (Supabase private bucket) with **signed access URLs**:
- `citizen_id_front`: Mặt trước CCCD/CMND
- `citizen_id_back`: Mặt sau CCCD/CMND
- `face_photo`: Ảnh chụp chân dung thực tế (bắt buộc đối chiếu khuôn mặt)
- `certificate`: Bằng cấp / Chứng chỉ nghề nghiệp (tùy chọn)
- `portfolio`: Hình ảnh công trình / sản phẩm đã hoàn thành (tùy chọn)

Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`.  
File size limit: Maximum 10MB per document.

---

## 2. Technician Verification Endpoints

Guarded with `@Roles(Role.TECHNICIAN)`.

### 2.1 Submit Verification Documents
`POST /api/v1/technician/verification`
- **Request Body**:
  ```json
  {
    "documents": [
      {
        "documentType": "citizen_id_front",
        "storagePath": "kyc/tech-uuid/cccd_front.jpg",
        "fileName": "cccd_front.jpg",
        "fileSize": 1048576,
        "mimeType": "image/jpeg"
      },
      {
        "documentType": "citizen_id_back",
        "storagePath": "kyc/tech-uuid/cccd_back.jpg",
        "fileName": "cccd_back.jpg",
        "fileSize": 1048576,
        "mimeType": "image/jpeg"
      },
      {
        "documentType": "face_photo",
        "storagePath": "kyc/tech-uuid/face.jpg",
        "fileName": "face.jpg",
        "fileSize": 850000,
        "mimeType": "image/jpeg"
      }
    ]
  }
  ```
- **Response** (`201 Created`): Returns created verification record with status `pending`.

### 2.2 Check Verification Status & Access Documents
`GET /api/v1/technician/verification/status`
- **Response** (`200 OK`): Returns latest verification status, reviewed timestamp, and documents with short-lived signed URLs.

---

## 3. Administrative Review Endpoints

Guarded strictly with `@Roles(Role.ADMIN)`.

### 3.1 List Verifications
`GET /api/v1/admin/technician-verifications`
- **Query Params**:
  - `status`: Optional filter by `pending`, `verified`, `rejected`
  - `page`: default 1
  - `limit`: default 20 (max 100)

### 3.2 Get Verification Detail (with Signed Media URLs)
`GET /api/v1/admin/technician-verifications/:id`
- Returns full details of submission, signed private access URLs for CCCD and face photo, and technician profile.

### 3.3 Review Verification (Approve or Reject)
`POST /api/v1/admin/technician-verifications/:id/review` (or `PATCH .../approve` / `PATCH .../reject`)
- **Request Body**:
  ```json
  {
    "status": "verified", // or "rejected"
    "rejectionReason": "Ảnh mặt sau CCCD bị lóa sáng, không đọc được số seri. Vui lòng chụp lại." // required if rejected
  }
  ```
- **Side Effects**:
  1. Updates `technician_verifications` status.
  2. Synchronizes `technician_profiles.verification_status`.
  3. Records strict immutable entry in `audit_logs` (`KYC_VERIFICATION_APPROVED` or `KYC_VERIFICATION_REJECTED`).
