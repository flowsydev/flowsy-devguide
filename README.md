# Flowsy DevGuide

Design and development guide for **Flowsy** solutions, with guidelines, patterns and best practices for development teams.

The site is built with [VitePress](https://vitepress.dev/) and organized into these main sections:

| Section | Content |
| --- | --- |
| **Conventions** | Coding standards for C#, TypeScript, Vue, PostgreSQL and Git |
| **Discovery & Design** | Event Storming, Domain-Driven Design and templates for requirements documentation |
| **AI-Assisted Development** | Agent guidance, context routing, specs-driven development and platform references |
| **Technologies / Backend** | Vertical Slice Architecture, event-driven architecture, database migrations |
| **Technologies / Frontend** | Modular architecture in Vue 3, Pinia, composables and testing |
| **Technologies / Testing** | Automated testing strategy for unit, integration, end-to-end, database and event-driven scenarios |

> [!NOTE]
> This guide is a reference point, not a mandate. The patterns, guidelines and examples documented here represent practices valued by the Flowsy ecosystem, but **each solution has its own needs**. It is each team's responsibility to analyze their context, evaluate alternatives and incorporate only what adds real value to their project. The team's technical judgment always prevails.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Local Development

```bash
# Install dependencies
npm install

# Start the development server (hot-reload)
npm run docs:dev
```

The site will be available at `http://localhost:5173`.

## Build and Preview

```bash
# Generate the production build
npm run docs:build

# Preview the generated build
npm run docs:preview
```

## Repository Structure

```text
📁 .
├── 📁 conventions/        # Style guides and coding conventions
├── 📁 discovery/          # Modeling techniques and requirements templates
├── 📁 ai-assisted-development/
│                         # Agent guidance, context routing and specs-driven development
├── 📁 technologies/
│   ├── 📁 backend/        # Architectures, patterns and C# examples
│   ├── 📁 frontend/       # Modular architecture in Vue 3
│   └── 📁 testing/        # Automated testing strategy and stack-specific guides
├── 📁 public/             # Static assets
├── 📄 index.md            # Site home page
└── 📄 package.json
```

## How to Contribute

### 1. Clone the repository

```bash
git clone <repo-url>
cd flowsy-devguide
npm install
```

### 2. Create a working branch

Follow the convention `feature/<scope>/<short-description>`, for example:

```bash
git checkout -b feature/docs/add-rabbitmq-guide
```

Common branch types: `feature/`, `fix/`, `release/`, `hotfix/`.

### 3. Write or edit documentation

- Content files are Markdown (`.md`) with support for [VitePress extensions](https://vitepress.dev/guide/markdown).
- Place the file in the corresponding thematic section (`conventions/`, `discovery/` or `technologies/`).
- If you add a new page, register it in `.vitepress/config.ts` in the correct `sidebar`.
- Verify changes in the development server before committing.

### 4. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "docs(backend): add RabbitMQ guide with C# examples"
```

### 5. Open a Pull Request

- Base: `develop`
- Title following Conventional Commits
- Briefly describe what is added or fixed and why

### General Guidelines

- Write in **English** (it is the language of the entire site).
- Prefer concrete code examples over abstract descriptions.
- Keep pages focused: one guide per topic, without mixing concepts from different layers.
- When installing dependencies or development tools, prefer stable `latest` versions over channels such as `alpha`, `beta`, `next` or other pre-release tags, unless there is a documented and justified exception.
- Update [CHANGELOG.md](CHANGELOG.md) if the change is visible to site readers.
