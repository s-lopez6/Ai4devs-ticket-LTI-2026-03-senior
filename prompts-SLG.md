/commit base context engineering

# Pre work, define Name of app, style and UI libraries

Prompt 1: Read the @README.md of the project. Use the @.cursor/agents/product-strategy-analyst.md to determine the following:

- Name of the application
- Color palette of the application
- Design UI Library to use

Once done, ask me if it is okey for me. Afterthat, add the information to the documentation.

Prompt 2: Almost okey. I dont like the colors. Please, use Pastel colors. Give me another suggestion and I will check it

Prompt 3: Yeah I like it. Please, adapt the documentation, and add the correspoinding instructions for the frontend agent

/commit Adding branding

# WORK

## Prompt 1

Add a new instruction to @.cursor/agents/frontend-developer.md . for form validations, always use Vestjs: https://vestjs.dev/docs/api_reference

## Prompt 2

(model auto)
/enrich-us Enrich the story @ai-specs/changes/SCRUM-1-Add-Candidates.md . Do not use JIRA, is not connected so far.

## Prompt 3

@.cursor/commands/develop-backend.md @ai-specs/changes/SCRUM-1-Add-Candidates_backend.md

## Prompt 4

@.cursor/commands/develop-frontend.md @ai-specs/changes/SCRUM-1-Add-Candidates_frontend.md

## Prompt 5

You must set up properly the cors in the server, because I am getting a CORS error.

/commit

## Prompt 6

Refactor the current "bare-bones" frontend into a production-ready interface. The core functionality is present, but the UI/UX is currently sub-par and fails to reflect our brand identity.

1. Brand Alignment:

Apply the brand palette and typography defined in our style guidelines (refer to the active context).

Ensure consistent use of primary, secondary, and semantic colors (success/error/warning).

2. UX Architecture:

Layout & Spacing: Transition from the current layout to a modern, grid-based system with generous whitespace and clear information hierarchy.

Interactive States: Implement meaningful transitions, focus states for accessibility, and hover effects that provide immediate feedback.

Empty/Loading States: Ensure the UI doesn't "jump" and feels stable as data loads.

3. Component Addition:

File Upload Utility: Integrate a new FilePicker component.

Requirement: It must feature a "Drag & Drop" zone and a manual "Browse" trigger.

Constraint: UI only. No API call is needed yet, but ensure the component manages its local state (filename display, clear button) so it’s ready for future integration.

4. Quality Standard:

Ensure the design is responsive and adheres to WCAG accessibility standards (contrast ratios, aria-labels).

Output: Provide the refactored code (React/Tailwind/CSS) that elevates this from a prototype to a polished product.

## Prompt 7

I like the UI, but you must follow the color guidelines defined in the README, as is instructed in the frontend-developer agent

## Notes:

I realize that was not following the standards because I was using Cursor, then I switched to Github copilot, and it didn't have the agents links
