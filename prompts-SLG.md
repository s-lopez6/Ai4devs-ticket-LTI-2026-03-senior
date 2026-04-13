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

Add a new instruction to @.cursor/agents/frontend-developer.md . for form validations, always use Vestjs: https://vestjs.dev/docs/api_reference

(model auto)
/enrich-us Enrich the story @ai-specs/changes/SCRUM-1-Add-Candidates.md . Do not use JIRA, is not connected so far.

@.cursor/commands/develop-backend.md @ai-specs/changes/SCRUM-1-Add-Candidates_backend.md

@.cursor/commands/develop-frontend.md @ai-specs/changes/SCRUM-1-Add-Candidates_frontend.md

You must set up properly the cors in the server, because I am getting a CORS error.
