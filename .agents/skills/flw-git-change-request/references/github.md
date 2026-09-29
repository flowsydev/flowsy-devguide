# GitHub

Use for GitHub.com or GitHub Enterprise Server.

## CLI and Authentication

Check `gh --version` and `gh auth status --hostname <host>`. If authentication is unavailable in the current sandbox, offer safe interactive `gh auth login --hostname <host> --web` there or an authorized run outside the sandbox using the user's existing CLI session. Check authentication in the selected context before repository queries or creation. Request credentials only through a secure secret or interactive channel, never chat. If neither route works, provide manual creation after Git fetch succeeds. Approval of the proposed PR does not itself authorize running outside the sandbox.

For insufficient permissions, suggest `gh auth refresh --hostname <host>` and consult `gh auth refresh --help`. Do not run `gh auth token` or `gh auth status --show-token`, nor include secrets in arguments or logs. If `gh` is missing, offer manual creation.

## Repository and Default Branch

Derive `[HOST/]OWNER/REPO` from the selected remote and confirm it matches:

```bash
gh repo view <repository> --json nameWithOwner,defaultBranchRef
```

## Open Request Check

```bash
gh pr list --repo <repository> --state open \
  --head <source> --base <target> --json number,title,url
```

## Create After Approval and SHA Recheck

```bash
gh pr create --repo <repository> --head <source> --base <target> \
  --title "<title>" --body-file <temporary-file>
```

Do not use `--fill` or omit branches. If the result is uncertain, query open PRs before retrying.

## Manual Creation

Provide the repository, `base` = target, `compare` = source, title, and body. Direct the user to **Pull requests** → **New pull request**, check for a duplicate, and paste the proposal. Do not invent a PR number or URL.

## Official Documentation

- [GitHub CLI authentication](https://cli.github.com/manual/gh_auth_login)
- [Authentication status](https://cli.github.com/manual/gh_auth_status)
- [Create a pull request](https://cli.github.com/manual/gh_pr_create)
