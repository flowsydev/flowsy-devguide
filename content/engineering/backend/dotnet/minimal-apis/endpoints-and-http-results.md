---
title: Endpoints and HTTP Results
description: Thin endpoint responsibility, OpenAPI metadata and result translation.
type: profile
audience: People implementing Minimal APIs.
canonical: true
canonicalSource: /engineering/backend/api/http-api-design
---

# Endpoints and HTTP Results

An endpoint parses the contract, invokes the use case and translates its result to HTTP. It does not concentrate business rules or persistence details.

- Use action-oriented file names such as `CreateShoppingCartEndpoint.cs`.
- Declare `.WithSummary()`, `.WithDescription()` and `.Produces<>()` consistent with the contract.
- Map application codes to HTTP status and RFC 9457 Problem Details.
- Sanitize unexpected errors and keep correlation for observability.

Canonical semantics belong to [HTTP API Design](/engineering/backend/api/http-api-design); failure taxonomy belongs to [Error Handling](/engineering/backend/reliability/error-handling).
