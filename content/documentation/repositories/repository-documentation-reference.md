---
title: Broad Repository Documentation Reference
description: Checklists and complementary examples for README, agent instructions, specs and local documentation; progressive pages keep the canonical path.
type: reference
audience: People who need additional repository documentation examples.
canonical: false
canonicalSource: /documentation/repositories/
---

# Repository Documentation

> [!IMPORTANT]
> This page is a broad non-normative reference. Follow [Repository Documentation](/documentation/repositories/) for the canonical progressive path.

Code repositories often contain operational documentation that does not live in the main documentation site, but directly affects team collaboration. This guide explains how to handle files such as `README.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/` and `docs/specs/`.

## Scope

Apply these conventions to:

- `README.md` and technical onboarding documentation;
- `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` and equivalent instructions;
- `CHANGELOG.md`;
- local guides under `docs/`;
- work specs under `docs/specs/`;
- ADRs, contracts, operations, security, deployment and troubleshooting documentation.

## Base Editorial Rule

Repository Markdown files should follow the [Writing Guidelines](/conventions/writing-guidelines):

- clear English by default for Flowsy repositories;
- titles, headings and navigation in Title Case;
- consistent terminology across code, docs and agent instructions;
- emojis only when they add visual, semantic or didactic value.

## README.md

The `README.md` should be the operational entry point for the repository. Prioritize information that helps readers install, run, validate, understand the structure and find deeper documentation.

Include, when applicable:

- repository purpose;
- primary stack;
- install, run and validation commands;
- relevant folder structure;
- links to project documentation, specs or Flowsy DevGuide;
- local configuration notes without exposing secrets.

Avoid turning `README.md` into a duplicate of full architecture documentation, decision logs or extensive content that belongs elsewhere.

### Safe Dependency Validation

For the canonical isolated-install flow, prefer [Dependency Safety](/engineering/security/dependency-safety). The steps below keep complementary package-manager examples.

When a repository requires third-party dependency installation, recommend an initial validation in an isolated container before running the install on the developer's regular checkout. Use this when cloning for the first time or when there is reasonable distrust about recent changes.

General flow:

1. Clone the repository into a temporary folder.
2. Check out the branch, tag or commit to review.
3. Run a Podman container with an image appropriate for the project stack.
4. Mount the temporary clone as `/src`, preferably read-only.
5. Copy `/src` to `/workspace` inside the container.
6. Change to `/workspace`.
7. Install dependencies with the relevant package manager.
8. Inspect the dependency tree and run available audits.
9. Exit the container and discard the temporary clone when no longer needed.

> [!warning] Important
> Do not run this validation on the developer's daily working checkout. Copying to `/workspace` prevents install scripts, build artifacts or dependency folders from modifying the mounted checkout directly.

#### NPM

```sh
git clone <repo-url> temp-repo
cd temp-repo
git checkout <reference-to-review>
podman run --rm -it -v .:/src:ro docker.io/library/node:22-bookworm sh
cp -a /src/. /workspace
cd /workspace
npm ci --ignore-scripts
npm ls --all
npm audit
exit
```

#### NuGet

```sh
git clone <repo-url> temp-repo
cd temp-repo
git checkout <reference-to-review>
podman run --rm -it -v .:/src:ro mcr.microsoft.com/dotnet/sdk:10.0 sh
cp -a /src/. /workspace
cd /workspace
dotnet restore
dotnet list package --include-transitive
dotnet list package --vulnerable --include-transitive
exit
```

#### Maven

```sh
git clone <repo-url> temp-repo
cd temp-repo
git checkout <reference-to-review>
podman run --rm -it -v .:/src:ro docker.io/library/maven:3-eclipse-temurin-21 sh
cp -a /src/. /workspace
cd /workspace
mvn dependency:go-offline
mvn dependency:tree
mvn org.owasp:dependency-check-maven:check
exit
```

#### Gradle

```sh
git clone <repo-url> temp-repo
cd temp-repo
git checkout <reference-to-review>
podman run --rm -it -v .:/src:ro docker.io/library/gradle:8-jdk21 sh
cp -a /src/. /workspace
cd /workspace
gradle dependencies
gradle dependencyCheckAnalyze
exit
```

If the repository uses Gradle Wrapper, replace `gradle` with `./gradlew`. The `dependencyCheckAnalyze` command requires OWASP Dependency-Check or an equivalent audit plugin.

#### Pip

```sh
git clone <repo-url> temp-repo
cd temp-repo
git checkout <reference-to-review>
podman run --rm -it -v .:/src:ro docker.io/library/python:3.13-bookworm sh
cp -a /src/. /workspace
cd /workspace
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip inspect
python -m pip install pip-audit
python -m pip_audit
exit
```

Adjust the base image, lock file and audit commands to the project's actual framework. If the package manager allows installation without scripts or hooks, use that option for the initial validation.

When reviewing the dependency tree and audit output, identify vulnerable, obsolete or unexpected packages. If a vulnerable dependency appears, determine whether it is direct or transitive, review severity, confirm whether a fixed version exists and document the decision before installing locally.

### References to Flowsy DevGuide

When a repository cites the DevGuide, prefer semantic references by guide name, section and purpose instead of depending on deep paths or anchors.

Recommended format:

```md
Flowsy DevGuide > Repository Documentation > Safe Dependency Validation
```

If a URL is needed, treat it as the current location and centralize those links in one references section so they can be updated easily.

## Agent Instructions

Files such as `AGENTS.md`, `CLAUDE.md` or `.github/copilot-instructions.md` should be short, actionable and repository-specific.

Use [Repository Agent Instructions](/ai-assisted-development/context-guides/repository-agent-instructions) to define content, structure and limits.

When the instructions mention a DevGuide section, use titles, concepts and purpose as the primary reference. Do not assume a deep path is permanent.

If the repository uses `CHANGELOG.md`, commits, tags and remote publishing as part of delivery, document which phrases authorize local release preparation and which authorize remote publication. These actions should require explicit approval before changelog edits, commits, tags or `git push`.

## Specs and Local Documentation

Specs under `docs/specs/` describe concrete work: requirements, analysis, plans, execution and summaries. For format and workflow, see [Work Specs](/documentation/work-specs/).

Local documentation under `docs/` should preserve durable operational or technical value for the repository. Product knowledge, requirements, architecture or validation with broader scope may belong in the main project documentation site instead.

## Review Checklist

Before closing a documentation change in a repository, verify:

- headings use Title Case;
- terminology is consistent with the DevGuide;
- no secrets, tokens or sensitive paths are included;
- declared commands exist;
- internal links work;
- content does not duplicate long-form information that should be linked.
