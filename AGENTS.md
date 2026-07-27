# AGENTS.md

## Repo

Design and development guide built with VitePress. Public content lives under `content/` and is organized into `foundations/`, `documentation/`, `engineering/`, `quality/`, `ai-assisted-development/` and `conventions/`.

Changes should improve clarity, accuracy, structure or practical usefulness for the open source community and for projects that use Flowsy guidance, libraries, tools or templates.

## Specific Rules

- Write documentation, comments and examples in clear English by default. Use careful grammar, punctuation and terminology, and preserve proper names, acronyms and technical terms in their established form.
- Use Spanish only for concepts that are intrinsically Mexican or legal/business-specific, such as CURP or RFC.
- Keep Flowsy naming consistent:
  - friendly name: `Flowsy`;
  - GitHub organization: `flowsydev`;
  - command and artifact prefixes: `flw` or `flw-`;
  - .NET packages: `Flowsy.*`;
  - database CLI: `flwdb`.
- For published libraries, templates and tools, reference public registries such as NuGet and NPM as the consumption source. Use GitHub repositories for source, documentation, examples and contribution context.
- Use examples that fit a general community and open source audience. Avoid organization-specific, institutional or private-domain terminology unless a page explicitly discusses a Mexico-specific concept.
- Write titles, headings and navigation labels in Title Case: capitalize principal words and lowercase short articles, prepositions and conjunctions unless they are the first word or part of a proper name, acronym or technical term.
- Use emojis only when they add visual, semantic or didactic value. In folder structures, prefer them only when they improve readability.
- Every new page declares intent, audience and related canonical source according to `content/conventions/documentation-governance.md`.
- Place new pages in the correct thematic section, register them in `.vitepress/config.ts` and link them from the section landing page.
- Do not add canonical content under the historical routes `content/discovery/` or `content/technologies/`; those paths keep compatibility bridges only.
- Update `CHANGELOG.md` when the change is visible to readers of the site.
- When creating commits, use detailed messages in the predominant language of the repository's documentation following the Conventional Commits format.

## Commands

Install dependencies:

```bash
npm install
```

Minimum validation for documentation or navigation changes:

```bash
npm run docs:validate
npm run docs:build
```

Interactive local review, only when useful:

```bash
npm run docs:dev
npm run docs:preview
```

Do not use `npm test` as validation: there is currently no implemented test suite.

## Release Preparation and Publishing

- When receiving an explicit instruction to prepare the local repository for publishing, confirm developer approval before continuing. After approval:
  1. Update the `package.json`, `*.csproj`, `pom.xml` or equivalent file with the appropriate version.
  2. Move the `[Unreleased]` entries in `CHANGELOG.md` to a new versioned section with the appropriate version and today's date.
  3. Create a detailed commit in the predominant language of the repository's documentation following the Conventional Commits format.
  4. Create the corresponding git tag.
- Phrases that may trigger local release preparation include: "prepara el repo para publicar", "deja lista la versión", "actualiza el changelog, haz commit y tag", "prepara la versión para subir", "prepare the repo to publish", "make the release ready", "update changelog, commit and tag".
- When receiving an explicit instruction to publish changes to the remote repository, confirm developer approval before continuing. After approval, run `git push` and then `git push --tags`.
- Phrases that may trigger remote publishing include: "publica los cambios", "sube la versión y sus tags", "publish the changes", "push the release", "push to remote".
- Do not create commits, tags or pushes by inference. If the intent is unclear, ask before acting.

## Context on Demand

Read only when the task requires it:

- `README.md`: repository overview and base commands.
- `content/documentation/contributing.md`: flow for new pages and moves.
- `content/conventions/documentation-governance.md`: taxonomy, metadata, IDs, compatibility and canonical sources.
- `content/ai-assisted-development/agent-routing.md`: minimum context selection by task type.
- `content/ai-assisted-development/context-guides/`: focused guidance for backend, frontend, migrations, documentation, specs and repository instructions.
- `content/conventions/writing-guidelines.md`: editorial rules for durable documentation.
- `content/quality/`: testing strategy and validation evidence guidance.

## Care

- Do not include secrets, tokens, credentials or sensitive local paths in versioned files.
- Do not edit generated artifacts such as `.vitepress/dist/` unless the user explicitly requests it.
- `docs/` and `specs/` are internal and should remain outside public navigation.
- Do not modify source repositories used only as references unless the user explicitly asks for that repository to be changed.
- Preserve existing user changes in the working tree. If a file already has unrelated edits, work around them rather than reverting them.
