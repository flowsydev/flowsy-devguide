# GitLab

Use for GitLab.com, GitLab Self-Managed, or GitLab Dedicated.

## CLI and Authentication

Check `glab --version` and `glab auth status --hostname <host>`. If authentication is unavailable in the current sandbox, offer safe interactive `glab auth login --hostname <host>` there or an authorized run outside the sandbox with the user's existing CLI session. Check authentication in the selected context before repository queries or creation. Request credentials only through a secure secret or interactive channel, never chat. If neither route works, provide manual creation after Git fetch succeeds. Approval of the proposed MR does not itself authorize running outside the sandbox.

Interactive login may offer web or device flow; consult `glab auth login --help` for the host. Do not use `glab auth status --show-token` or pass tokens in visible arguments. If `glab` is missing, offer manual creation.

## Repository

Confirm the selected remote using its path or URL:

```bash
glab repo view <repository> --output json
```

Prefer `git ls-remote --symref <remote> HEAD` for the default branch; use GitLab's response as a fallback.

## Open Request Check

```bash
glab mr list --repo <repository> --source-branch <source> \
  --target-branch <target> --output json
```

The list defaults to open requests.

## Create After Approval and SHA Recheck

```bash
glab mr create --repo <repository> --source-branch <source> \
  --target-branch <target> --title "<title>" \
  --description-file <temporary-file> --yes
```

Do not use `--fill`, `--push`, or `--create-source-branch`. If the result is uncertain, query open MRs before retrying.

## Manual Creation

Provide the project, **Source branch** = source, **Target branch** = target, title, and body. Direct the user to **Merge requests** → **New merge request**, check for a duplicate, and paste the proposal. Do not invent an MR ID or URL.

## Official Documentation

- [GitLab CLI authentication](https://docs.gitlab.com/cli/authentication/)
- [View a repository](https://docs.gitlab.com/cli/repo/view/)
- [List merge requests](https://docs.gitlab.com/cli/mr/list/)
- [Create a merge request](https://docs.gitlab.com/cli/mr/create/)
