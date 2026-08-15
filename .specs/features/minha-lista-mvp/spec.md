# Minha Lista MVP Specification

## Problem Statement

Users need a fast mobile-first grocery list that is easier than writing items in notes or chat. The MVP must let a user add products, mark them while shopping, track progress, remove items, and keep the list after closing the browser without requiring an account or backend.

## Goals

- [ ] User can manage one active grocery list in a responsive web app from 360 px wide upward.
- [ ] User actions update immediately without page reloads.
- [ ] The active list persists in browser localStorage.

## Out of Scope

| Feature | Reason |
| --- | --- |
| Multiple lists and history implementation | Listed for future phases in the PRD. |
| User accounts, auth, sync, sharing, database | Explicitly excluded from the first prototype. |
| Manual category editing and product editing | Future evolution; MVP classifies automatically and supports delete/re-add. |
| Price estimation and analytics dashboards | Future phases only. |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| Quantity model in the MVP | Store quantity as a free-text string, defaulting to `1 un` for quick suggestions. | PRD examples mix amount and unit; free text is fastest for a prototype. | n |
| Duplicate item behavior | Adding the same product creates a new item at the top. | PRD says each add appears immediately; merging could surprise users. | n |
| New list confirmation | Use a browser confirmation before clearing all items. | Prevents accidental loss while keeping scope small. | n |
| Initial empty state | Show an actionable empty state and quick suggestions. | Helps zero-learning onboarding without extra screens. | n |
| Navigation tabs for History and Settings | Render disabled/prepared navigation items. | PRD asks navigation prepared, not implemented. | n |

**Open questions:** none - all unresolved decisions are logged as assumptions.

---

## User Stories

### P1: Manage Active Grocery List MVP

**User Story**: As a grocery shopper, I want to create and manage a single active list so that I can shop from my phone without losing track.

**Why P1**: This is the core vertical slice of the product.

**Acceptance Criteria**:

1. WHEN the user opens the app THEN the system SHALL show the active list screen with header, current date, input form, quick suggestions, list content, progress, and bottom navigation.
2. WHEN the user submits a non-empty product name and quantity THEN the system SHALL add the item to the beginning of the list with a generated id, inferred category, incomplete status, and the provided quantity.
3. WHEN the user submits an empty or whitespace-only product name THEN the system SHALL keep the list unchanged and show a validation message.
4. WHEN the user taps a quick suggestion THEN the system SHALL add that product to the beginning of the list with quantity `1 un` and an inferred category.
5. WHEN the user marks an incomplete product as bought THEN the system SHALL mark it completed, visually attenuate it, and update progress immediately.
6. WHEN the user unmarks a bought product THEN the system SHALL mark it incomplete, remove the completed visual state, and update progress immediately.
7. WHEN the user deletes one item THEN the system SHALL remove only that item immediately.
8. WHEN the user chooses remove bought products THEN the system SHALL remove all completed items and keep incomplete items.
9. WHEN the user chooses new list and confirms THEN the system SHALL remove all current items and show an empty list.
10. WHEN the page reloads after list changes THEN the system SHALL restore the last saved list from localStorage.

**Independent Test**: Can demo by opening the app, adding custom and suggested products, toggling, deleting, clearing completed, reloading, and seeing the same active state.

---

### P2: Automatic Categories

**User Story**: As a shopper, I want products categorized automatically so that the list is easier to scan in the store.

**Why P2**: The MVP can work without perfect categorization, but the PRD names this as a key experience requirement.

**Acceptance Criteria**:

1. WHEN the system receives known terms such as banana, leite, frango, agua, detergente, arroz, queijo, ovos, pao, or tomate THEN it SHALL assign the matching initial category from the PRD.
2. WHEN no category rule matches THEN the system SHALL assign `Outros`.
3. WHEN matching category terms THEN the system SHALL ignore case and common Portuguese accents.

**Independent Test**: Can call the categorization function with representative product names and verify the exact category.

---

### P2: Mobile-First Responsive UI

**User Story**: As a shopper inside a supermarket, I want the app to be clear and touch-friendly on a phone so that I can use it one-handed.

**Why P2**: Mobile usage is the primary context in the PRD.

**Acceptance Criteria**:

1. WHEN viewport width is 360 px or greater THEN the system SHALL keep primary controls usable without horizontal scrolling.
2. WHEN items are rendered THEN item actions SHALL have touch-friendly target sizing.
3. WHEN viewed on desktop THEN the system SHALL constrain content width and remain readable.

**Independent Test**: Can inspect at mobile and desktop widths and verify layout does not overflow and controls remain usable.

---

## Edge Cases

- WHEN localStorage contains invalid JSON THEN the system SHALL discard it and start from an empty list.
- WHEN all products are completed THEN the progress indicator SHALL show full completion.
- WHEN the list is empty THEN progress SHALL show `0 de 0 produtos comprados` and a zero-width progress fill.
- WHEN there are no completed products THEN remove bought products SHALL leave the list unchanged.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| LIST-01 | P1 active screen | Validation | Verified |
| LIST-02 | P1 add custom item | Validation | Verified |
| LIST-03 | P1 validation | Validation | Verified |
| LIST-04 | P1 quick suggestion | Validation | Verified |
| LIST-05 | P1 toggle bought/unbought | Validation | Verified |
| LIST-06 | P1 delete item | Validation | Verified |
| LIST-07 | P1 remove bought | Validation | Verified |
| LIST-08 | P1 new list | Validation | Verified |
| LIST-09 | P1 localStorage restore | Validation | Verified |
| CAT-01 | P2 known categories | Validation | Verified |
| CAT-02 | P2 fallback category | Validation | Verified |
| CAT-03 | P2 case/accent-insensitive matching | Validation | Verified |
| UI-01 | P2 360 px responsive layout | Validation | Verified |
| UI-02 | P2 touch-friendly controls | Validation | Verified |
| UI-03 | P2 desktop readable layout | Validation | Verified |

**Coverage:** 15 total, 15 mapped to tasks, 0 unmapped.

---

## Success Criteria

- [ ] User can complete all MVP acceptance criteria from the PRD.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
