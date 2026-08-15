# Adaptive Suggestions Specification

## Problem Statement

Quick suggestions should stop being a fixed static list after the user starts using the app. On first use, suggestions should feel varied through a one-time random order; after usage history exists, suggestions should prioritize the products the user most often adds to their grocery lists.

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --- | --- | --- | --- |
| "First use" | First browser profile with no persisted suggestion order and no product history. | The MVP has no account/backend. | n |
| "Lists made" | Count every valid product added, including items later removed or cleared by "Nova lista". | Current MVP has only one active list, so additions are the only reliable local signal. | n |
| Suggestion count | Show up to 7 suggestions. | Keeps current UI density from the PRD. | n |
| Ties in ranking | Higher count first, then most recently added, then alphabetical. | Produces stable, useful ordering. | n |

**Open questions:** none - all unresolved decisions are logged as assumptions.

---

## User Story

### P1: Adaptive Quick Suggestions

**User Story**: As a returning shopper, I want quick suggestions based on products I usually add so that repeated grocery lists get faster over time.

**Acceptance Criteria**:

1. WHEN there is no saved suggestion order and no product history THEN the system SHALL create a random one-time ordering from the default quick suggestions and persist it.
2. WHEN there is a saved initial suggestion order but no product history THEN the system SHALL reuse the saved order instead of randomizing again.
3. WHEN the user adds a valid product THEN the system SHALL increment that normalized product's suggestion history count and update its last-used timestamp.
4. WHEN product history exists THEN the system SHALL show suggestions ordered by highest count, then most recent usage, then product name.
5. WHEN fewer than 7 history products exist THEN the system SHALL fill remaining suggestion slots from the saved initial suggestion order without duplicates.
6. WHEN product names differ only by case, accents, or repeated spaces THEN the system SHALL treat them as the same suggestion history entry while preserving the latest display name.
7. WHEN localStorage contains invalid suggestion data THEN the system SHALL fall back safely to default behavior.

**Independent Test**: Can verify with unit tests for first-use randomization, persisted order reuse, history ranking, duplicate normalization, fill behavior, and invalid storage recovery.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| --- | --- | --- | --- |
| SUG-01 | First-use random suggestions | Validation | Verified |
| SUG-02 | Persisted initial order reuse | Validation | Verified |
| SUG-03 | Add product to history | Validation | Verified |
| SUG-04 | Frequency ranking | Validation | Verified |
| SUG-05 | Fill from initial order | Validation | Verified |
| SUG-06 | Normalized duplicate handling | Validation | Verified |
| SUG-07 | Invalid storage recovery | Validation | Verified |
