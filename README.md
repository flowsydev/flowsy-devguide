# Flowsy DevGuide

Cross-cutting design and development guide for Flowsy solutions, built with VitePress. It gathers foundations, documentation, engineering practices, quality, AI-assisted collaboration and shared conventions.

> [!NOTE]
> This guide is a reference, not a mandate. Each team should evaluate the guidance against its domain, constraints, risks and goals.

## Public Areas

| Area | Content |
| --- | --- |
| Foundations | Ubiquitous Language, discovery, Event Storming and domain modeling. |
| Documentation | Project artifacts, repositories, work specs and documentation tooling. |
| Engineering | Backend, data, messaging, frontend, security and cross-cutting topics. |
| Quality | Strategy, levels, evidence and test profiles. |
| AI-Assisted Development | Best practices, context routing and context guides. |
| Conventions | Documentation governance, writing guidelines and Git. |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

## Local Development and Validation

```bash
npm install
npm run docs:dev
```

Before delivering a documentation change:

```bash
npm run docs:validate
npm run docs:build
git diff --check
```

The local site uses `http://localhost:5173`. `npm run docs:preview` serves the generated build.

Do not use `npm test`: there is currently no implemented test suite.

## Repository Structure

```text
📁 .
├── 📁 .vitepress/                  # VitePress configuration and theme
├── 📁 content/                     # Public site; VitePress srcDir
│   ├── 📁 foundations/
│   ├── 📁 documentation/
│   ├── 📁 engineering/
│   ├── 📁 quality/
│   ├── 📁 ai-assisted-development/
│   ├── 📁 conventions/
│   └── 📁 public/
├── 📁 docs/                        # Internal audits and decisions
├── 📁 specs/                       # Unpublished operational work record
├── 📁 scripts/                     # Documentation validation
├── 📄 AGENTS.md
├── 📄 CHANGELOG.md
└── 📄 package.json
```

Historical routes under `content/discovery/` and `content/technologies/` are compatibility bridges; do not add new canonical content there.

## How to Contribute

1. Create a branch such as `feature/docs/add-rabbitmq-guide`.
2. Place content according to its primary intent.
3. Declare frontmatter according to [Documentation Governance](./content/conventions/documentation-governance.md).
4. Register new pages in the contextual sidebar and link them from their section landing page.
5. Keep a bridge when changing a public route.
6. Update `CHANGELOG.md` for visible changes.
7. Run documentation validation.

Consult the [Writing Guidelines](./content/conventions/writing-guidelines.md) for editorial rules.

### General Guidelines

- Write in **English** (it is the language of the entire site).
- Prefer concrete code examples over abstract descriptions.
- Keep pages focused: one guide per topic, without mixing concepts from different layers.
- Keep Flowsy naming consistent: `Flowsy`, `flowsydev`, `flw` / `flw-`, `Flowsy.*`, `flwdb`.
- For published libraries and tools, prefer NuGet and NPM as the consumption source.
- When installing dependencies or development tools, prefer stable `latest` versions over channels such as `alpha`, `beta`, `next` or other pre-release tags, unless there is a documented and justified exception.
- Do not edit generated artifacts under `.vitepress/dist/` or include secrets, tokens or credentials.
