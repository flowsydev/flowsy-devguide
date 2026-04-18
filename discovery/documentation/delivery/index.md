---
layout: section-home

hero:
  name: "Delivery"
  text: "Clear backlog and decomposed work"
  tagline: Artifacts to organize value increments, prioritize the backlog and land the team's work into executable units.
  actions:
    - theme: brand
      text: View Epic
      link: /discovery/documentation/delivery/templates/epic
    - theme: alt
      text: View PBI
      link: /discovery/documentation/delivery/templates/pbi
    - theme: alt
      text: View Task
      link: /discovery/documentation/delivery/templates/task

features:
  - icon: 🗺️
    title: Epic
    details: Large block of work that groups multiple PBIs under a common objective.
    link: /discovery/documentation/delivery/templates/epic
  - icon: 📌
    title: PBI / User Story
    details: Minimum prioritizable unit of the backlog, functional or technical, oriented to delivering value.
    link: /discovery/documentation/delivery/templates/pbi
  - icon: 🛠️
    title: Task
    details: Concrete and executable work to implement a PBI within the team's flow.
    link: /discovery/documentation/delivery/templates/task
---

# Delivery / Planning

Artifacts to organize the work that will be built, prioritize it and decompose it for the team.

## Purpose

Answer the questions:

- What large block of work are we going to deliver?
- What functional increment enters the backlog?
- What concrete work must the team execute?

## Artifacts

| Artifact | Description | Value | When to use | When to omit |
| --- | --- | --- | --- | --- |
| **Epic** | Large block of work decomposable into multiple backlog items | Groups related PBIs under a common delivery objective | Requires multiple PBIs, multiple sprints or multiple teams | The work fits in a single PBI |
| **PBI / User Story** | Minimum prioritizable unit of the backlog. PBI is the umbrella term; User Story is a subtype when the item expresses value from an actor's perspective | Enables prioritizing, estimating and delivering value increments | Work must be prioritized and enter the team's flow | The topic is not yet deliverable |
| **Task** | Concrete work to implement a PBI, sized on a daily scale | Enables assigning, estimating and coordinating execution | The PBI needs to be decomposed into implementation units | The team works without explicit decomposition and the PBI is small |

::: tip Feature as an optional level
Feature is a useful intermediate level in some contexts or tools (Azure Boards, SAFe), but it is not mandatory. Use it only if it genuinely helps organize the backlog between Epic and PBI.
:::

::: tip PBI vs. User Story
Not every PBI needs to be written as a user story. Bugs, technical debt, automation and architectural work are better expressed as technical PBIs, without forcing the "as a user..." narrative.
:::

## Templates

- [Epic](./templates/epic) — Template for documenting an epic.
- [PBI / User Story](./templates/pbi) — Template for documenting a PBI or user story.
- [Task](./templates/task) — Template for documenting a task.

## Collaboration Tools

- **Jira**: Epic → Story / Task / Bug → Subtask. Configurable hierarchy.
- **Azure Boards**: Epic → Feature → User Story / PBI → Task. Portfolio and team levels.

## References

- [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) — Product Backlog items as formal artifact; refinement as decomposition.
- [BABOK Guide (IIBA)](https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/) — Product backlog as a set of prioritized user stories, requirements or features.
- [Atlassian — Epics, Stories and Initiatives](https://www.atlassian.com/agile/project-management/epics-stories-themes) — Initiative, epic, story as a working convention, not a universal ontology.
- [Azure Boards (Microsoft)](https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/define-features-epics) — Separation of portfolio work and team work.
