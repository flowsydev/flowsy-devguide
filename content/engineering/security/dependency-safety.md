---
title: Dependency Safety
description: Canonical flow for reviewing third-party installs in an isolated, auditable environment.
type: guide
audience: People who install or update dependencies.
canonical: true
---

# Dependency Safety

Before running untrusted install scripts on a working machine, review the full repository and perform an initial installation in a disposable container.

## Safe Flow

1. Clone the exact reference into a temporary folder.
2. Review manifests, lock files and lifecycle scripts.
3. Mount the clone as read-only inside a container without secrets.
4. Copy the content to an internal working directory.
5. Install first with scripts disabled when the manager allows it.
6. Inspect the tree and run the ecosystem audit.
7. Enable scripts only after reviewing them.
8. Discard the container and temporary clone.

> [!warning] Important
> Do not run this validation on the developer's daily working checkout. Copying to `/workspace` prevents install scripts, build artifacts or dependency folders from modifying the mounted checkout directly.

### NPM

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
```

### NuGet

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
```

Adapt image and commands for Maven, Gradle or Python. Do not mount credentials or personal caches, and do not perform this validation on the everyday checkout.

READMEs should link this guide and keep only project-specific commands. Complementary wording may remain in the [Repository Documentation reference](/documentation/repositories/repository-documentation-reference#safe-dependency-validation).
