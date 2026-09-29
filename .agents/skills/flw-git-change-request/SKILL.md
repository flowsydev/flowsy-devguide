---
name: flw-git-change-request
description: Prepare or create a new GitHub pull request or GitLab merge request between Git branches. Use for requests to open or draft a new PR, MR, or change request; exclude review, approval, merging, or editing an existing request.
---

# Git Change Request

Prepare or create a request from committed branch differences. Identify the host, repository, and branches from Git evidence before asking for missing details. The user must see the exact proposal before creation.

## Invocation

Activate from a request to prepare or create a new pull request or merge request. Explicit commands are `$flw-git-change-request [source] [target]` in Codex and `/flw-git-change-request [source] [target]` in Claude Code. Do not activate for an existing request or an unrelated administrative change request.

## Boundaries

- Support GitHub and GitLab, including identifiable hosted instances. Use `gh` or `glab` for automatic creation; offer manual creation if the appropriate CLI is unavailable.
- Fetch both branches before analysis. Require both local branches and matching local and remote SHA values. Do not create a request while either branch needs synchronization.
- Exclude staged, unstaged, and untracked changes. Never use a working tree diff to describe the proposed request.
- Do not run builds, tests, or linters unless the user explicitly requests them. Report only checks that ran.
- Do not checkout, reset, rebase, merge, commit, push, or edit repository files. If a branch is unpublished, report the required publication.
- Do not invent issues, reviewers, labels, milestones, test results, or business decisions. Never expose credentials.

## 1. Inspect Git State

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --porcelain
git remote -v
git config --get-regexp '^(remote\..*\.url|branch\..*\.(remote|merge))$'
```

Summarize local changes for the proposal. If the current branch becomes the source branch, the special confirmation in step 7 applies.

## 2. Identify the Remote and Host

Honor an explicit host, repository, or remote. Otherwise prefer the source branch upstream. With no upstream, use the only remote if there is one. With multiple remotes, identify the one publishing the source branch to the target repository; do not choose `origin` solely by name. Ask for the exact remote when evidence remains ambiguous or the change crosses forks.

Strip `.git` and any embedded credentials from the selected remote URL. `github.com` identifies GitHub; `gitlab.com` identifies GitLab. For other hosts, use a successful repository query with `gh` or `glab`, supported by matching CI configuration when available. Treat `.github/`, `.gitlab/`, and `.gitlab-ci.yml` as secondary clues. Ask which platform is used if evidence conflicts.

Read the applicable host reference: [GitHub](references/github.md) or [GitLab](references/gitlab.md).

## 3. Identify the Branches

Explicit branch names take priority. Infer the source from the current branch upstream, or its same named remote branch. Resolve the target with `git ls-remote --symref <remote> HEAD`, the host CLI's confirmed default branch, or an existing `refs/remotes/<remote>/HEAD`. The source upstream is not necessarily the target. Ask for unresolved names if HEAD is detached, the source is unpublished, both names coincide, or multiple combinations remain plausible.

Show the inferred platform, repository, remote, source, and target before analysis. Continue when the evidence is unambiguous; the full proposal remains open to correction.

## 4. Fetch and Verify Both Branches

```bash
git fetch --no-tags <remote> \
  "refs/heads/<source>:refs/remotes/<remote>/<source>" \
  "refs/heads/<target>:refs/remotes/<remote>/<target>"
git show-ref --verify --quiet "refs/heads/<source>"
git show-ref --verify --quiet "refs/heads/<target>"
git rev-parse "refs/heads/<source>"
git rev-parse "refs/heads/<target>"
git rev-parse "refs/remotes/<remote>/<source>"
git rev-parse "refs/remotes/<remote>/<target>"
```

Stop if fetching fails, a branch is missing, or either local SHA differs from its remote SHA. Diagnose a mismatch with `git rev-list --left-right --count "refs/remotes/<remote>/<branch>...refs/heads/<branch>"`: the first count is remote only; the second is local only. Report whether the branch needs a local update, publication, or divergence resolution. Do not synchronize it yourself. The manual path also requires a successful fetch. Once verified, retain the two immutable SHA values for analysis.

## 5. Analyze Committed Changes

```bash
git merge-base <target-sha> <source-sha>
git log --oneline --decorate <target-sha>..<source-sha>
git diff --find-renames --find-copies --stat <target-sha>...<source-sha>
git diff --find-renames --find-copies --name-status <target-sha>...<source-sha>
```

Inspect relevant hunks using the same SHA range. Identify the objective, main files, contract or data changes, and risks supported by the diff. Run explicitly requested validations and record their real results.

## 6. Draft and Check for Duplicates

Write a specific title following repository conventions. Use the project's or user's language for the body. Include a summary, main changes, confirmed risks when relevant, and actual validation. If no automated checks were requested, say so and identify the static branch diff reviewed. Do not claim unrun checks passed.

When authenticated, use the host reference to find an open request with the same repository, source, and target. If one exists, report it and stop. In manual mode, tell the user to check for duplicates in the web interface.

## 7. Present the Proposal

Refresh the current branch and `git status --porcelain`. Present host, repository, source with SHA, target with SHA, title, and the complete Markdown body. Mention excluded local changes. If the source is also the current branch and local changes exist, explicitly state that only commits already present on both the local and remote source branch will appear; local changes remain untouched.

Obtain approval of the exact proposal before automatic creation. In the dirty current source case, require one explicit confirmation covering both the proposal and exclusion of pending changes. If the proposal changes, present it again for approval. The initial request to create a PR or MR authorizes preparation, not approval of inferred branches and final text.

For manual creation, provide copyable title, body, branches, and host instructions. State that nothing was created and a duplicate could not be verified. No further approval is needed for the read only manual result.

## 8. Recheck and Create

After approval, requery both remote SHA values and local SHA values, current branch, and worktree status. Each local SHA, current remote SHA, and approved SHA must match. If a remote changed, fetch and restart at step 4. Any changed SHA requires renewed analysis, proposal, and approval. If the dirty current source condition appeared or changed, obtain the specific confirmation again.

Use the host CLI with explicit source, target, title, and a secure temporary body file containing the approved text. If creation returns an uncertain result, check whether the request exists before retrying. If CLI authentication fails, follow the host reference's safe authentication options, then use manual mode if neither works. Do not use `--fill`, a push, checkout, or an unapproved mutation as a workaround.

Report the request number or ID, URL, title, and source-to-target relation if created. Otherwise deliver the manual proposal and say it was not created. Report validation precisely.
