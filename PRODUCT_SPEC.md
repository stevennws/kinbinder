# 照顧夾 MVP Product Spec

## Product Positioning

照顧夾 is a Hong Kong caregiver coordination app for families who currently rely on WhatsApp, paper notes, appointment slips, medication bags, and scattered memory.

The MVP promise:

> 一家人同一個照顧工作台：今日邊個做咩、覆診要帶咩、緊急時要睇咩。

The product does not diagnose, recommend medication changes, or replace professional support. It organizes daily care work and routes users to existing Hong Kong support channels.

## MVP Scope

### P0

- Create a care recipient profile.
- Manage today's shared task list.
- Add care tasks from templates: medication, appointment, measurement, daily care.
- Complete, skip, or reopen tasks.
- Show emergency card actions for 999, 182 183, family contact, and share.
- View appointment prep with questions for doctors.
- Keep a lightweight document folder.
- Show family roles and consent messaging.
- Provide scenario-based support entry points.

### Deferred

- Backend sync and authentication.
- Push notification scheduling.
- True offline encrypted storage.
- File picker / camera upload.
- eHealth integration.
- AI OCR or summary.
- Professional portal.
- Marketplace or service booking.

## User Stories

### Epic 1: Daily Care Coordination

- As a primary caregiver, I want to see today's tasks so I know what still needs attention.
- As a family member, I want each task to show owner, time, category, and status so handover is clearer.
- As a helper, I want simple complete and skip actions so I can update the family quickly.

### Epic 2: Emergency Readiness

- As a caregiver, I want a clear emergency card so non-primary carers can act quickly.
- As a helper, I want one-tap call actions for 999, 182 183, and family contacts.
- As a family, I want sensitive data to be maskable and shared only by consent.

### Epic 3: Appointment Prep

- As a caregiver, I want appointment details, documents, and doctor questions in one place.
- As a family member, I want to add questions before the appointment so the companion does not forget.

### Epic 4: Support Navigation

- As a stressed caregiver, I want support by situation instead of a long list of links.
- As the product owner, I want the app to route users to official or trusted services without pretending to provide counselling.

## Functional Criteria

- Bottom navigation includes 今日, 照顧, 覆診, 家庭, 支援.
- The first screen is the working dashboard, not a landing page.
- Medication reminders always show a medical safety disclaimer.
- Emergency and support call buttons require confirmation before dialing.
- Role messaging explains what Admin, Family, Helper, and Viewer can access.
- The prototype should remain usable with only local state.

## Success Metrics

- 55% of testers can explain the product purpose after 2 minutes.
- 50% can create or update a task without help.
- 40% say the emergency card is useful enough to complete.
- 30% would invite at least one family member.
- 50% say the MVP is clearer than WhatsApp or paper for daily handover.

## Next Engineering Slice

1. Add persistent local storage for recipient, tasks, documents, and emergency card.
2. Add Expo notifications for task reminders.
3. Add document capture with an image picker.
4. Add a small backend for care-circle membership and role enforcement.
5. Add beta analytics events for activation and task engagement.
