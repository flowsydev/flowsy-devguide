---
layout: section-home

hero:
  name: "Validation"
  text: "Clear conditions to accept and verify"
  tagline: Artifacts to define what it means for a change to be correct and how to verify it explicitly and repeatably.
  actions:
    - theme: brand
      text: View Criteria
      link: /discovery/documentation/layers/validation/templates/acceptance-criteria
    - theme: alt
      text: View GWT
      link: /discovery/documentation/layers/validation/templates/gwt-scenario
    - theme: alt
      text: View Test Cases
      link: /discovery/documentation/layers/validation/templates/test-case

features:
  - icon: ✅
    title: Acceptance Criteria
    details: Specific conditions that must be met to accept a requirement or PBI.
    link: /discovery/documentation/layers/validation/templates/acceptance-criteria
  - icon: 🔁
    title: GWT Scenario
    details: Given / When / Then scenarios to reduce ambiguity and favor automation.
    link: /discovery/documentation/layers/validation/templates/gwt-scenario
  - icon: 🧪
    title: Test Case
    details: Verifiable or executable validations to demonstrate coverage and expected result.
    link: /discovery/documentation/layers/validation/templates/test-case
---

# Validation / Quality

Artifacts to ensure that what was delivered meets the expected conditions and can be verified clearly.

## Purpose

Answer the questions:

- How will we know this is done correctly?
- What conditions must be met to accept a change?
- What scenarios must be tested?

## Artifacts

| Artifact | Description | Value | When to use | When to omit |
| --- | --- | --- | --- | --- |
| **Acceptance Criteria** | Conditions that must be met to consider a PBI or requirement acceptable | Clarify the success of a work item from the stakeholder's perspective | The PBI changes observable behavior or quality | Only for highly scoped internal tasks with no observable effect |
| **GWT Scenario** | Structured way of expressing verifiable scenarios with Given / When / Then | Reduces ambiguity and enables BDD automation | There is ambiguity, edge cases or the goal is to automate tests | Simple acceptance criteria bullets are sufficient |
| **Test Case** | Specification of executable or verifiable validations | Documents what must be tested and how to verify the result | Formal validation evidence or coverage is needed | The verification is trivial and covered by acceptance criteria |

::: warning Acceptance Criteria vs. Definition of Done
Do not confuse: acceptance criteria are specific to a PBI or requirement. The Definition of Done is a shared team policy about the minimum quality of the increment (Scrum Guide).
:::

::: tip Logical vs. physical location
Logically, acceptance criteria and GWT scenarios belong to validation. Physically, they can be documented within the PBI file. What matters is that they exist and are verifiable.
:::

## Templates

- [Acceptance Criteria](./templates/acceptance-criteria) — Template for documenting acceptance criteria.
- [GWT Scenario](./templates/gwt-scenario) — Template for documenting Given / When / Then scenarios.
- [Test Case](./templates/test-case) — Template for documenting a test case.

## Collaboration Tools

- **Jira**: Acceptance criteria as issue field or in the description.
- **Azure Boards**: Test Plans and Test Cases integrated with work items.
- **Cucumber / SpecFlow**: GWT scenario automation with Gherkin.

## References

- [BABOK Guide (IIBA)](https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/) — Acceptance criteria as criteria to achieve stakeholder acceptance.
- [Agile Alliance — Given/When/Then](https://www.agilealliance.org/glossary/gwt/) — Template for acceptance tests.
- [Agile Alliance — Acceptance Testing](https://www.agilealliance.org/glossary/acceptance/) — Definition and practices of acceptance tests.
- [Atlassian — Acceptance Criteria](https://www.atlassian.com/work-management/project-management/acceptance-criteria) — Acceptance criteria to clarify success conditions of a story.
- [Gherkin Reference (Cucumber)](https://cucumber.io/docs/gherkin/reference/) — Syntax for executable specification and behavior documentation.
- [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) — Definition of Done as increment quality policy.
