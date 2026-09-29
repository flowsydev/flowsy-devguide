---
title: Python
description: Backend implementation profile for Python, FastAPI and PostgreSQL.
type: landing
audience: People and agents designing or implementing Python backend services.
canonical: true
---

# Python

This profile maps the technology independent backend design and reliability rules to Python. Identify the shared rule first, then apply the implementation conventions that fit the service.

## Suggested Path

1. Review the [Backend Project Design Baseline](../design-baseline).
2. Define behavior boundaries with [VSA: Concepts](../architecture/vertical-slice-architecture).
3. Apply [VSA with FastAPI and PostgreSQL](./vertical-slice-architecture).
4. Use the [Gift Card Redemption Example](./assignment-reference) to connect files, transactions, errors and tests.
5. Verify the implementation with [Python and FastAPI Quality](/quality/stacks/python-fastapi).

## Application by Agents

Distinguish a conceptual rule from its technical mapping. Preserve use case boundaries, adapt names and dependencies to the repository, and run the project's actual validation commands. The example illustrates decisions. It does not mandate a template or authorize adding FastAPI, SQLAlchemy or PostgreSQL to a project that does not use them.
