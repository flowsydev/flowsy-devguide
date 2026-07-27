---
title: Auditing and Validity
description: Canonical separation of technical traceability, record existence and business periods.
type: guide
audience: Domain, backend, data, compliance and quality people.
canonical: true
---

# Auditing and Validity

Do not confuse when a record changed with when a business decision is valid.

| Concept | Examples |
| --- | --- |
| Technical audit | `createdAt`, `createdBy`, `updatedAt`, `updatedBy`. |
| Existence state | Active, soft-deleted or hard-deleted. |
| Business validity | `contractValidFrom`, `contractValidUntil`. |

## Record Existence

Choose the smallest representation that still expresses domain, compliance and operational requirements:

| Alternative | English | Spanish | Use When |
| --- | --- | --- | --- |
| Boolean flag | `Active` | `Activo` | Distinguish active records from those that should not participate in normal operations. |
| Explicit status | `RecordStatus` | `EstadoRegistro` | Need more than two states, such as `Active`, `SoftDeleted` and `HardDeleted`. |

Active-period fields such as `ActiveFrom` / `ActiveUntil` apply only when analysis shows the entity must record when the record itself was active.

## Business Validity

Existence state answers whether the record participates in the system. Business validity answers whether a right, assignment, policy, price or term is currently effective.

| Alternative | English | Spanish | Use When |
| --- | --- | --- | --- |
| Boolean flag | `Valid` | `Vigente` | Distinguish currently valid items from non-valid items. |
| Explicit status | `ValidityStatus` | `EstadoVigencia` | Need states such as `Valid`, `Revoked`, `Expired` or `Suspended`. |

Name validity fields with the domain concept when a generic name would be ambiguous (`AssignmentValidFrom`, `AsignacionVigenteDesde`).

Actor fields depend on context: they may identify a person, application or process. Declare the semantics, avoid overloading flags and use [Date and Time](./date-and-time) for temporal representation.

Persistence may add columns, indexes or constraints, but it does not redefine these concepts. Complementary bilingual tables remain in the [DDD reference](/foundations/domain-modeling/domain-driven-design-reference#entity-record-status) and [Relational Modeling](/engineering/data/relational-modeling).
