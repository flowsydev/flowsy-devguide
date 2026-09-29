---
name: flw-git-change-request
description: Prepare or create GitHub pull requests and GitLab merge requests from verified branches.
user-invocable: true
---

# Claude Code Adapter

Read [../../SKILL.md](../../SKILL.md) completely and follow it as the canonical procedure. This skill may activate from context or through `/flw-git-change-request [source] [target]`.

Keep the required fetch and local-to-remote SHA equality, exclude working tree changes, and obtain approval of the exact proposal before creation. When the current source branch has pending changes, obtain the additional explicit confirmation described by the canonical skill. Use the applicable host reference for authentication and manual creation.
