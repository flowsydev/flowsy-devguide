---
title: State and StateHandler
description: VSA profile for complex commands with decision state and orchestrated persistence.
type: profile
audience: People implementing complex mutations in C#.
canonical: true
canonicalSource: /foundations/domain-modeling/dynamic-consistency-boundaries
---

# State and StateHandler

Use `State` to represent the data and behavior required by a complex command. Use a concrete `StateHandler` to load and save that state inside a consistency boundary. Both are optional. Do not create a per-state interface or make this pair a requirement for every mutation.

| Piece | Responsibility |
| --- | --- |
| Command | Intention and input data. |
| State | Decision data and behavior invariants. |
| StateHandler | Load, tracking, persistence and concurrency. |
| Command Handler | Use-case orchestration. |

When the pair belongs to one command, place both classes in `[ActionName]State.cs` inside that slice. If several commands truly share decision state, place the shared file in their closest common folder while keeping each endpoint, command and command handler inside its own slice.

The command handler opens the session or transaction and instantiates the concrete `StateHandler` with those active objects. Keep the same consistency boundary during load, mutation and save when the technology requires it. DCB is the conceptual approach; these classes are one implementation option. See the [detailed Minimal APIs reference](./minimal-apis-reference#state-and-statehandler) for examples.
