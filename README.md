# SimpleNote

A self-hosted workspace for writing and organizing Markdown notes.

**🚧 Work in Progress — Under Active Development**

[About](#about-the-project) · [Technologies](#technologies) · [Features](#features) · [Getting Started](#getting-started) · [Project Status](#project-status)

## About the Project

SimpleNote brings a searchable note list and a Markdown reading pane into one interface. Built with Nuxt and PostgreSQL, it keeps user accounts and saved notes on your own infrastructure.

Core note creation and authentication are implemented. Several editing, organization, and account controls are still being connected to persistent backend operations.

## Technologies

![Nuxt](https://img.shields.io/badge/Nuxt_4-00DC82?style=flat-square&logo=nuxt&logoColor=white)
![Vue](https://img.shields.io/badge/Vue_3-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

- **Application:** Nuxt server routes, Vue components, and Tailwind CSS through its Vite plugin.
- **Data:** Prisma ORM with the PostgreSQL driver adapter.
- **Markdown:** Nuxt MDC for previews and note rendering; a textarea-based editor with formatting shortcuts.
- **Authentication:** Argon2 password verification and signed, HttpOnly session cookies.
- **Icons:** Nuxt Icon with Lucide and Solar icons.

## Features

### Implemented

- Username/password login, session restoration, and protected application routes.
- Creating notes and loading each user's notes from PostgreSQL.
- Markdown composition with write/preview tabs and formatting shortcuts.
- Note selection, Markdown rendering, and case-insensitive title search.
- Per-user note limits, with a default allowance of 25 notes.
- Moving notes to Trash through a soft-delete endpoint and hiding them from active lists.
- Read-only account details and note statistics.

### In Development / Partially Implemented

- **Persistent editing:** title and content edits currently update client state only.
- **Favorites and archives:** controls and filtered views exist, but changes are not saved to the database.
- **Trash management:** restoring and permanently deleting notes, plus a dedicated Trash view, are not implemented. Trashed notes still count toward the note limit.
- **Account settings:** profile updates, password changes, and avatar uploads are UI scaffolding without working save operations.
- **Appearance:** theme and accent selectors currently change selection state only; application-wide styling and persistence are incomplete.
- **Logout:** the account menu contains a logout control, but the flow is incomplete and its API endpoint is missing.

Editing, favorite, and archive changes are lost on reload. These controls should not be treated as durable saves.

## Getting Started

### Requirements

- Node.js **24.15+ within 24.x**, **22.22.3+ within 22.x**, or **26+**, matching the installed Nuxt version's declared requirements.
- npm, Git, and a running PostgreSQL database.

### 1. Install dependencies

```bash
git clone https://github.com/vaxen404/SimpleNote.git
cd SimpleNote
npm ci
```

Run the remaining commands from the project root.

### 2. Configure the environment

There is currently no checked-in `.env.example`. Create a local `.env` file using these placeholders:

```dotenv
DATABASE_URL="postgresql://<db-user>:<db-password>@localhost:5432/simplenote"
AUTH_SECRET="<replace-with-a-random-secret-of-at-least-32-characters>"
```

Replace the database credentials and database name with your own values. `AUTH_SECRET` signs session cookies and must contain at least 32 characters. Generate a value locally with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Keep `.env` private; it is excluded from Git. `DATABASE_URL` is read by both Prisma and the application. `AUTH_SECRET` is required by the authentication backend.

### 3. Initialize the database

Create the PostgreSQL database referenced by `DATABASE_URL`, then generate the client and apply the checked-in migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

The CLI uses `prisma.config.ts` and `prisma/schema.prisma`. The generated client is written to `generated/prisma/` and is excluded from Git.

### 4. Provision the first account

Public registration and a checked-in seed script are not available. Before logging in, provision a record in `users` using Prisma or a database administration tool: provide a UUID, a unique username, and an Argon2id password hash in `password_hash`. Email is optional; the default role is `USER` and the default note limit is 25. Never store a plaintext password.

### 5. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/login` or `/notes` based on the current session.

### Build and preview

```bash
npm run build
npm run preview
```

For a Node.js deployment, start the built server from the project root with `NODE_ENV=production` set in the deployment environment:

```bash
node --env-file=.env .output/server/index.mjs
```

Use HTTPS in production because session cookies have the `Secure` flag in production mode. If configuration is supplied through the process environment, omit `--env-file=.env`. Authentication and database operations require a running server; static hosting alone is insufficient.


## Roadmap

SimpleNote is under active development. Planned improvements include:

- [x] User authentication
- [x] Note creation and Markdown preview
- [x] Note search
- [x] Soft-delete functionality
- [ ] Persistent note editing
- [ ] Favorites and archives persistence
- [ ] Trash management and note restoration
- [ ] Account settings and profile management
- [ ] Logout functionality
- [ ] Theme customization
- [ ] Responsive UI improvements

Features and priorities may change as development continues.

## Project Status

**🚧 Work in Progress — Under Active Development**

SimpleNote is an early-stage application, not a feature-complete release. Backend persistence for the partial features above, account workflows, and interface refinements remain unfinished. The interface currently contains both English and Turkish text.

Database schemas and APIs may change during development. Back up existing data before applying migrations. The repository currently defines no automated test or type-check scripts.
