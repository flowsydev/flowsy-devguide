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

- Keep the endpoint in its slice folder, beside its command or query and handler.
- Use action-oriented file names such as `CreateShoppingCartEndpoint.cs`.
- Give each `[ActionName]Endpoint` class its own `Map(RouteGroupBuilder)` method for route registration. Avoid a feature-set route aggregator.
- Prefer typed results when they clarify possible responses; use `Results<T1, TN>` when an endpoint has several known response shapes.
- Configure Problem Details through ASP.NET Core services and middleware.
- Use a global exception handler to map domain and application errors without repeating that mapping in every endpoint.
- Declare `.WithSummary()`, `.WithDescription()` and `.Produces<>()` consistent with the contract.
- Map application codes to HTTP status and RFC 9457 Problem Details.
- Sanitize unexpected errors and keep correlation for observability.
- Use integration tests to check status, content type and Problem Details shape for representative failures.

Canonical semantics belong to [HTTP API Design](/engineering/backend/api/http-api-design); failure taxonomy belongs to [Error Handling](/engineering/backend/reliability/error-handling).
