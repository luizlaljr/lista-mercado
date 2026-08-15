# Minha Lista MVP Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.**

---

**Design**: `.specs/features/minha-lista-mvp/design.md`
**Status**: In Progress

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: none - strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| --- | --- | --- | --- | --- |
| Domain helpers | unit | All branches; 1:1 to category/progress/addition ACs; every listed edge case has a test | `src/lib/*.test.ts` | `npm run test` |
| Storage helpers | unit | Valid restore, invalid restore, and save behavior | `src/lib/*.test.ts` | `npm run test` |
| React page and styling | none | Build gate validates TypeScript/Next integration; visual behavior checked manually | n/a | `npm run build` |
| Config | none | Build gate only | n/a | `npm run build` |

## Parallelism Assessment

> Generated from codebase - confirm before Execute.

| Test Type | Parallel-Safe? | Isolation Model | Evidence |
| --- | --- | --- | --- |
| unit | Yes | Pure functions and per-test fake storage | Planned `src/lib/*.test.ts` |
| build | Yes | Stateless compiler/build command | Planned package scripts |

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| --- | --- | --- |
| Quick | After domain/storage tasks | `npm run test` |
| Build | After UI/config tasks | `npm run build` |
| Full | Before final validation | `npm run test && npm run build` |

---

## Execution Plan

### Phase 1: Foundation

```text
T1 -> T2
```

### Phase 2: Core Behavior

```text
T2 -> T3 -> T4
```

### Phase 3: UI Integration

```text
T4 -> T5 -> T6
```

---

## Task Breakdown

### T1: Scaffold Next.js TypeScript Tailwind App

**What**: Create package scripts, TypeScript, Next.js, Tailwind, and app shell files.
**Where**: repository root, `src/app/*`
**Depends on**: None
**Reuses**: Empty repository
**Requirement**: LIST-01, UI-01, UI-03

**Done when**:

- [ ] `npm install` succeeds.
- [ ] App shell compiles.
- [ ] `npm run build` passes.

**Tests**: none
**Gate**: build

---

### T2: Define Shopping List Types

**What**: Add shared item/category/progress types.
**Where**: `src/lib/types.ts`
**Depends on**: T1
**Reuses**: Data model in design
**Requirement**: LIST-02, CAT-01

**Done when**:

- [ ] Types export all MVP fields.
- [ ] TypeScript build sees the exports.

**Tests**: none
**Gate**: build

---

### T3: Implement Domain Helpers

**What**: Add item creation, normalization, categorization, and progress helpers with unit tests.
**Where**: `src/lib/shopping-list.ts`, `src/lib/shopping-list.test.ts`
**Depends on**: T2
**Reuses**: `src/lib/types.ts`
**Requirement**: LIST-02, LIST-03, LIST-04, LIST-05, CAT-01, CAT-02, CAT-03

**Done when**:

- [ ] Helpers satisfy mapped acceptance criteria.
- [ ] Unit tests cover category, progress, creation, and validation branches.
- [ ] `npm run test` passes.

**Tests**: unit
**Gate**: quick

---

### T4: Implement Storage Helpers

**What**: Add safe localStorage load/save helpers with unit tests.
**Where**: `src/lib/storage.ts`, `src/lib/storage.test.ts`
**Depends on**: T3
**Reuses**: `src/lib/types.ts`
**Requirement**: LIST-09

**Done when**:

- [ ] Valid saved lists restore.
- [ ] Invalid JSON restores as empty list.
- [ ] Save writes serialized items.
- [ ] `npm run test` passes.

**Tests**: unit
**Gate**: quick

---

### T5: Build Main Grocery List UI

**What**: Implement the responsive shopping-list screen and interactions.
**Where**: `src/app/page.tsx`, `src/app/globals.css`
**Depends on**: T4
**Reuses**: domain and storage helpers
**Requirement**: LIST-01 through LIST-09, UI-01, UI-02, UI-03

**Done when**:

- [ ] User can add custom and suggested items.
- [ ] User can toggle, delete, clear completed, and start a new list.
- [ ] Progress and empty states update immediately.
- [ ] `npm run build` passes.

**Tests**: none
**Gate**: build

---

### T6: Final TLC Validation

**What**: Run full gates and write validation report.
**Where**: `.specs/features/minha-lista-mvp/validation.md`
**Depends on**: T5
**Reuses**: spec, design, tasks
**Requirement**: All

**Done when**:

- [ ] `npm run test && npm run build` passes.
- [ ] Validation report maps evidence to acceptance criteria.

**Tests**: unit + build
**Gate**: full

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1 | Project scaffold/config | OK |
| T2 | One type module | OK |
| T3 | One domain module plus co-located tests | OK |
| T4 | One storage module plus co-located tests | OK |
| T5 | One page UI integration | OK |
| T6 | Validation report | OK |

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| --- | --- | --- | --- |
| T1 | None | Start | Match |
| T2 | T1 | T1 -> T2 | Match |
| T3 | T2 | T2 -> T3 | Match |
| T4 | T3 | T3 -> T4 | Match |
| T5 | T4 | T4 -> T5 | Match |
| T6 | T5 | T5 -> T6 | Match |

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| --- | --- | --- | --- | --- |
| T1 | Config/app shell | none | none | OK |
| T2 | Types | none | none | OK |
| T3 | Domain helpers | unit | unit | OK |
| T4 | Storage helpers | unit | unit | OK |
| T5 | React page/styling | none | none | OK |
| T6 | Validation docs | unit + build | unit + build | OK |
