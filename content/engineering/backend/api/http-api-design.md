---
title: HTTP API Design
description: API maturity baseline, HTTP semantics and RFC 9457 Problem Details for Flowsy APIs.
type: guide
audience: Backend, API and architecture people.
canonical: true
---

# HTTP API Design

HTTP APIs should expose stable contracts that are easy to consume, test, document and observe. Use HTTP deliberately: model resources when they fit the domain, choose methods by protocol semantics, return meaningful status codes and describe errors with [Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457).

This guide is a baseline for APIs built with Flowsy guidance. It is not a REST certification checklist.

Use [Error Handling](/engineering/backend/reliability/error-handling) for the broader application guidance behind an API error: validation order, domain errors, infrastructure error translation, transaction boundaries, idempotency and side effects. This page focuses on the HTTP contract exposed after those decisions are made.

## Example Names and Real Artifacts

Real protocol and ecosystem artifacts in this page include HTTP methods, HTTP status codes, RFC 9457 Problem Details, RFC 9110 HTTP Semantics, OpenAPI, `application/problem+json`, JSON Pointer and ASP.NET Core Minimal API result types.

Routes, problem URIs, application `code` values and JSON member names such as `/projects/{projectId}`, `project.notFound`, `signedAt` or `scheduledDateTime` are illustrative contract examples. Adapt them to the project's resource model and ubiquitous language.

## Practical Maturity Baseline

Use the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html) as a teaching model:

| Level | Meaning | Flowsy Guidance |
| --- | --- | --- |
| 0 | Single URI or RPC-style HTTP calls | Avoid for application APIs unless there is a specific protocol reason. |
| 1 | Resources | Expected when the domain has identifiable resources, collections or lifecycle. |
| 2 | HTTP verbs and status codes | Minimum practical baseline for most HTTP APIs. |
| 3 | Hypermedia controls | Contextual and optional. Use when runtime navigation or workflow discovery creates value. |

Prefer precise language. Say `HTTP API`, `resource-oriented API` or `REST-informed API` unless the design intentionally follows REST constraints. Roy Fielding's REST architectural style remains the conceptual reference for REST: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm.

## Resource-Oriented Design

Model stable domain concepts as resources when they have identity, collection behavior or lifecycle.

Good candidates:

- `GET /projects`
- `GET /projects/{projectId}`
- `POST /projects`
- `PUT /projects/{projectId}/settings`
- `POST /projects/{projectId}/releases`

Avoid action-heavy routes when a resource-oriented model is clearer:

| Instead Of | Prefer |
| --- | --- |
| `POST /createProject` | `POST /projects` |
| `POST /getProjectDetails` | `GET /projects/{projectId}` |
| `POST /publishRelease` | `POST /projects/{projectId}/releases` |
| `POST /cancelSubscription` | `DELETE /subscriptions/{subscriptionId}` or `POST /subscriptions/{subscriptionId}/cancellations` |

Commands that do not map cleanly to simple CRUD can still be modeled as resources. For example, a long-running import can be created as `POST /imports`, then tracked with `GET /imports/{importId}`.

## HTTP Methods

Use method semantics from [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110), not framework habit.

| Method | Use For | Notes |
| --- | --- | --- |
| `GET` | Retrieve a representation. | Safe. Do not change server state intentionally. |
| `POST` | Create subordinate resources, submit commands or start processing. | Not inherently idempotent. |
| `PUT` | Replace or create a known resource representation. | Idempotent when implemented correctly. |
| `PATCH` | Apply a partial update. | Define the patch format explicitly. |
| `DELETE` | Remove or deactivate a resource. | Idempotent from the client's perspective. |

When a business operation is asynchronous, return `202 Accepted` and provide a way to track the operation.

## Status Codes

Return status codes that describe the protocol-level outcome before adding application-specific details.

| Status | Use When |
| --- | --- |
| `200 OK` | The request succeeded and returns a response body. |
| `201 Created` | A new resource was created and can be identified. Include `Location` when practical. |
| `202 Accepted` | Work was accepted but is not complete. |
| `204 No Content` | The request succeeded and there is no response body. |
| `400 Bad Request` | The request is malformed or structurally invalid. |
| `401 Unauthorized` | Authentication is missing or invalid. |
| `403 Forbidden` | The caller is authenticated but lacks permission. |
| `404 Not Found` | The target resource is absent or intentionally hidden. |
| `409 Conflict` | Current state conflicts with the requested operation. |
| `422 Unprocessable Content` | The request is syntactically valid but fails semantic validation, when the API distinguishes this from `400`. |
| `500 Internal Server Error` | An unexpected server failure occurred. Return sanitized details. |

Do not encode business results only in a custom `code` field while always returning `200 OK`. Clients, gateways, caches, logs and monitoring tools depend on HTTP semantics.

## Problem Details

Use RFC 9457 Problem Details for error responses. RFC 9457 is the current standard and obsoletes RFC 7807.

Return `application/problem+json` for standardized error bodies:

```json
{
  "type": "https://docs.example.org/problems/project-not-found",
  "title": "Project Not Found",
  "status": 404,
  "detail": "The requested project was not found.",
  "instance": "/projects/9f1f6e84-4b1a-4a19-9a53-fd59fbf45f9d",
  "code": "project.notFound",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00"
}
```

Use the core members consistently:

| Member | Guidance |
| --- | --- |
| `type` | Stable problem type URI. Prefer an absolute URI that can be documented. |
| `title` | Short summary of the problem type. It should not vary per occurrence except for localization. |
| `status` | HTTP status code. When present, it must match the response status. |
| `detail` | Human-readable occurrence detail. Do not require clients to parse it. |
| `instance` | URI reference for this specific occurrence, often the request path or support reference. |

Use extension members for structured application data. Keep them stable once clients depend on them.

Prefer a top-level `code` extension when clients need to make application-level decisions independent of localized or human-readable text. The value should be stable, documented and specific enough to branch on without parsing `detail`.

Do not use `code` to replace HTTP status codes. Use both:

- `status` communicates the protocol outcome.
- `code` communicates the application problem category.

## Validation Errors

Represent validation failures with Problem Details plus an `errors` extension array:

```json
{
  "type": "https://docs.example.org/problems/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The request contains invalid values.",
  "instance": "/projects",
  "code": "validation.failed",
  "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00",
  "errors": [
    {
      "detail": "Name is required.",
      "pointer": "/name",
      "code": "project.name.required"
    }
  ]
}
```

Use the top-level `code` for the overall validation failure. Use item-level `code` values when clients need to react to specific invalid members. Otherwise, do not invent codes for every message.

Use `pointer` as a JSON Pointer to the invalid request member when possible.

## Traceability and Security

Include `traceId` when it maps to diagnostics that operators can search. Add `correlationId` or `requestId` only when the project actually logs and propagates those values.

Never expose:

- stack traces;
- SQL, connection strings or infrastructure names;
- secret values or tokens;
- authorization policy internals;
- personal data that is not necessary for the client to fix the request.

Log sensitive operational detail server-side and return a sanitized Problem Details response to clients.

## OpenAPI Documentation

Document successful and known error responses in OpenAPI. Use reusable response or schema components for `application/problem+json` when the tooling supports them.

Do not rely on OpenAPI links as a substitute for runtime hypermedia controls. OpenAPI describes the contract; Richardson Level 3 hypermedia changes what the API returns to clients at runtime.

## Date and Time Contracts

For normative temporal policy, prefer [Date and Time](/engineering/cross-cutting/date-and-time).

Document the meaning of every temporal field in the API contract. Persistence strategy and API transfer format are separate decisions. A database can store canonical system time internally, but an API must still tell clients whether a field is:

- a global instant;
- a local date/time;
- a date only;
- a time only;
- a duration.

Expose global instants as ISO 8601 strings with `Z` or an explicit offset:

```json
{
  "signedAt": "2026-07-01T16:00:00Z",
  "confirmedAt": "2026-07-01T10:00:00-06:00"
}
```

Do not expose technical timestamps without offset, such as `2026-07-01T10:00:00`, when they represent exact instants.

If the project persists internal values in a canonical system time zone, convert exact instants at the boundary instead of leaking offset-less storage values:

```json
{
  "createdAt": "2026-07-02T16:30:00Z",
  "createdAtTimeZoneId": "America/Mexico_City"
}
```

Only include the time-zone identifier for technical timestamps when clients need to understand the reference zone used by the business or audit process. Do not make clients guess that an offset-less value came from a database default zone.

For local business appointments or schedules, model the local value and the time-zone identifier explicitly:

```json
{
  "scheduledDateTime": "2026-07-01T10:00:00",
  "timeZoneId": "America/Mexico_City"
}
```

Do not rely on the frontend to guess the right time zone, and do not let the backend silently interpret offset-less strings as server-local time. APIs should also avoid trusting client-provided "current time" values for audit, ordering, expiration or validation rules. Resolve current time on the backend through the application's authoritative clock or trusted server-side source.

## C# Minimal API Notes

For ASP.NET Core Minimal APIs:

- prefer typed results when they make endpoint outcomes explicit;
- use `Results<T1, TN>` when an endpoint has multiple known response shapes;
- configure Problem Details through ASP.NET Core services and middleware;
- use a global exception handler to map domain and application exceptions to Problem Details;
- keep endpoint handlers thin and avoid repeating domain-error mapping in every endpoint;
- validate status code, content type and Problem Details shape in integration tests for representative failure paths.

See [C# with Minimal APIs](/engineering/backend/dotnet/minimal-apis/) for implementation examples.

## References

- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [REST Architectural Style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html)
- [ASP.NET Core Error Handling for Web APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api)
- [ASP.NET Core Minimal API Responses](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/responses)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest)
