# Business Rules - Unit: api

## BR-API-01: Authorization by Endpoint

### Visits Lambda
| Endpoint | Method | Allowed Roles |
|----------|--------|--------------|
| /api/visits | GET | All (filtered by role) |
| /api/visits/:id | GET | All (ownership check) |
| /api/visits | POST | Supervisor, Admin |
| /api/visits/:id/reschedule | PUT | All (ownership check for Technician) |
| /api/visits/:id/cancel | PUT | Supervisor, Admin |
| /api/visits/:id/complete | PUT | Technician (own visits only) |
| /api/visits/:id/finalize | PUT | Supervisor, Admin |
| /api/visits/:id/reassign | PUT | Supervisor, Admin |
| /api/visits/calendar | GET | All (filtered by role) |

### Catalogs Lambda
| Endpoint | Method | Allowed Roles |
|----------|--------|--------------|
| /api/catalogs/* | GET | All |
| /api/catalogs/* | POST/PUT | Admin only |

### Analytics Lambda
| Endpoint | Method | Allowed Roles |
|----------|--------|--------------|
| /api/analytics/* | GET | Supervisor, Admin |

## BR-API-02: Role-Based Data Filtering

### Visit Listing (GET /api/visits, GET /api/visits/calendar)
- **Technician**: returns visits where `technicianId === user.userId` OR `teamId === user.teamId`
- **Supervisor**: returns visits where `zoneId === user.zoneId`
- **Admin**: returns all visits (no filter)

### Visit Detail (GET /api/visits/:id)
- **Technician**: 403 if visit not assigned to them (technicianId or teamId)
- **Supervisor**: 403 if visit not in their zone
- **Admin**: no restriction

### Analytics
- **Supervisor**: filtered by `zoneId === user.zoneId`
- **Admin**: no filter (or explicit filter via query params)

## BR-API-03: Reschedule Logic

When a visit is rescheduled:
1. Validate current visit status is SCHEDULED (else 409 Conflict)
2. Validate reasonId exists and is active reschedule reason
3. Change original visit status to RESCHEDULED
4. Add history entry (type: RESCHEDULED, changedBy: user)
5. Set reasonId and reasonText on original visit
6. Create NEW visit with:
   - Same client, location, technician/team, serviceType, zone
   - New date and time from input
   - Status: SCHEDULED
   - History: single CREATED entry
7. Return the new visit

## BR-API-04: Cancel Logic

1. Validate current visit status is SCHEDULED or RESCHEDULED (else 409)
2. Validate reasonId exists and is active cancellation reason
3. Change visit status to CANCELLED
4. Set reasonId and reasonText
5. Add history entry (type: CANCELLED)
6. Return updated visit

## BR-API-05: Complete Logic

1. Validate current visit status is SCHEDULED (else 409)
2. Validate user is the assigned technician (technicianId === user.userId)
3. Change visit status to COMPLETED
4. Set notes if provided
5. Add history entry (type: COMPLETED)
6. Return updated visit

## BR-API-06: Finalize Logic

1. Validate current visit status is COMPLETED (else 409)
2. Change visit status to FINALIZED
3. Set notes if provided
4. Add history entry (type: FINALIZED)
5. Return updated visit

## BR-API-07: Reassign Logic

1. Validate current visit status is SCHEDULED (else 409)
2. Validate newTechnicianId exists
3. Update technicianId and technicianName
4. Add history entry (type: REASSIGNED)
5. Return updated visit

## BR-API-08: Catalog Toggle Rules

- Toggle sets isActive = !isActive
- Deactivated catalogs: excluded from GET responses unless `includeInactive=true` query param
- Admin always sees inactive catalogs in admin endpoints
- Catalog name uniqueness enforced on create/update (409 if duplicate)

## BR-API-09: Seed Data Structure

Static JSON with:
- 5 technicians (3 zones, 2 teams)
- 3 zones (Norte, Centro, Sur)
- 4 service types
- 6 reasons (3 cancellation, 3 reschedule)
- 20 visits (mix of all statuses, various technicians/zones)
- Each visit has 1-3 history entries
