## Frontend Implementation Plan Ticket Template Structure

### 1. **Header**

- Title: `# Frontend Implementation Plan: SCRUM-1-Add-Candidates Add Candidates (Create Candidate)`

### 2. **Overview**

Implement an **Add Candidate** flow in the React frontend so recruiters can submit a candidate profile (MVP fields) with good UX (validation, loading states, error feedback) and persist it via the backend `POST /candidates`.

Frontend architecture principles:
- **Component-based architecture** with small, focused components.
- **Service layer** for API calls (`src/services/`) to avoid fetch logic inside UI components.
- **Type safety** with TypeScript types for request/response payloads.
- **Consistent UI** using the repo “source of truth” branding (`README.md`): **Material UI (MUI)** + pastel palette.
- **English-only** UI strings, errors, and test names.

### 3. **Architecture Context**

- **Key repo realities to account for**
  - The current React app is the CRA starter (`frontend/src/App.tsx`) and has no routing, service layer, or pages yet.
  - `frontend/package.json` does **not** include `@mui/*`, `react-router-dom`, or `axios` yet.
  - `ai-specs/specs/frontend-standards.mdc` references Bootstrap/React-Bootstrap, but the project README defines MUI as the UI library. For this ticket, treat `README.md` as the UI “source of truth”.

- **Components/services involved (to be created)**
  - `src/services/candidateService.ts` (API communication)
  - `src/pages/AddCandidatePage.tsx` (screen/page)
  - `src/components/CandidateForm.tsx` (reusable form component)
  - `src/components/FeedbackAlert.tsx` or inline MUI `Alert` + `Snackbar` patterns

- **Routing considerations**
  - Add a route for the form, e.g.:
    - `GET /candidates/new` → Add Candidate page
  - Add a simple navigation entry point from the home screen (until a full nav exists).

- **State management approach**
  - Local state via `useState` for form state, loading state, submit error/success.
  - Optional: extract a `useAddCandidateForm()` hook if logic grows.

### 4. **Implementation Steps**

#### **Step 0: Create Feature Branch**

- **Action**: Create and switch to a new feature branch before any code changes.
- **Branch Naming (required)**: `feature/SCRUM-1-Add-Candidates-frontend`
- **Implementation Steps**:
  1. Ensure local `main` is up to date.
  2. Create and switch branch: `git checkout -b feature/SCRUM-1-Add-Candidates-frontend`
  3. Verify: `git branch`
- **Notes**: Follow `ai-specs/specs/frontend-standards.mdc` “Development Workflow”.

#### **Step 1: Add required dependencies (greenfield setup)**

- **File**: `frontend/package.json`
- **Action**: Install routing + MUI + HTTP client deps needed to implement the ticket.
- **Dependencies**
  - UI:
    - `@mui/material`
    - `@emotion/react`
    - `@emotion/styled`
    - (optional) `@mui/icons-material` (only if icons are used)
  - Routing:
    - `react-router-dom`
  - HTTP:
    - `axios` (recommended by `frontend-standards.mdc` service examples)
- **Implementation Steps** (run from `frontend/`):
  1. `npm install @mui/material @emotion/react @emotion/styled`
  2. `npm install react-router-dom axios`
  3. If using icons: `npm install @mui/icons-material`
- **Implementation Notes**
  - Ensure versions resolve cleanly with React 18 / CRA.

#### **Step 2: Add API base URL configuration**

- **File(s)**:
  - `frontend/.env` (create if missing; do not commit secrets)
  - `frontend/src/services/apiClient.ts` (new)
- **Action**:
  - Centralize the API base URL and axios instance.
- **Suggested setup**
  - Use CRA env var: `REACT_APP_API_BASE_URL=http://localhost:3010`
  - `apiClient` exports a configured axios instance.
- **Implementation Notes**
  - Keep all env var names prefixed with `REACT_APP_` for CRA.

#### **Step 3: Define API types and candidate service method**

- **File**: `frontend/src/services/candidateService.ts`
- **Action**: Implement `createCandidate(payload)` to call `POST /candidates`.
- **Function/Component Signature**
  - `export type CreateCandidateRequest = { fullName: string; email: string; phone?: string; location?: string; linkedInUrl?: string; notes?: string }`
  - `export async function createCandidate(request: CreateCandidateRequest): Promise<Candidate>`
- **Implementation Steps**
  1. Define `Candidate` type with `id`, `fullName`, `email`, `createdAt`, `updatedAt` (and optional fields if backend returns them).
  2. Implement API call.
  3. Normalize response handling to support either:
     - Wrapped responses: `{ success: true, data: Candidate }`, or
     - Direct candidate JSON.
  4. Normalize errors to a UI-friendly structure:
     - `validationErrors?: Record<string, string>`
     - `message: string`
     - `status: number`
- **Implementation Notes**
  - Map backend `400` field errors to form field helper text.
  - Map backend `409` to a dedicated “duplicate email” error message.

#### **Step 4: Build Add Candidate form component (MUI)**

- **File**: `frontend/src/components/CandidateForm.tsx`
- **Action**: Create a controlled form for all MVP fields with inline validation and accessible labels.
- **Component Signature**
  - `type CandidateFormValues = CreateCandidateRequest`
  - `type CandidateFormProps = { onSubmit: (values: CandidateFormValues) => Promise<void>; isSubmitting: boolean; serverFieldErrors?: Record<string, string>; serverError?: string }`
  - `export function CandidateForm(props: CandidateFormProps): JSX.Element`
- **Implementation Steps**
  1. Render fields with MUI `TextField`:
     - Full name* (required)
     - Email* (required)
     - Phone, Location, LinkedIn URL, Notes (multiline)
  2. Add client-side validation:
     - Required checks for full name/email
     - Basic email pattern check
     - Max lengths per story (don’t exceed server rules)
  3. Display errors:
     - Client errors immediately (on blur or on submit)
     - Server field errors under inputs (helperText + error)
  4. Submit button:
     - Disable while `isSubmitting`
     - Show progress indicator (`CircularProgress`) in button.
  5. Accessibility:
     - Ensure labels are present and clear
     - Provide `aria-describedby` implicitly via helperText
- **Implementation Notes**
  - Keep all strings in English.
  - Keep max-length constraints aligned with the story.

#### **Step 5: Create Add Candidate page and integrate service**

- **File**: `frontend/src/pages/AddCandidatePage.tsx`
- **Action**: Orchestrate submit flow, loading/error/success states, and post-create behavior.
- **Component Signature**
  - `export default function AddCandidatePage(): JSX.Element`
- **Implementation Steps**
  1. Maintain page state:
     - `isSubmitting`, `serverError`, `serverFieldErrors`, `successMessage`
  2. On submit:
     - Clear previous errors
     - Call `candidateService.createCandidate`
     - On success:
       - Show `Snackbar`/`Alert` success message
       - Post-create behavior (choose one for now):
         - **Fallback**: stay on page, clear form, show “Candidate created” + created email/name
         - If a list/details route exists, navigate there later.
  3. On error:
     - 400: map to field errors
     - 409: show “A candidate with this email already exists”
     - other: show generic error
- **Implementation Notes**
  - Keep the form reusable; page handles navigation and orchestration.

#### **Step 6: Add routing and entry-point navigation**

- **File(s)**:
  - `frontend/src/App.tsx`
  - (optional) `frontend/src/components/Home.tsx` if you prefer splitting
- **Action**:
  - Add React Router and route for Add Candidate.
- **Implementation Steps**
  1. Install and configure `BrowserRouter`, `Routes`, `Route`.
  2. Add:
     - `/` → simple home with a button “Add Candidate”
     - `/candidates/new` → `AddCandidatePage`
- **Implementation Notes**
  - Keep the home minimal until more tickets expand navigation.

#### **Step 7: Update or replace baseline tests**

- **Files**:
  - `frontend/src/tests/App.test.tsx`
  - New tests:
    - `frontend/src/components/CandidateForm.test.tsx`
    - `frontend/src/pages/AddCandidatePage.test.tsx`
- **Action**:
  - Replace CRA “learn react link” expectation with tests aligned to the new app shell.
  - Add focused tests for the form + submit behavior.
- **Testing scenarios**
  - CandidateForm:
    - Shows required errors when submitting empty
    - Validates invalid email format
  - AddCandidatePage:
    - Calls service with typed payload when valid
    - Renders server field errors from a mocked 400
    - Renders duplicate email message for 409
    - Shows success snackbar and clears form on 201
- **Implementation Notes**
  - Mock service layer (do not perform real network requests).

#### **Step 8: (Optional) Add Cypress E2E tests**

- **Context**: Cypress is referenced in `frontend-standards.mdc` but there is no Cypress setup in the current repo.
- **Recommendation**:
  - Do not introduce Cypress unless requested; keep to RTL/Jest for this ticket.
  - If the team wants it, create a follow-up ticket “Add Cypress baseline setup”.

#### **Step 9: Update Technical Documentation (MANDATORY)**

- **Action**: Ensure the project documentation reflects the UI library and the new route/page.
- **Implementation Steps**
  1. If any UI decisions changed (e.g., MUI usage vs Bootstrap in `frontend-standards.mdc`), either:
     - Update `ai-specs/specs/frontend-standards.mdc` to align with `README.md`, or
     - Add a clear note in standards about MUI being the source of truth for this project.
  2. Update `ai-specs/specs/api-spec.yml` if frontend depends on a concrete response shape (align with backend).
  3. Keep docs in English.

### 5. **Implementation Order**

1. Step 0: Create Feature Branch
2. Step 1: Install dependencies (MUI, router, axios)
3. Step 2: API base URL + api client
4. Step 3: Candidate service (types + createCandidate)
5. Step 4: CandidateForm component (MUI + validation)
6. Step 5: AddCandidatePage (submit orchestration + success/error feedback)
7. Step 6: Routing + entry-point navigation
8. Step 7: Unit/component tests (RTL)
9. Step 9: Documentation updates

### 6. **Testing Checklist**

- Form blocks submit when `fullName` or `email` is empty
- Invalid email shows validation error
- Submit disables button and shows loading indicator
- 400 errors map to field-level helper messages
- 409 shows “duplicate email” message
- 201 shows success feedback and clears the form
- No UI text in Spanish; all strings in English

### 7. **Error Handling Patterns**

- **Service layer**
  - Translate axios errors into a small, typed error object:
    - `{ status, message, validationErrors? }`
- **Component layer**
  - Show field errors inline for recoverable errors (400)
  - Show an `Alert`/`Snackbar` for non-field errors (409/500/network)
  - Avoid exposing raw stack traces or dumping JSON errors to the UI

### 8. **UI/UX Considerations**

- Use MUI components (`Container`, `Card`, `Stack`, `TextField`, `Button`, `Alert`, `Snackbar`)
- Provide clear required-field indicators (“*”)
- Disable submit while saving; show progress indicator
- Keep layout responsive with MUI spacing and max width (e.g., `maxWidth="sm"`)
- Accessibility: readable labels, focus order, keyboard submit

### 9. **Dependencies**

- New:
  - `@mui/material`, `@emotion/react`, `@emotion/styled`
  - `react-router-dom`
  - `axios`
- Optional:
  - `@mui/icons-material`

### 10. **Notes**

- Align with story field names (`fullName`, `linkedInUrl`) and backend contract (`POST /candidates`).
- The repo currently has a mismatch between `README.md` (MUI) and `frontend-standards.mdc` (Bootstrap). Prefer `README.md` for UI decisions and document any reconciliation.

### 11. **Next Steps After Implementation**

- Add Candidates list page (`/candidates`)
- Add Candidate details page (`/candidates/:id`) to enable the preferred post-create redirect

### 12. **Implementation Verification**

- Code Quality: TypeScript compile cleanly; lint rules respected
- Functionality: manual run confirms candidate can be created and UX states behave correctly
- Testing: Jest/RTL tests pass and cover success + validation + duplicate scenarios
- Integration: correct API base URL and endpoint path used
- Documentation: updated where required
