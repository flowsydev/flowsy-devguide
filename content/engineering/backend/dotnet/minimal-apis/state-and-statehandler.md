---
title: State and StateHandler
description: VSA profile for complex commands with decision state and orchestrated persistence.
type: profile
audience: People implementing complex mutations in C#.
canonical: true
canonicalSource: /foundations/domain-modeling/dynamic-consistency-boundaries
---

# State and StateHandler

Use `State` to represent the data and behavior required by a complex command. Use `StateHandler` to load and save that state inside a consistency boundary. Do not make them a requirement for every mutation.

| Piece | Responsibility |
| --- | --- |
| Command | Intention and input data. |
| State | Decision data and behavior invariants. |
| StateHandler | Load, tracking, persistence and concurrency. |
| Command Handler | Use-case orchestration. |

Keep the same session or transaction active during load, mutation and save when the technology requires it. DCB is the conceptual approach; these classes are one implementation option. See the [broad Minimal APIs reference](./minimal-apis-reference#state-and-statehandler) for detailed examples.
