# TLC Project State

## Decisions

| ID | Status | Decision | Rationale |
| --- | --- | --- | --- |
| AD-001 | active | Use Next.js App Router with TypeScript for the initial web app. | Aligns with the PRD stack and deploys naturally to Vercel. |
| AD-002 | active | Keep MVP persistence in browser localStorage only. | The PRD explicitly excludes auth, backend, and database from the first prototype. |
| AD-003 | active | Put shopping-list business rules in framework-light TypeScript modules under `src/lib`. | Keeps categorization, progress, validation, and storage behavior testable and reusable when API routes are added. |
| AD-004 | active | Use Tailwind CSS for UI styling with CSS variables for product colors. | Matches the requested stack and keeps the design system centralized. |

## Handoff

No paused work.
