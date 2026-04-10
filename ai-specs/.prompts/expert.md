# Role

You are an expert software engineer with experience in modeling archit
ectures and databases.

# Objective

Build a data model for an application with the following functionalities:

- Core value: uses AI to generate personalized company reports for inv
  estors. It needs the company website URL and some investor data to p
  ersonalize (ideal round size, preferred industries, etc.).
- The application allows chatting with AI to extract detailed information
  from each of the reports. Take into account the data modeling required
  for ChatGPT-like applications and apply best practices for storing conv
  ersations.

# Clarifications about the model:

- Users will register with email and password, and we will have Google
  SSO.
- Profile data will be basic: name, role in the company (text).
- Users will belong to a company that buys seats for its users—a stand
  ard SaaS model. This requires having company information and linking
  it to its seats, as well as assigning a user role (administrator, analyst), c
  onfigured by the admin.
- Users will pay with Stripe, with an integration similar to ChatGPT. Stor
  e the necessary information for this in a `subscription` table. There is o
  nly one price now, but there may be more in the future; create a separa
  te table for pricing.
- Reports will be stored in a `report` table: the submitted website, the c
  ompany name, the raw report, and the URL of the generated PDF store
  d in the cloud for download (not all will generate one).
- Chats, as explained, must be stored to maintain history.

Analyze the project and ask me any questions you consider necessary to clarify before proposing the solution.
