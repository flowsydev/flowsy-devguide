# Source Control with Git

Guidelines for Git, branching, commits and versioning in the Flowsy ecosystem.

## General Principles

- Traceable and reviewable history.
- Small, single-purpose changes.
- Integration to main branches via Pull Request.

## Branch Strategy

GitFlow-based strategy for open source and personal projects.

### Branches

- **`main`**
  - Contains production-ready code.
  - Protected branch: no direct merge/push.
  - Updated only from `release/v<A.B.C>` or `hotfix/v<A.B.C>` branches via Pull Request.

- **`develop`**
  - Integration branch that aggregates completed features before a release.
  - Protected branch: no direct merge/push.
  - Updated from `feature/<scope>/<name>` branches via Pull Request.

- **`feature/<scope>/<name>`**
  - Working branch for a specific feature or documentation change.
  - Created from `develop`.
  - Merged back to `develop` via Pull Request.
  - Examples: `feature/docs/add-rabbitmq-guide`, `feature/backend/add-outbox-pattern`.

- **`release/v<A.B.C>`**
  - Release preparation branch.
  - Created from `develop` when the release scope is complete.
  - Only bug fixes and release metadata changes (CHANGELOG, version bump) are allowed.
  - Merged to `main` and back to `develop` via Pull Request.
  - A `v<A.B.C>` tag is created from `main` after merging.

- **`hotfix/v<A.B.C>`**
  - Urgent fix for a production issue.
  - Created from `main`.
  - Merged to `main` and `develop` via Pull Request.
  - A new patch tag is created after merging.

### Tags

- **`v<A.B.C>`**
  - Marks a commit with the specified version.
  - `A`: Major version (breaking changes).
  - `B`: Minor version (backward-compatible new features).
  - `C`: Patch version (backward-compatible bug fixes).
  - Created from `main` after a successful release merge.

## Commit Convention

- Use `Conventional Commits`.
- Base format: `type(scope): description`.
- For documentation changes, use `docs`.

Reference: <https://www.conventionalcommits.org/>

## Changelog and Versioning

- Maintain `CHANGELOG.md` per repository.
- Follow `Keep a Changelog`.
- Version with `Semantic Versioning` (`MAJOR.MINOR.PATCH`).
- Maintain consistency between tag, artifact version and changelog.

References:

- <https://keepachangelog.com/>
- <https://semver.org/>
