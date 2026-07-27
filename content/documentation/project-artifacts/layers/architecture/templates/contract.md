---
title: Contract Template
description: Project documentation template for contract.
type: template
audience: Analysts, architects, developers and technical writers documenting Flowsy solutions.
canonical: true
---

# `ARC-CTR-[NNN]` [Contract Title]

## Type

- [ ] REST API
- [ ] Event / Asynchronous message
- [ ] Data schema
- [ ] Other: [specify]

## Description

Describe the purpose of the contract and the systems or services involved.

## Producers

- Service or system that produces.

## Consumers

- Service or system that consumes.

## Specification

Include the contract specification: JSON schema, OpenAPI, AsyncAPI, protobuf, etc.

```json
{
  "example": "schema"
}
```

## Policies

- Versioning: [strategy]
- Idempotence: [yes/no, how]
- Retries: [policy]

## Related Artifacts

- [`ARC-ADR-[NNN]`: ADR]
- [`ANA-REQ-[NNN]`: Requirement]
