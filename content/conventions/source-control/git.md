# Source Control with Git

Guidelines for Git, branching, commits and versioning in the Flowsy ecosystem.

## General Principles

- Traceable and reviewable history.
- Small, single-purpose changes.
- Integration to main branches via Pull Request.

## Branch Strategy

GitFlow-based strategy for open source and personal projects.

### Key Concepts

- **Branch**: movable pointer used to isolate a line of work.
- **Protected Branch**: branch that requires review, checks or permissions before accepting changes.
- **Pull Request**: review unit that explains the intent, scope, validation and risks of a change before it is integrated.
- **Tag**: immutable version marker used to identify a released commit.
- **Changelog**: reader-facing record of notable changes grouped by version.

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
- Use scopes that help locate the affected area, such as `docs`, `backend`, `frontend`, `testing`, `db` or a feature name.
- For documentation changes, use `docs`.
- Keep the description imperative, concise and reader-facing.
- Use bullets in description to include details.
- Prefer several focused commits over one large mixed commit when the change has separable intent.
- Write commits in the predominant language of the repository's documentation.

Reference: <https://www.conventionalcommits.org/>

## Pull Requests

Pull Requests should make review easier, not merely act as a merge button. A good Pull Request explains what changed, why it changed, how it was validated and what risk remains.

### Title

Use a concise title that follows the same intent as Conventional Commits when possible:

```text
docs(ai): expand specs-driven development guidance
feat(api): add order cancellation endpoint
fix(db): preserve nullable customer reference during migration
```

### Description

Use a stable template that can be adapted to each repository:

```markdown
## Purpose

Briefly explain why this change is needed.

## Main Changes

- Change 1
- Change 2
- Change 3

## Validation

- Command or test executed
- Relevant manual check, screenshot or generated evidence

## Risks and Considerations

- Known limitation, migration concern, rollout note or reason this is low risk

## References

- Related issue, spec, ADR, contract or documentation page
```

Use the `Validation` section to report actual evidence, not intentions. If a relevant validation could not be executed, say so explicitly and explain why.

## Release Flow

For repositories that publish packages, templates, tools or documentation sites, release preparation should be explicit:

1. Merge feature branches into `develop` through Pull Requests.
2. Create `release/v<A.B.C>` from `develop` when the release scope is complete.
3. Update release metadata such as `CHANGELOG.md`, package version or documentation version.
4. Merge the release branch into `main` through Pull Request.
5. Create tag `v<A.B.C>` from the released commit on `main`.
6. Merge `main` back into `develop` when needed to keep release metadata synchronized.

For smaller projects, the same principles can be applied with a simpler branch model. Keep the version, changelog, tag and published artifact aligned.

## Changelog and Versioning

- Maintain `CHANGELOG.md` per repository.
- Follow `Keep a Changelog`.
- Version with `Semantic Versioning` (`MAJOR.MINOR.PATCH`).
- Maintain consistency between tag, artifact version and changelog.
- Record reader-visible changes, not every internal refactor.
- Keep unreleased changes under `[Unreleased]` until a version is prepared.
- Prefer clear categories such as `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` and `Security`.

References:

- <https://keepachangelog.com/>
- <https://semver.org/>
