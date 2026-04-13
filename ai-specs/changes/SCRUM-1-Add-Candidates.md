## SCRUM-1 — Add Candidates

### Summary
Enable recruiters to **create a new Candidate** in the ATS, capturing the minimum viable profile information with validation and clear feedback, and persisting it in the database.

### Background / Problem
The ATS needs a reliable way to register candidates so they can be reviewed and progressed through hiring stages later. Without a standardized “Add Candidate” flow, recruiters cannot start the pipeline and data quality becomes inconsistent.

### Goals
- **Provide a simple “Add Candidate” UI** (React + MUI) that recruiters can complete quickly.
- **Persist candidate records** in the backend (Express + Prisma) with server-side validation.
- **Prevent duplicates** where reasonable (at minimum, avoid exact email duplicates).
- **Return clear error messages** for invalid input and duplicates.

### Non-goals (for this story)
- Editing existing candidates
- Candidate list/search pages (unless the current UI needs a redirect target; see “Post-create behavior”)
- File upload (CV/Resume), parsing, enrichment, or integrations (LinkedIn, email, etc.)
- Full deduplication heuristics (fuzzy matching)
- Full hiring pipeline stages, tagging, notes, scoring, or assignments

### Primary Actor
- **Recruiter / Hiring coordinator**: wants to add a candidate quickly and accurately.

### User Story
As a recruiter, I want to add a candidate with their key information, so that the candidate can be tracked in the ATS and considered for roles.

### UX / Flow (happy path)
- Recruiter navigates to **Candidates → Add Candidate**.
- Recruiter fills out the form and submits.
- System validates input.
- On success:
  - Show a success confirmation.
  - Redirect to a sensible next step:
    - **Preferred**: Candidate details page (if exists).
    - **Fallback**: Candidates list page (if exists).
    - **If neither exists yet**: Stay on form, clear it, and show created candidate summary.

### Form Fields (MVP)
All field labels and helper text must be in **English**.

- **Full name** (required)
  - Constraints: trimmed, min 2 chars, max 200 chars
- **Email** (required)
  - Constraints: valid email format, trimmed, max 254 chars
  - Uniqueness: must be unique (case-insensitive) across candidates
- **Phone** (optional)
  - Constraints: trimmed, max 32 chars (store as entered; formatting is not required)
- **Location** (optional)
  - Constraints: trimmed, max 120 chars
- **LinkedIn URL** (optional)
  - Constraints: valid URL, max 500 chars
- **Notes** (optional)
  - Constraints: max 2000 chars

### Validation Rules
- **Client-side**: basic required checks and format hints for better UX.
- **Server-side (source of truth)**: enforce all constraints above.
- **Error reporting**:
  - Field-level errors should map cleanly to the UI.
  - Duplicate email should return a specific, user-friendly error.

### Data Model (conceptual)
Candidate
- `id` (string/uuid)
- `fullName` (string)
- `email` (string, unique case-insensitive)
- `phone` (string | null)
- `location` (string | null)
- `linkedInUrl` (string | null)
- `notes` (string | null)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### Backend API (draft contract)
This is a suggested contract to align frontend/backend work.

#### Create candidate
- **Method**: `POST`
- **Path**: `/candidates`
- **Request body**:
  - `fullName`: string (required)
  - `email`: string (required)
  - `phone`: string (optional)
  - `location`: string (optional)
  - `linkedInUrl`: string (optional)
  - `notes`: string (optional)
- **Responses**:
  - `201 Created`: returns created candidate (at least `id`, `fullName`, `email`, timestamps)
  - `400 Bad Request`: validation errors (field-level)
  - `409 Conflict`: duplicate email
  - `500 Internal Server Error`: unexpected failure

### Acceptance Criteria
- **AC1 — Can create a candidate**
  - Given I am on the Add Candidate form
  - When I provide a valid full name and email and submit
  - Then the candidate is persisted and I see a success confirmation

- **AC2 — Required field validation**
  - Given I am on the Add Candidate form
  - When I submit with an empty full name or empty email
  - Then I see field-level errors and no candidate is created

- **AC3 — Email format validation**
  - Given I am on the Add Candidate form
  - When I submit an invalid email
  - Then I see an email validation error and no candidate is created

- **AC4 — Duplicate email prevented**
  - Given a candidate already exists with email `candidate@example.com`
  - When I submit a new candidate with email `Candidate@Example.com`
  - Then the system rejects the request with a duplicate-email message and no duplicate is created

- **AC5 — Optional fields accepted**
  - Given I submit a candidate with optional fields populated
  - When the input meets constraints
  - Then the optional fields are stored and returned (when applicable)

- **AC6 — Clear error feedback**
  - Given the backend returns validation errors
  - When the UI receives them
  - Then the UI shows actionable messages without exposing stack traces or internal details

### Edge Cases / Notes
- **Whitespace**: leading/trailing whitespace is ignored for `fullName` and `email`.
- **Email casing**: uniqueness is case-insensitive.
- **Idempotency**: not required, but duplicates must be prevented by email uniqueness.
- **Security**: no sensitive data should be logged; avoid logging entire request bodies.

### Analytics / Telemetry (optional)
- Track event: `candidate_created`
  - Properties: `has_phone`, `has_linkedin`, `has_notes`
- Track event: `candidate_create_failed`
  - Properties: `reason` (validation | duplicate | server_error)

### Definition of Done
- Story document is complete and unambiguous.
- Frontend form implemented with MUI and aligned with branding in `README.md`.
- Backend endpoint implemented with Prisma persistence and server-side validation.
- Duplicate email handled deterministically.
- Automated tests exist for backend validation and duplicate handling (and frontend tests if the project has a standard for it).

### Test Plan (suggested)
- **Backend**
  - Creates candidate with minimal payload → `201`
  - Rejects missing `fullName` / `email` → `400`
  - Rejects invalid email → `400`
  - Rejects duplicate email (case-insensitive) → `409`
- **Frontend**
  - Required fields block submission (basic client validation)
  - Displays field errors from backend
  - Shows success confirmation and follows post-create behavior
