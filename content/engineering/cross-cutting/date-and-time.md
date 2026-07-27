---
title: Date and Time
description: Canonical policy for instants, civil dates, time zones and test clocks.
type: guide
audience: Backend, frontend, data, integration and quality people.
canonical: true
---

# Date and Time

Treat date and time values as domain concepts, not as interchangeable strings or timestamps. Model according to business meaning; do not use one type for every temporal concept.

| Concept | Expected Representation |
| --- | --- |
| Global instant | Value with offset or unambiguous UTC. |
| Civil date | Date without time or zone. |
| Local time | Time of day without converting it into an instant. |
| Future event in a region | Local date/time plus an IANA zone identifier. |
| Duration | Interval type or explicit unit. |

## Mental Model

- "Did this already happen?" Use a global instant.
- "Must this happen at a local civil time?" Store local date/time plus an explicit time-zone identifier.
- "Is this only a date?" Use a date-only type.
- "Is this only a time of day?" Use a time-only type.
- "Is this elapsed time?" Use a duration type.

Do not treat offsets and time zones as equivalent. `-06:00` is only a UTC offset for one moment; `America/Mexico_City` is a time-zone identifier with rules.

## Persistence Strategies

Choose one temporal persistence strategy per project, bounded context or database boundary and document it before implementation:

| Strategy | Use When |
| --- | --- |
| UTC Instant | Audit trails, events, outbox rows, exact expirations and distributed integrations. |
| Canonical System Time Zone | The system is operationally single-zone and users reason in one official zone. |
| Per-Entity Time Zone | Schedules, facilities, branches or future local rules can belong to different zones. |
| Offset-Preserving | The original offset is evidence or must be preserved from an external source. |
| Date-Only, Time-Only or Duration | Birth dates, business dates, opening hours, SLAs and elapsed time. |

These strategies can coexist, but not silently inside the same column.

## Rules

- Persist normalized instants and keep the offset when it has legal or operational value.
- Do not use the server zone as a business rule.
- Convert for presentation at the UI or report boundary.
- Inject a clock in code that decides expiration, validity or windows; tests control that clock.
- Prefer resolving "now" on the server side instead of trusting workstation, browser or mobile clocks.
- Name business dates by meaning, such as `validFrom`, not by generic details.

Each engine or stack should map only types and functions that respect this policy. See [Relational Modeling](/engineering/data/relational-modeling), [HTTP API Design](/engineering/backend/api/http-api-design), [C#](/engineering/backend/dotnet/csharp) and [Vue Conventions](/engineering/frontend/vue/conventions) for local application.
