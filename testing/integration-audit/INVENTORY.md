# Backend route inventory

Generated from TypeScript AST; implementation evidence in inventory.json. Status PARTIAL means static inventory only, not full UI/DB proof. Prefix `/api/v1`, except health exclusions in setup-app.ts.

| Module | Endpoint | Method | Actor / permission | Auth | Status | Evidence |
|---|---|---|---|---|---|---|
| audit-log | /admin/audit-logs | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/audit-log/admin-audit-log.controller.ts:38 |
| audit-log | /admin/audit-logs/:id | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/audit-log/admin-audit-log.controller.ts:72 |
| auth | /auth/register | POST | All/public; inspect service | ThrottlerGuard | PARTIAL | Backend-FixHome/src/modules/auth/auth.controller.ts:37 |
| auth | /auth/login | POST | All/public; inspect service | ThrottlerGuard | PARTIAL | Backend-FixHome/src/modules/auth/auth.controller.ts:59 |
| auth | /auth/refresh | POST | All/public; inspect service | ThrottlerGuard | PARTIAL | Backend-FixHome/src/modules/auth/auth.controller.ts:81 |
| auth | /auth/logout | POST | All/public; inspect service | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/auth/auth.controller.ts:103 |
| auth | /auth/me | GET | All/public; inspect service | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/auth/auth.controller.ts:120 |
| bookings | /bookings | POST | 'booking:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:34 |
| bookings | /bookings/my | GET | 'booking:read_own' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:44 |
| bookings | /bookings/:id | GET | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:63 |
| bookings | /bookings/:id/media | POST | 'booking:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:74 |
| bookings | /bookings/:id/technician-candidates | GET | 'invitation:shortlist' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:89 |
| bookings | /bookings/:id/shortlist | POST | 'invitation:shortlist' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:102 |
| bookings | /bookings/:id/schedule | PATCH | 'booking:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:121 |
| bookings | /bookings/:id/cancel | POST | 'booking:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:135 |
| bookings | /bookings/:id/rebook | POST | 'booking:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/bookings.controller.ts:144 |
| bookings | /invitations/my | GET | 'invitation:respond' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/invitations.controller.ts:26 |
| bookings | /invitations/:id/respond | POST | 'invitation:respond' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/bookings/invitations.controller.ts:38 |
| categories | /admin/service-categories/:id | DELETE | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:47 |
| categories | /admin/service-categories | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:62 |
| categories | /admin/service-categories | POST | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:75 |
| categories | /admin/service-categories/:id | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:89 |
| categories | /admin/service-categories/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:106 |
| categories | /admin/categories/:id | DELETE | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:47 |
| categories | /admin/categories | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:62 |
| categories | /admin/categories | POST | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:75 |
| categories | /admin/categories/:id | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:89 |
| categories | /admin/categories/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/categories/admin-categories.controller.ts:106 |
| categories | /service-categories | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/categories/categories.controller.ts:17 |
| categories | /service-categories/:idOrSlug | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/categories/categories.controller.ts:28 |
| categories | /categories | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/categories/categories.controller.ts:17 |
| categories | /categories/:idOrSlug | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/categories/categories.controller.ts:28 |
| dashboard | /dashboard/customer | GET | 'dashboard:read_own' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/dashboard/dashboard.controller.ts:14 |
| dashboard | /dashboard/technician | GET | 'dashboard:read_own' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/dashboard/dashboard.controller.ts:24 |
| dashboard | /dashboard/operations | GET | 'dashboard:read_operational' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/dashboard/dashboard.controller.ts:34 |
| dashboard | /dashboard/system | GET | 'dashboard:read_system' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/dashboard/dashboard.controller.ts:44 |
| finance | /finance/platform-dues | GET | Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/finance/finance.controller.ts:34 |
| health | /health | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/health/health.controller.ts:11 |
| health | /api/v1/health | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/health/health.controller.ts:11 |
| media | /media/upload | POST | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/media/media.controller.ts:26 |
| media | /media/files/:filename | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/media/media.controller.ts:42 |
| notifications | /notifications | GET | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/notifications/notifications.controller.ts:23 |
| notifications | /notifications/unread-count | GET | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/notifications/notifications.controller.ts:35 |
| notifications | /notifications/:id/read | PATCH | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/notifications/notifications.controller.ts:41 |
| notifications | /notifications/read-all | PATCH | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/notifications/notifications.controller.ts:50 |
| parts-catalog | /admin/parts | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/admin-parts.controller.ts:48 |
| parts-catalog | /admin/parts/:id | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/admin-parts.controller.ts:64 |
| parts-catalog | /admin/parts | POST | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/admin-parts.controller.ts:81 |
| parts-catalog | /admin/parts/:id | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/admin-parts.controller.ts:97 |
| parts-catalog | /admin/parts/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/admin-parts.controller.ts:121 |
| parts-catalog | /parts/catalog | GET | Role.TECHNICIAN, Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/parts-catalog.controller.ts:29 |
| parts-catalog | /parts/catalog/:id | GET | Role.TECHNICIAN, Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/parts-catalog/parts-catalog.controller.ts:45 |
| quotations | /service-orders/:id/quotations | POST | 'quotation:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:28 |
| quotations | /service-orders/:id/quotations | GET | 'quotation:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:47 |
| quotations | /quotations/:id | GET | 'quotation:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:57 |
| quotations | /quotations/:id/decision | POST | All/public; inspect service | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:67 |
| quotations | /service-orders/:id/additional-costs | POST | 'additional_cost:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:88 |
| quotations | /service-orders/:id/additional-costs | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:107 |
| quotations | /additional-costs/:id/decision | POST | All/public; inspect service | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:117 |
| quotations | /additional-costs/:id/revise | POST | 'additional_cost:revise' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/quotations/quotations.controller.ts:136 |
| reviews | /service-orders/:id/reviews | POST | 'rating:create_own_order' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/reviews/reviews.controller.ts:27 |
| reviews | /reviews | POST | 'rating:create_own_order' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/reviews/reviews.controller.ts:46 |
| reviews | /service-orders/:id/reviews | GET | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/reviews/reviews.controller.ts:61 |
| reviews | /technicians/:id/reviews | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/reviews/reviews.controller.ts:70 |
| service-areas | /service-areas | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:37 |
| service-areas | /service-areas/:id | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:44 |
| service-areas | /service-areas | POST | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:52 |
| service-areas | /service-areas/:id | PATCH | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:67 |
| service-areas | /service-areas/:id/status | PATCH | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:83 |
| service-areas | /service-areas/:id | DELETE | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-areas/service-areas.controller.ts:98 |
| service-orders | /service-orders | GET | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:57 |
| service-orders | /service-orders/my | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:78 |
| service-orders | /service-orders/:id | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:101 |
| service-orders | /service-orders/:id/en-route | POST | 'order:update_status' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:116 |
| service-orders | /service-orders/:id/check-in | POST | 'arrival_checkin:create' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:130 |
| service-orders | /service-orders/:id/evidence | POST | 'evidence:upload' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:146 |
| service-orders | /service-orders/:id/evidence | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:169 |
| service-orders | /service-orders/:id/start-repair | POST | 'order:update_status' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:182 |
| service-orders | /service-orders/:id/request-completion | POST | 'order:update_status' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:198 |
| service-orders | /service-orders/:id/confirm-completion | POST | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:219 |
| service-orders | /service-orders/:id/complete | POST | 'order:update_status' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:240 |
| service-orders | /service-orders/:id/cancel | POST | 'order:cancel' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:261 |
| service-orders | /service-orders/:id/status-history | GET | 'order:read_status_history' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:282 |
| service-orders | /service-orders/:id/invoice | GET | 'invoice:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:292 |
| service-orders | /invoices/:id/pay | POST | 'invoice:pay_own' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:307 |
| service-orders | /service-orders/:id/warranties | GET | 'warranty:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:326 |
| service-orders | /service-orders/:id/cash-settlement/declare | POST | 'order:update_status' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:338 |
| service-orders | /service-orders/:id/cash-settlement/confirm | POST | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:356 |
| service-orders | /service-orders/:id/cash-settlement | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:374 |
| service-orders | /commission-dues/my | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:390 |
| service-orders | /platform-dues/my | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:390 |
| service-orders | /commission-dues/:id/pay | POST | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:401 |
| service-orders | /platform-dues/:id/pay | POST | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:401 |
| service-orders | /service-orders/:id/warranty-claims | POST | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:422 |
| service-orders | /service-orders/:id/warranty-claims | GET | 'order:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:437 |
| service-orders | /repair-history | GET | 'history:read_related' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:449 |
| service-orders | /cancellations | GET | Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:472 |
| service-orders | /cancellations/:id/review | POST | 'compensation:decide' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:489 |
| service-orders | /strikes | GET | 'strike:read_all' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:514 |
| service-orders | /strikes/:id/waive | POST | 'strike:waive' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/service-orders/service-orders.controller.ts:532 |
| services | /admin/services/:id | DELETE | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:49 |
| services | /admin/services | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:64 |
| services | /admin/services/:id | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:78 |
| services | /admin/services | POST | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:90 |
| services | /admin/services/:id | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:105 |
| services | /admin/services/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/services/admin-services.controller.ts:122 |
| services | /parts | GET | All/public; inspect service | JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/services/parts.controller.ts:17 |
| services | /services | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/services/services.controller.ts:18 |
| services | /services/:idOrSlug | GET | All/public; inspect service | Public | PARTIAL | Backend-FixHome/src/modules/services/services.controller.ts:33 |
| support-cases | /support/cases | POST | Role.SERVICE_MANAGER, Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/support-cases/support-cases.controller.ts:48 |
| support-cases | /support/cases | GET | Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/support-cases/support-cases.controller.ts:75 |
| support-cases | /support/cases/:id | GET | Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/support-cases/support-cases.controller.ts:106 |
| support-cases | /support/cases/:id/resolve | POST | Role.SERVICE_MANAGER, Role.ADMIN, Role.SERVICE_MANAGER | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/support-cases/support-cases.controller.ts:127 |
| system-config | /admin/config | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/system-config/admin-config.controller.ts:40 |
| system-config | /admin/config/:key | GET | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/system-config/admin-config.controller.ts:60 |
| system-config | /admin/config/:key | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/system-config/admin-config.controller.ts:75 |
| technician-assignment | /technicians/:id/assign | POST | 'assignment:override' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/technician-assignment/technician-assignment.controller.ts:27 |
| technician-assignment | /service-orders/:id/assign | POST | 'assignment:override' | JwtAuthGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/technician-assignment/technician-assignment.controller.ts:49 |
| technician-verifications | /admin/technician-verifications | GET | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/admin-technician-verifications.controller.ts:45 |
| technician-verifications | /admin/technician-verifications/:id | GET | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/admin-technician-verifications.controller.ts:59 |
| technician-verifications | /admin/technician-verifications/:id/documents/:documentId/access | GET | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/admin-technician-verifications.controller.ts:73 |
| technician-verifications | /admin/technician-verifications/:id/approve | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/admin-technician-verifications.controller.ts:100 |
| technician-verifications | /admin/technician-verifications/:id/reject | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/admin-technician-verifications.controller.ts:118 |
| technician-verifications | /technicians/me/verification | POST | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:158 |
| technician-verifications | /technicians/me/verification | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:178 |
| technician-verifications | /technicians/me/verification/status | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:178 |
| technician-verifications | /technicians/me/verification/documents/:documentId/access | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:192 |
| technician-verifications | /technician/verification | POST | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:158 |
| technician-verifications | /technician/verification | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:178 |
| technician-verifications | /technician/verification/status | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:178 |
| technician-verifications | /technician/verification/documents/:documentId/access | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/technician-verifications/technician-verifications.controller.ts:192 |
| technicians | /technicians/me/profile | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:54 |
| technicians | /technicians/me/profile | PATCH | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:63 |
| technicians | /technicians/me/services | GET | Role.TECHNICIAN, Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:75 |
| technicians | /technicians/me/services/:serviceId | PUT | Role.TECHNICIAN, Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:96 |
| technicians | /technicians/me/schedule | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:128 |
| technicians | /technicians/me/schedule | PUT | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:137 |
| technicians | /technicians/me/time-off | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:152 |
| technicians | /technicians/me/time-off | POST | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:161 |
| technicians | /technicians/me/time-off/:id | DELETE | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:173 |
| technicians | /technicians/me/service-areas | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:185 |
| technicians | /technicians/me/service-areas | PUT | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:194 |
| technicians | /technicians/me/earnings | GET | Role.TECHNICIAN | JwtAuthGuard, RolesGuard, JwtAuthGuard | PARTIAL | Backend-FixHome/src/modules/technicians/technicians.controller.ts:209 |
| users | /me/addresses | GET | Role.CUSTOMER | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/addresses.controller.ts:39 |
| users | /me/addresses | POST | Role.CUSTOMER | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/addresses.controller.ts:53 |
| users | /me/addresses/:id | PATCH | Role.CUSTOMER | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/addresses.controller.ts:68 |
| users | /me/addresses/:id | DELETE | Role.CUSTOMER | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/addresses.controller.ts:84 |
| users | /admin/users | GET | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/admin-users.controller.ts:33 |
| users | /admin/users/:id | GET | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/admin-users.controller.ts:47 |
| users | /admin/users/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/admin-users.controller.ts:60 |
| users | /me | GET | All/public; inspect service | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/me.controller.ts:26 |
| users | /me | PATCH | All/public; inspect service | JwtAuthGuard, RolesGuard | PARTIAL | Backend-FixHome/src/modules/users/me.controller.ts:41 |
| users | /users/me | GET | All/public; inspect service | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/users/users.controller.ts:33 |
| users | /users/me | PATCH | All/public; inspect service | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/users/users.controller.ts:45 |
| users | /users | GET | Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/users/users.controller.ts:66 |
| users | /users/:id | GET | Role.SERVICE_MANAGER, Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/users/users.controller.ts:82 |
| users | /users/:id/status | PATCH | Role.ADMIN | JwtAuthGuard, RolesGuard, PermissionGuard | PARTIAL | Backend-FixHome/src/modules/users/users.controller.ts:96 |

# Client HTTP calls and route candidates

Endpoint existence only; includes unused wrappers. Dynamic route composition requires manual review.

| Client | File:line | Method | Path | Backend candidate |
|---|---|---|---|---|
| Frontend-FixHome | Frontend-FixHome/src/api/admin-audit-logs.api.ts:136 | GET | /admin/audit-logs | GET /admin/audit-logs |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-audit-logs.api.ts:153 | GET | /admin/audit-logs/:param | GET /admin/audit-logs/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-config.api.ts:71 | GET | /admin/config | GET /admin/config |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-config.api.ts:78 | GET | /admin/config/:param | GET /admin/config/:key |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-config.api.ts:83 | PATCH | /admin/config/:param | PATCH /admin/config/:key |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-parts.api.ts:114 | GET | /admin/parts | GET /admin/parts |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-parts.api.ts:119 | GET | /admin/parts/:param | GET /admin/parts/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-parts.api.ts:124 | POST | /admin/parts | POST /admin/parts |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-parts.api.ts:129 | PATCH | /admin/parts/:param | PATCH /admin/parts/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-parts.api.ts:134 | PATCH | /admin/parts/:param/status | PATCH /admin/parts/:id/status |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-platform-dues.api.ts:130 | GET | /finance/platform-dues | GET /finance/platform-dues |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-users.api.ts:144 | GET | /admin/users | GET /admin/users |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-users.api.ts:149 | GET | /admin/users/:param | GET /admin/users/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-users.api.ts:157 | PATCH | /admin/users/:param/status | PATCH /admin/users/:id/status |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-verifications.api.ts:144 | GET | /admin/technician-verifications | GET /admin/technician-verifications |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-verifications.api.ts:149 | GET | /admin/technician-verifications/:param | GET /admin/technician-verifications/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-verifications.api.ts:154 | PATCH | /admin/technician-verifications/:param/approve | PATCH /admin/technician-verifications/:id/approve |
| Frontend-FixHome | Frontend-FixHome/src/api/admin-verifications.api.ts:161 | PATCH | /admin/technician-verifications/:param/reject | PATCH /admin/technician-verifications/:id/reject |
| Frontend-FixHome | Frontend-FixHome/src/api/auth.api.ts:11 | POST | /auth/login | POST /auth/login |
| Frontend-FixHome | Frontend-FixHome/src/api/auth.api.ts:16 | POST | /auth/register | POST /auth/register |
| Frontend-FixHome | Frontend-FixHome/src/api/auth.api.ts:21 | GET | /me | GET /me |
| Frontend-FixHome | Frontend-FixHome/src/api/auth.api.ts:26 | PATCH | /me | PATCH /me |
| Frontend-FixHome | Frontend-FixHome/src/api/auth.api.ts:33 | POST | /auth/logout | POST /auth/logout |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:83 | POST | /bookings | POST /bookings |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:90 | GET | /bookings/my | GET /bookings/my |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:92 | GET | /bookings/:param | GET /bookings/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:118 | GET | /bookings/:param/technician-candidates | GET /bookings/:id/technician-candidates |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:121 | POST | /bookings/:param/shortlist | POST /bookings/:id/shortlist |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:124 | GET | /invitations/my | GET /invitations/my |
| Frontend-FixHome | Frontend-FixHome/src/api/bookings.api.ts:127 | POST | /invitations/:param/respond | POST /invitations/:id/respond |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:123 | GET | /categories | GET /categories |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:129 | GET | /categories/:param | GET /categories/:idOrSlug |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:135 | GET | /admin/categories | GET /admin/categories |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:140 | POST | /admin/categories | POST /admin/categories |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:145 | PATCH | /admin/categories/:param | PATCH /admin/categories/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:150 | PATCH | /admin/categories/:param/status | PATCH /admin/categories/:id/status |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:161 | GET | /services | GET /services |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:166 | GET | /services/:param | GET /services/:idOrSlug |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:178 | GET | /admin/services | GET /admin/services |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:183 | POST | /admin/services | POST /admin/services |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:188 | PATCH | /admin/services/:param | PATCH /admin/services/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/catalog.api.ts:193 | PATCH | /admin/services/:param/status | PATCH /admin/services/:id/status |
| Frontend-FixHome | Frontend-FixHome/src/api/console-order-context.api.ts:152 | GET | /service-orders/:param | GET /service-orders/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:122 | GET | /service-orders/my | GET /service-orders/my |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:122 | GET | /service-orders/my | GET /service-orders/my |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:126 | GET | /service-orders | GET /service-orders |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:128 | GET | /service-orders/:param | GET /service-orders/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:133 | POST | /service-orders/:param/en-route | POST /service-orders/:id/en-route |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:141 | POST | /service-orders/:param/check-in | POST /service-orders/:id/check-in |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:149 | POST | /service-orders/:param/start-repair | POST /service-orders/:id/start-repair |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:159 | POST | /service-orders/:param/evidence | POST /service-orders/:id/evidence |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:167 | POST | /service-orders/:param/request-completion | POST /service-orders/:id/request-completion |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:172 | POST | /service-orders/:param/confirm-completion | POST /service-orders/:id/confirm-completion |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:177 | POST | /service-orders/:param/cancel | POST /service-orders/:id/cancel |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:183 | POST | /service-orders/:param/quotations | POST /service-orders/:id/quotations |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:185 | POST | /quotations/:param/decision | POST /quotations/:id/decision |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:187 | POST | /quotations/:param/decision | POST /quotations/:id/decision |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:195 | POST | /service-orders/:param/cash-settlement/declare | POST /service-orders/:id/cash-settlement/declare |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:206 | POST | /service-orders/:param/cash-settlement/confirm | POST /service-orders/:id/cash-settlement/confirm |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:213 | GET | /service-orders/:param/cash-settlement | GET /service-orders/:id/cash-settlement |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:217 | GET | /service-orders/:param/invoice | GET /service-orders/:id/invoice |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:220 | POST | /invoices/:param/pay | POST /invoices/:id/pay |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:227 | GET | /service-orders/:param/warranties | GET /service-orders/:id/warranties |
| Frontend-FixHome | Frontend-FixHome/src/api/orders.api.ts:233 | POST | /service-orders/:param/warranty-claims | POST /service-orders/:id/warranty-claims |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:33 | GET | /me | GET /me |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:42 | PATCH | /me | PATCH /me |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:47 | GET | /me/addresses | GET /me/addresses |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:61 | POST | /me/addresses | POST /me/addresses |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:76 | PATCH | /me/addresses/:param | PATCH /me/addresses/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/profile.api.ts:81 | DELETE | /me/addresses/:param | DELETE /me/addresses/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:20 | GET | /service-areas | GET /service-areas |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:25 | GET | /service-areas/:param | GET /service-areas/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:36 | POST | /service-areas | POST /service-areas |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:50 | PATCH | /service-areas/:param | PATCH /service-areas/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:55 | PATCH | /service-areas/:param/status | PATCH /service-areas/:id/status |
| Frontend-FixHome | Frontend-FixHome/src/api/service-areas.api.ts:60 | DELETE | /service-areas/:param | DELETE /service-areas/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/support-cases.api.ts:375 | GET | /support/cases | GET /support/cases |
| Frontend-FixHome | Frontend-FixHome/src/api/support-cases.api.ts:387 | GET | /support/cases/:param | GET /support/cases/:id |
| Frontend-FixHome | Frontend-FixHome/src/api/support-cases.api.ts:394 | POST | /support/cases/:param/resolve | POST /support/cases/:id/resolve |
| Mobi-FixHome | Mobi-FixHome/src/api/auth.api.ts:40 | POST | /auth/login | POST /auth/login |
| Mobi-FixHome | Mobi-FixHome/src/api/auth.api.ts:52 | POST | /auth/register | POST /auth/register |
| Mobi-FixHome | Mobi-FixHome/src/api/auth.api.ts:63 | GET | /me | GET /me |
| Mobi-FixHome | Mobi-FixHome/src/api/auth.api.ts:70 | POST | /auth/refresh | POST /auth/refresh |
| Mobi-FixHome | Mobi-FixHome/src/api/auth.api.ts:82 | POST | /auth/logout | POST /auth/logout |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:118 | POST | /bookings | POST /bookings |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:123 | GET | /bookings/my | GET /bookings/my |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:128 | GET | /bookings/:param | GET /bookings/:id |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:144 | GET | /bookings/:param/technician-candidates | GET /bookings/:id/technician-candidates |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:159 | POST | /bookings/:param/shortlist | POST /bookings/:id/shortlist |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:163 | GET | /invitations/my | GET /invitations/my |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:178 | POST | /invitations/:param/respond | POST /invitations/:id/respond |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:183 | POST | /bookings/:param/cancel | POST /bookings/:id/cancel |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:191 | PATCH | /bookings/:param/schedule | PATCH /bookings/:id/schedule |
| Mobi-FixHome | Mobi-FixHome/src/api/bookings.api.ts:202 | POST | /bookings/:param/media | POST /bookings/:id/media |
| Mobi-FixHome | Mobi-FixHome/src/api/services.api.ts:39 | GET | /categories | GET /categories |
| Mobi-FixHome | Mobi-FixHome/src/api/services.api.ts:49 | GET | /services | GET /services |
| Mobi-FixHome | Mobi-FixHome/src/api/services.api.ts:55 | GET | /services/:param | GET /services/:idOrSlug |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:46 | GET | /users/me | GET /users/me |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:51 | PATCH | /users/me | PATCH /users/me |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:56 | GET | /me/addresses | GET /me/addresses |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:62 | POST | /me/addresses | POST /me/addresses |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:67 | PATCH | /me/addresses/:param | PATCH /me/addresses/:id |
| Mobi-FixHome | Mobi-FixHome/src/api/users.api.ts:72 | DELETE | /me/addresses/:param | DELETE /me/addresses/:id |

# Backend client usage candidates

Static HTTP references; a wrapper does not prove UI usage.

| Backend Endpoint | Web | Mobile | Recommendation |
|---|---|---|---|
| GET /admin/audit-logs | Frontend-FixHome/src/api/admin-audit-logs.api.ts:136 | No static call | Trace page imports; see report |
| GET /admin/audit-logs/:id | Frontend-FixHome/src/api/admin-audit-logs.api.ts:153 | No static call | Trace page imports; see report |
| POST /auth/register | Frontend-FixHome/src/api/auth.api.ts:16 | Mobi-FixHome/src/api/auth.api.ts:52 | Trace page imports; see report |
| POST /auth/login | Frontend-FixHome/src/api/auth.api.ts:11 | Mobi-FixHome/src/api/auth.api.ts:40 | Trace page imports; see report |
| POST /auth/refresh | No static call | Mobi-FixHome/src/api/auth.api.ts:70 | Trace page imports; see report |
| POST /auth/logout | Frontend-FixHome/src/api/auth.api.ts:33 | Mobi-FixHome/src/api/auth.api.ts:82 | Trace page imports; see report |
| GET /auth/me | No static call | No static call | Trace page imports; see report |
| POST /bookings | Frontend-FixHome/src/api/bookings.api.ts:83 | Mobi-FixHome/src/api/bookings.api.ts:118 | Trace page imports; see report |
| GET /bookings/my | Frontend-FixHome/src/api/bookings.api.ts:90 | Mobi-FixHome/src/api/bookings.api.ts:123 | Trace page imports; see report |
| GET /bookings/:id | Frontend-FixHome/src/api/bookings.api.ts:92 | Mobi-FixHome/src/api/bookings.api.ts:128 | Trace page imports; see report |
| POST /bookings/:id/media | No static call | Mobi-FixHome/src/api/bookings.api.ts:202 | Trace page imports; see report |
| GET /bookings/:id/technician-candidates | Frontend-FixHome/src/api/bookings.api.ts:118 | Mobi-FixHome/src/api/bookings.api.ts:144 | Trace page imports; see report |
| POST /bookings/:id/shortlist | Frontend-FixHome/src/api/bookings.api.ts:121 | Mobi-FixHome/src/api/bookings.api.ts:159 | Trace page imports; see report |
| PATCH /bookings/:id/schedule | No static call | Mobi-FixHome/src/api/bookings.api.ts:191 | Trace page imports; see report |
| POST /bookings/:id/cancel | No static call | Mobi-FixHome/src/api/bookings.api.ts:183 | Trace page imports; see report |
| POST /bookings/:id/rebook | No static call | No static call | Trace page imports; see report |
| GET /invitations/my | Frontend-FixHome/src/api/bookings.api.ts:124 | Mobi-FixHome/src/api/bookings.api.ts:163 | Trace page imports; see report |
| POST /invitations/:id/respond | Frontend-FixHome/src/api/bookings.api.ts:127 | Mobi-FixHome/src/api/bookings.api.ts:178 | Trace page imports; see report |
| DELETE /admin/service-categories/:id | No static call | No static call | Trace page imports; see report |
| GET /admin/service-categories | No static call | No static call | Trace page imports; see report |
| POST /admin/service-categories | No static call | No static call | Trace page imports; see report |
| PATCH /admin/service-categories/:id | No static call | No static call | Trace page imports; see report |
| PATCH /admin/service-categories/:id/status | No static call | No static call | Trace page imports; see report |
| DELETE /admin/categories/:id | No static call | No static call | Trace page imports; see report |
| GET /admin/categories | Frontend-FixHome/src/api/catalog.api.ts:135 | No static call | Trace page imports; see report |
| POST /admin/categories | Frontend-FixHome/src/api/catalog.api.ts:140 | No static call | Trace page imports; see report |
| PATCH /admin/categories/:id | Frontend-FixHome/src/api/catalog.api.ts:145 | No static call | Trace page imports; see report |
| PATCH /admin/categories/:id/status | Frontend-FixHome/src/api/catalog.api.ts:150 | No static call | Trace page imports; see report |
| GET /service-categories | No static call | No static call | Trace page imports; see report |
| GET /service-categories/:idOrSlug | No static call | No static call | Trace page imports; see report |
| GET /categories | Frontend-FixHome/src/api/catalog.api.ts:123 | Mobi-FixHome/src/api/services.api.ts:39 | Trace page imports; see report |
| GET /categories/:idOrSlug | Frontend-FixHome/src/api/catalog.api.ts:129 | No static call | Trace page imports; see report |
| GET /dashboard/customer | No static call | No static call | Trace page imports; see report |
| GET /dashboard/technician | No static call | No static call | Trace page imports; see report |
| GET /dashboard/operations | No static call | No static call | Trace page imports; see report |
| GET /dashboard/system | No static call | No static call | Trace page imports; see report |
| GET /finance/platform-dues | Frontend-FixHome/src/api/admin-platform-dues.api.ts:130 | No static call | Trace page imports; see report |
| GET /health | No static call | No static call | Trace page imports; see report |
| GET /api/v1/health | No static call | No static call | Trace page imports; see report |
| POST /media/upload | No static call | No static call | Trace page imports; see report |
| GET /media/files/:filename | No static call | No static call | Trace page imports; see report |
| GET /notifications | No static call | No static call | Trace page imports; see report |
| GET /notifications/unread-count | No static call | No static call | Trace page imports; see report |
| PATCH /notifications/:id/read | No static call | No static call | Trace page imports; see report |
| PATCH /notifications/read-all | No static call | No static call | Trace page imports; see report |
| GET /admin/parts | Frontend-FixHome/src/api/admin-parts.api.ts:114 | No static call | Trace page imports; see report |
| GET /admin/parts/:id | Frontend-FixHome/src/api/admin-parts.api.ts:119 | No static call | Trace page imports; see report |
| POST /admin/parts | Frontend-FixHome/src/api/admin-parts.api.ts:124 | No static call | Trace page imports; see report |
| PATCH /admin/parts/:id | Frontend-FixHome/src/api/admin-parts.api.ts:129 | No static call | Trace page imports; see report |
| PATCH /admin/parts/:id/status | Frontend-FixHome/src/api/admin-parts.api.ts:134 | No static call | Trace page imports; see report |
| GET /parts/catalog | No static call | No static call | Trace page imports; see report |
| GET /parts/catalog/:id | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/quotations | Frontend-FixHome/src/api/orders.api.ts:183 | No static call | Trace page imports; see report |
| GET /service-orders/:id/quotations | No static call | No static call | Trace page imports; see report |
| GET /quotations/:id | No static call | No static call | Trace page imports; see report |
| POST /quotations/:id/decision | Frontend-FixHome/src/api/orders.api.ts:185, Frontend-FixHome/src/api/orders.api.ts:187 | No static call | Trace page imports; see report |
| POST /service-orders/:id/additional-costs | No static call | No static call | Trace page imports; see report |
| GET /service-orders/:id/additional-costs | No static call | No static call | Trace page imports; see report |
| POST /additional-costs/:id/decision | No static call | No static call | Trace page imports; see report |
| POST /additional-costs/:id/revise | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/reviews | No static call | No static call | Trace page imports; see report |
| POST /reviews | No static call | No static call | Trace page imports; see report |
| GET /service-orders/:id/reviews | No static call | No static call | Trace page imports; see report |
| GET /technicians/:id/reviews | No static call | No static call | Trace page imports; see report |
| GET /service-areas | Frontend-FixHome/src/api/service-areas.api.ts:20 | No static call | Trace page imports; see report |
| GET /service-areas/:id | Frontend-FixHome/src/api/service-areas.api.ts:25 | No static call | Trace page imports; see report |
| POST /service-areas | Frontend-FixHome/src/api/service-areas.api.ts:36 | No static call | Trace page imports; see report |
| PATCH /service-areas/:id | Frontend-FixHome/src/api/service-areas.api.ts:50 | No static call | Trace page imports; see report |
| PATCH /service-areas/:id/status | Frontend-FixHome/src/api/service-areas.api.ts:55 | No static call | Trace page imports; see report |
| DELETE /service-areas/:id | Frontend-FixHome/src/api/service-areas.api.ts:60 | No static call | Trace page imports; see report |
| GET /service-orders | Frontend-FixHome/src/api/orders.api.ts:126 | No static call | Trace page imports; see report |
| GET /service-orders/my | Frontend-FixHome/src/api/orders.api.ts:122, Frontend-FixHome/src/api/orders.api.ts:122 | No static call | Trace page imports; see report |
| GET /service-orders/:id | Frontend-FixHome/src/api/console-order-context.api.ts:152, Frontend-FixHome/src/api/orders.api.ts:128 | No static call | Trace page imports; see report |
| POST /service-orders/:id/en-route | Frontend-FixHome/src/api/orders.api.ts:133 | No static call | Trace page imports; see report |
| POST /service-orders/:id/check-in | Frontend-FixHome/src/api/orders.api.ts:141 | No static call | Trace page imports; see report |
| POST /service-orders/:id/evidence | Frontend-FixHome/src/api/orders.api.ts:159 | No static call | Trace page imports; see report |
| GET /service-orders/:id/evidence | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/start-repair | Frontend-FixHome/src/api/orders.api.ts:149 | No static call | Trace page imports; see report |
| POST /service-orders/:id/request-completion | Frontend-FixHome/src/api/orders.api.ts:167 | No static call | Trace page imports; see report |
| POST /service-orders/:id/confirm-completion | Frontend-FixHome/src/api/orders.api.ts:172 | No static call | Trace page imports; see report |
| POST /service-orders/:id/complete | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/cancel | Frontend-FixHome/src/api/orders.api.ts:177 | No static call | Trace page imports; see report |
| GET /service-orders/:id/status-history | No static call | No static call | Trace page imports; see report |
| GET /service-orders/:id/invoice | Frontend-FixHome/src/api/orders.api.ts:217 | No static call | Trace page imports; see report |
| POST /invoices/:id/pay | Frontend-FixHome/src/api/orders.api.ts:220 | No static call | Trace page imports; see report |
| GET /service-orders/:id/warranties | Frontend-FixHome/src/api/orders.api.ts:227 | No static call | Trace page imports; see report |
| POST /service-orders/:id/cash-settlement/declare | Frontend-FixHome/src/api/orders.api.ts:195 | No static call | Trace page imports; see report |
| POST /service-orders/:id/cash-settlement/confirm | Frontend-FixHome/src/api/orders.api.ts:206 | No static call | Trace page imports; see report |
| GET /service-orders/:id/cash-settlement | Frontend-FixHome/src/api/orders.api.ts:213 | No static call | Trace page imports; see report |
| GET /commission-dues/my | No static call | No static call | Trace page imports; see report |
| GET /platform-dues/my | No static call | No static call | Trace page imports; see report |
| POST /commission-dues/:id/pay | No static call | No static call | Trace page imports; see report |
| POST /platform-dues/:id/pay | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/warranty-claims | Frontend-FixHome/src/api/orders.api.ts:233 | No static call | Trace page imports; see report |
| GET /service-orders/:id/warranty-claims | No static call | No static call | Trace page imports; see report |
| GET /repair-history | No static call | No static call | Trace page imports; see report |
| GET /cancellations | No static call | No static call | Trace page imports; see report |
| POST /cancellations/:id/review | No static call | No static call | Trace page imports; see report |
| GET /strikes | No static call | No static call | Trace page imports; see report |
| POST /strikes/:id/waive | No static call | No static call | Trace page imports; see report |
| DELETE /admin/services/:id | No static call | No static call | Trace page imports; see report |
| GET /admin/services | Frontend-FixHome/src/api/catalog.api.ts:178 | No static call | Trace page imports; see report |
| GET /admin/services/:id | No static call | No static call | Trace page imports; see report |
| POST /admin/services | Frontend-FixHome/src/api/catalog.api.ts:183 | No static call | Trace page imports; see report |
| PATCH /admin/services/:id | Frontend-FixHome/src/api/catalog.api.ts:188 | No static call | Trace page imports; see report |
| PATCH /admin/services/:id/status | Frontend-FixHome/src/api/catalog.api.ts:193 | No static call | Trace page imports; see report |
| GET /parts | No static call | No static call | Trace page imports; see report |
| GET /services | Frontend-FixHome/src/api/catalog.api.ts:161 | Mobi-FixHome/src/api/services.api.ts:49 | Trace page imports; see report |
| GET /services/:idOrSlug | Frontend-FixHome/src/api/catalog.api.ts:166 | Mobi-FixHome/src/api/services.api.ts:55 | Trace page imports; see report |
| POST /support/cases | No static call | No static call | Trace page imports; see report |
| GET /support/cases | Frontend-FixHome/src/api/support-cases.api.ts:375 | No static call | Trace page imports; see report |
| GET /support/cases/:id | Frontend-FixHome/src/api/support-cases.api.ts:387 | No static call | Trace page imports; see report |
| POST /support/cases/:id/resolve | Frontend-FixHome/src/api/support-cases.api.ts:394 | No static call | Trace page imports; see report |
| GET /admin/config | Frontend-FixHome/src/api/admin-config.api.ts:71 | No static call | Trace page imports; see report |
| GET /admin/config/:key | Frontend-FixHome/src/api/admin-config.api.ts:78 | No static call | Trace page imports; see report |
| PATCH /admin/config/:key | Frontend-FixHome/src/api/admin-config.api.ts:83 | No static call | Trace page imports; see report |
| POST /technicians/:id/assign | No static call | No static call | Trace page imports; see report |
| POST /service-orders/:id/assign | No static call | No static call | Trace page imports; see report |
| GET /admin/technician-verifications | Frontend-FixHome/src/api/admin-verifications.api.ts:144 | No static call | Trace page imports; see report |
| GET /admin/technician-verifications/:id | Frontend-FixHome/src/api/admin-verifications.api.ts:149 | No static call | Trace page imports; see report |
| GET /admin/technician-verifications/:id/documents/:documentId/access | No static call | No static call | Trace page imports; see report |
| PATCH /admin/technician-verifications/:id/approve | Frontend-FixHome/src/api/admin-verifications.api.ts:154 | No static call | Trace page imports; see report |
| PATCH /admin/technician-verifications/:id/reject | Frontend-FixHome/src/api/admin-verifications.api.ts:161 | No static call | Trace page imports; see report |
| POST /technicians/me/verification | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/verification | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/verification/status | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/verification/documents/:documentId/access | No static call | No static call | Trace page imports; see report |
| POST /technician/verification | No static call | No static call | Trace page imports; see report |
| GET /technician/verification | No static call | No static call | Trace page imports; see report |
| GET /technician/verification/status | No static call | No static call | Trace page imports; see report |
| GET /technician/verification/documents/:documentId/access | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/profile | No static call | No static call | Trace page imports; see report |
| PATCH /technicians/me/profile | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/services | No static call | No static call | Trace page imports; see report |
| PUT /technicians/me/services/:serviceId | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/schedule | No static call | No static call | Trace page imports; see report |
| PUT /technicians/me/schedule | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/time-off | No static call | No static call | Trace page imports; see report |
| POST /technicians/me/time-off | No static call | No static call | Trace page imports; see report |
| DELETE /technicians/me/time-off/:id | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/service-areas | No static call | No static call | Trace page imports; see report |
| PUT /technicians/me/service-areas | No static call | No static call | Trace page imports; see report |
| GET /technicians/me/earnings | No static call | No static call | Trace page imports; see report |
| GET /me/addresses | Frontend-FixHome/src/api/profile.api.ts:47 | Mobi-FixHome/src/api/users.api.ts:56 | Trace page imports; see report |
| POST /me/addresses | Frontend-FixHome/src/api/profile.api.ts:61 | Mobi-FixHome/src/api/users.api.ts:62 | Trace page imports; see report |
| PATCH /me/addresses/:id | Frontend-FixHome/src/api/profile.api.ts:76 | Mobi-FixHome/src/api/users.api.ts:67 | Trace page imports; see report |
| DELETE /me/addresses/:id | Frontend-FixHome/src/api/profile.api.ts:81 | Mobi-FixHome/src/api/users.api.ts:72 | Trace page imports; see report |
| GET /admin/users | Frontend-FixHome/src/api/admin-users.api.ts:144 | No static call | Trace page imports; see report |
| GET /admin/users/:id | Frontend-FixHome/src/api/admin-users.api.ts:149 | No static call | Trace page imports; see report |
| PATCH /admin/users/:id/status | Frontend-FixHome/src/api/admin-users.api.ts:157 | No static call | Trace page imports; see report |
| GET /me | Frontend-FixHome/src/api/auth.api.ts:21, Frontend-FixHome/src/api/profile.api.ts:33 | Mobi-FixHome/src/api/auth.api.ts:63 | Trace page imports; see report |
| PATCH /me | Frontend-FixHome/src/api/auth.api.ts:26, Frontend-FixHome/src/api/profile.api.ts:42 | No static call | Trace page imports; see report |
| GET /users/me | No static call | Mobi-FixHome/src/api/users.api.ts:46 | Trace page imports; see report |
| PATCH /users/me | No static call | Mobi-FixHome/src/api/users.api.ts:51 | Trace page imports; see report |
| GET /users | No static call | No static call | Trace page imports; see report |
| GET /users/:id | No static call | No static call | Trace page imports; see report |
| PATCH /users/:id/status | No static call | No static call | Trace page imports; see report |

# Mock/configuration search hits

Includes comments, animations, development configuration and test providers: a hit alone is not a defect.

| File | Line | Evidence |
|---|---|---|
| Backend-FixHome/src/config/env.validation.ts | 36 | DATABASE_HOST: string = 'localhost'; |
| Backend-FixHome/src/config/env.validation.ts | 87 | AI_SERVICE_URL: string = 'http://localhost:8000'; |
| Backend-FixHome/src/config/env.validation.ts | 130 | CORS_ORIGIN: string = 'http://localhost:5173,http://localhost:8081'; |
| Backend-FixHome/src/database/data-source.ts | 25 | host: process.env.DATABASE_HOST \|\| 'localhost', |
| Backend-FixHome/src/database/database.module.ts | 12 | host: configService.get<string>('DATABASE_HOST', 'localhost'), |
| Backend-FixHome/src/modules/health/health.service.ts | 10 | let timer: ReturnType<typeof setTimeout> \| undefined; |
| Backend-FixHome/src/modules/health/health.service.ts | 16 | timer = setTimeout(() => reject(new Error('Health timeout')), 5000); |
| Backend-FixHome/src/setup-app.ts | 22 | : ['http://localhost:5173', 'http://localhost:8081']; |
| Frontend-FixHome/src/api/catalog.api.ts | 53 | // Local to this adapter: the shared Axios client is unchanged and no mock |
| Frontend-FixHome/src/api/client.ts | 4 | const API_BASE_URL = import.meta.env.VITE_API_BASE_URL \|\| 'http://localhost:3000/api/v1'; |
| Frontend-FixHome/src/api/console-order-context.api.ts | 5 | // and malformed responses throw and never fall back to local/mock order data. |
| Frontend-FixHome/src/layouts/AdminLayout.vue | 19 | <!-- TODO: Add navigation links as features are implemented --> |
| Frontend-FixHome/src/pages/console/ConsoleOrderDetailPage.vue | 45 | // This page never falls back to local or mock order data. |
| Frontend-FixHome/src/pages/customer/BookingCandidatesPage.vue | 61 | setTimeout(() => { |
| Frontend-FixHome/src/pages/customer/CustomerProfilePage.vue | 88 | setTimeout(() => { |
| Frontend-FixHome/src/pages/dashboard/DashboardPage.vue | 9 | <!-- TODO: Implement dashboard with statistics and overview --> |
| Frontend-FixHome/src/pages/dashboard/DashboardPage.vue | 17 | // TODO: Fetch dashboard data |
| Frontend-FixHome/src/pages/public/ServiceDetailPage.vue | 15 | // Fallback mock if backend is unavailable |
| Frontend-FixHome/src/pages/public/ServiceDetailPage.vue | 17 | id: 'mock-1', |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 18 | const mockFoundOrder = ref<{ |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 30 | setTimeout(() => { |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 33 | mockFoundOrder.value = { |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 128 | <div v-if="searched && mockFoundOrder" class="space-y-6"> |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 132 | <span class="text-xs font-num font-bold text-ink-500">{{ mockFoundOrder.code }}</span> |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 133 | <h3 class="text-lg font-bold text-ink-900">{{ mockFoundOrder.service }}</h3> |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 134 | <p class="text-xs text-ink-500">Thợ phụ trách: {{ mockFoundOrder.technician }}</p> |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 136 | <FhStatusPill :status="mockFoundOrder.status" /> |
| Frontend-FixHome/src/pages/public/TrackOrderPage.vue | 142 | <FhTimeline :steps="mockFoundOrder.steps" /> |
| Mobi-FixHome/src/constants/config.ts | 5 | API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL \|\| (Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1'), |
| Mobi-FixHome/src/screens/customer/CustomerMatchingScreen.tsx | 71 | // Mock finding technician after 3 seconds |
| Mobi-FixHome/src/screens/customer/CustomerMatchingScreen.tsx | 72 | const timer = setTimeout(() => { |
| Mobi-FixHome/src/screens/customer/CustomerMatchingScreen.tsx | 87 | {/* Fake Map */} |
| Mobi-FixHome/src/screens/customer/CustomerProfileScreen.tsx | 188 | setTimeout(() => { |
| Mobi-FixHome/src/screens/technician/TechnicianProfileScreen.tsx | 58 | setTimeout(() => { |
