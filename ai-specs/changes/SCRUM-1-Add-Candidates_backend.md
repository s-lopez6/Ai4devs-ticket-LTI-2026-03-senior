## Backend Implementation Plan Ticket Template Structure

### 1. **Header**

- Title: `# Backend Implementation Plan: SCRUM-1-Add-Candidates Add Candidates (Create Candidate)`

### 2. **Overview**

Implement the backend capability to **create a Candidate** via `POST /candidates`, persist it in PostgreSQL via Prisma, and return consistent success/error responses.

Architecture principles:
- Apply **DDD + layered architecture** as described in `ai-specs/specs/backend-standards.mdc` (Domain, Application, Presentation).
- Keep validation in the **Application layer** (validator), business orchestration in **Application services**, persistence behind a **Domain repository interface** with a Prisma-based implementation.
- Ensure all technical artifacts (code, tests, docs) are **English-only**.

### 3. **Architecture Context**

- **Layers involved**
  - **Presentation**: Express route + controller for `POST /candidates`
  - **Application**: input validation, service orchestration, error mapping
  - **Domain**: Candidate entity/model + repository interface
  - **Infrastructure**: Prisma client + repository implementation

- **Existing baseline to account for**
  - Prisma schema exists at `backend/prisma/schema.prisma` and currently contains only `User`.
  - `backend/src/index.ts` is a minimal Express app and does not yet follow the full folder structure described in backend standards.
  - Backend tests exist (`backend/src/tests/app.test.ts`), but the baseline test expectation is not aligned with current `/` response; consider stabilizing baseline before adding more tests.

### 4. **Implementation Steps**

#### **Step 0: Create Feature Branch**

- **Action**: Create and switch to a new feature branch before any code changes.
- **Branch Naming (required)**: `feature/SCRUM-1-Add-Candidates-backend`
- **Implementation Steps**:
  1. Ensure local `main` is up to date.
  2. Create and switch branch: `git checkout -b feature/SCRUM-1-Add-Candidates-backend`
  3. Verify: `git branch`
- **Notes**: Follow `ai-specs/specs/backend-standards.mdc` “Development Workflow”.

#### **Step 1: Define Candidate Prisma Model (DB schema)**

- **File**: `backend/prisma/schema.prisma`
- **Action**: Add a `Candidate` model consistent with the user story.
- **Key decision (email uniqueness, case-insensitive)**:
  - PostgreSQL unique constraints are **case-sensitive** for `text/varchar` by default.
  - Implement **case-insensitive uniqueness** by adding a normalized column and unique index:
    - `email` (original, trimmed)
    - `emailNormalized` (lowercased, trimmed) with `@unique`
  - Alternative (optional): use `citext` (requires enabling extension + Prisma mapping). Prefer normalized-column approach for simplicity.
- **Suggested fields**
  - `id` as `String @id @default(uuid())`
  - `fullName` (String, length constraints enforced in validator)
  - `email` (String)
  - `emailNormalized` (String, `@unique`)
  - `phone`, `location`, `linkedInUrl`, `notes` as nullable strings
  - `createdAt` / `updatedAt` timestamps
- **Implementation Notes**:
  - Enforce trimming + normalization in Application validator/service (not in Prisma).

#### **Step 2: Create and Apply Migration (PostgreSQL)**

- **Action**: Generate and run Prisma migration.
- **Implementation Steps**:
  1. Ensure `DATABASE_URL` points to the local Postgres (Docker) database.
  2. Run: `npx prisma migrate dev --name add_candidate`
  3. Run: `npx prisma generate`
  4. Verify table and constraints exist in DB (unique constraint on `emailNormalized`).

#### **Step 3: Create Domain Model and Repository Contract**

- **File(s)**:
  - `backend/src/domain/models/candidate.ts`
  - `backend/src/domain/repositories/candidateRepository.ts`
- **Action**:
  - Define a `Candidate` domain type/entity reflecting persisted fields.
  - Define `CandidateRepository` interface with:
    - `create(data: CreateCandidateInput): Promise<Candidate>`
    - `findByEmailNormalized(emailNormalized: string): Promise<Candidate | null>` (optional if relying on DB unique + catch, but useful for clearer conflict errors)
- **Implementation Notes**:
  - Keep the domain layer free from Express/Prisma imports.

#### **Step 4: Add Application Validation for Create Candidate**

- **File**: `backend/src/application/validator.ts` (create if missing)
- **Action**: Implement `validateCreateCandidatePayload(payload: unknown): ValidatedCreateCandidateInput`
- **Validation rules (from story)**
  - `fullName`: required, trimmed, 2–200
  - `email`: required, trimmed, max 254, valid email format
  - `phone`: optional, trimmed, max 32
  - `location`: optional, trimmed, max 120
  - `linkedInUrl`: optional, valid URL, max 500
  - `notes`: optional, max 2000
  - Compute `emailNormalized = email.trim().toLowerCase()`
- **Implementation Notes**:
  - Return a typed object for the service.
  - On validation errors, throw a typed error (e.g., `ValidationError`) carrying field-level details.

#### **Step 5: Add Application Service to Create Candidate**

- **File**: `backend/src/application/services/candidateService.ts`
- **Action**: Implement `createCandidate(input: ValidatedCreateCandidateInput)`
- **Implementation Steps**:
  1. Option A (preferred for UX clarity): pre-check duplicate with repository `findByEmailNormalized`; throw `ConflictError` if found.
  2. Attempt repository `create`.
  3. If the DB unique constraint triggers anyway, translate Prisma error to `ConflictError`.
- **Dependencies**:
  - Domain repository interface
  - Typed errors (`ValidationError`, `ConflictError`)

#### **Step 6: Implement Prisma Repository**

- **File**: `backend/src/infrastructure/repositories/prismaCandidateRepository.ts`
- **Action**: Implement the domain `CandidateRepository` using Prisma.
- **Implementation Notes**:
  - Use a single Prisma client instance (existing pattern in `backend/src/index.ts` currently exports `prisma`).
  - Ensure repository maps Prisma record → domain model cleanly.

#### **Step 7: Presentation Layer (Controller + Route)**

- **File(s)**:
  - `backend/src/presentation/controllers/candidateController.ts`
  - `backend/src/routes/candidateRoutes.ts`
  - Update `backend/src/index.ts` to mount routes and JSON middleware
- **Action**:
  - Add `POST /candidates` route that:
    1. Validates body via validator
    2. Calls application service
    3. Returns `201` with created candidate payload
- **Response shape**
  - Follow backend standards “Request/Response Patterns”:
    - Success: `{ success: true, data: ..., message: ... }`
    - Error: `{ success: false, error: { message, code, details? } }`

#### **Step 8: Error Handling and Status Code Mapping**

- **File(s)**:
  - `backend/src/middleware/errorMiddleware.ts` (recommended)
  - Update `backend/src/index.ts` to use it last
- **Action**:
  - Centralize error mapping:
    - `ValidationError` → `400 VALIDATION_ERROR`
    - `ConflictError` (duplicate email) → `409 CONFLICT`
    - Unknown → `500 INTERNAL_SERVER_ERROR`
- **Implementation Notes**:
  - Remove `any` in the error middleware signatures and adopt typed errors.
  - Do not leak stack traces in responses.

#### **Step 9: Testing (TDD-aligned)**

- **Scope**: Unit tests for validator + service + controller, and minimal route integration via supertest if feasible.
- **Files (suggested)**
  - `backend/src/application/validator.test.ts`
  - `backend/src/application/services/candidateService.test.ts`
  - `backend/src/presentation/controllers/candidateController.test.ts`
- **Test categories**
  - **Happy path**: minimal payload returns 201 and created entity
  - **Validation errors**: missing `fullName`, missing `email`, invalid email, overly long fields
  - **Duplicate email (case-insensitive)**: `candidate@example.com` then `Candidate@Example.com` → 409
  - **Repository/DB error translation**: Prisma unique error → 409
- **Notes**
  - Mock repository in service tests.
  - Mock service in controller tests.
  - Keep tests deterministic and English-only.

#### **Step 10: Update Technical Documentation (MANDATORY)**

- **Action**: Update docs impacted by this story.
- **Implementation Steps**:
  1. **Data model**: update `ai-specs/specs/data-model.md` Candidate section to match implemented fields.
     - Current doc uses `firstName`/`lastName`/Spanish phone format; align it to this ticket’s MVP (`fullName`, `emailNormalized` uniqueness approach, relaxed phone rule per story), or explicitly document the mapping if you choose to keep first/last internally.
  2. **API spec**: update `ai-specs/specs/api-spec.yml` to include `POST /candidates` request/response + error schema.
  3. Ensure documentation remains English-only and consistent.

### 5. **Implementation Order**

1. Step 0: Create Feature Branch
2. Step 1: Define Candidate Prisma Model
3. Step 2: Create and Apply Migration
4. Step 3: Domain model + repository interface
5. Step 4: Create validation function
6. Step 5: Create candidate service method
7. Step 6: Prisma repository implementation
8. Step 7: Controller + route + mount in `index.ts`
9. Step 8: Global error middleware + status mappings
10. Step 9: Tests (validator/service/controller)
11. Step 10: Documentation updates (data model + API spec)

### 6. **Testing Checklist**

- `POST /candidates` returns **201** with minimal valid payload
- Missing `fullName` or `email` returns **400** with field-level details
- Invalid email returns **400**
- Duplicate email (case-insensitive) returns **409**
- Optional fields persist and return when provided
- Unknown error returns **500** without leaking internals
- Jest suite passes and meets coverage expectations (as configured)

### 7. **Error Response Format**

- Validation error (400):
  - `success: false`
  - `error.code: "VALIDATION_ERROR"`
  - `error.details`: array of `{ field, message }`
- Conflict (409):
  - `success: false`
  - `error.code: "CONFLICT"`
  - `error.message`: e.g., `"A candidate with this email already exists"`
- Server error (500):
  - `success: false`
  - `error.code: "INTERNAL_SERVER_ERROR"`

### 8. **Partial Update Support** (if applicable)

Not applicable (create-only ticket).

### 9. **Dependencies**

- Existing:
  - `express`, `@prisma/client`, `prisma`, `jest`, `supertest`, `dotenv`
- Optional (only if team chooses):
  - Schema validation library (e.g., `zod`) — not required; current plan can be implemented without new dependencies.

### 10. **Notes**

- Ensure **case-insensitive email uniqueness** via `emailNormalized` unique index.
- Align story vs existing docs:
  - `ai-specs/specs/data-model.md` currently describes `firstName`/`lastName`; this ticket story uses `fullName`. Decide one approach and document it clearly.
- Keep error messages and field names in **English**.

### 11. **Next Steps After Implementation**

- Consider adding follow-up tickets for:
  - Candidate list endpoint (`GET /candidates`)
  - Candidate details endpoint (`GET /candidates/:id`)
  - Edit candidate (`PUT/PATCH /candidates/:id`)

### 12. **Implementation Verification**

- Code Quality: ESLint + TypeScript compile cleanly
- Functionality: manual curl/postman test for create + duplicate case
- Testing: jest suite passes; key scenarios covered
- Integration: Prisma migration applied and Prisma client generated
- Documentation: `data-model.md` and `api-spec.yml` updated and accurate
