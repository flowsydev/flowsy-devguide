import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Flowsy DevGuide",
  description: "Guide for Designing and Developing Solutions",
  srcExclude: ['docs/iterations/**'],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Discovery', link: '/discovery/' },
      { text: 'Technologies', link: '/technologies/' },
      { text: 'Conventions', link: '/conventions/' },
    ],

    sidebar: [
      {
        text: 'Technologies',
        items: [
          { text: 'Overview', link: '/technologies/' },
        ]
      },
      {
        text: 'Discovery',
        items: [
          { text: 'Design Techniques', link: '/discovery/design-techniques' },
          { text: 'Event Storming', link: '/discovery/event-storming' },
          { text: 'Domain-Driven Design', link: '/discovery/domain-driven-design' },
          {
            text: 'Project Documentation',
            link: '/discovery/documentation/',
            items: [
              {
                text: 'Strategy',
                link: '/discovery/documentation/strategy/',
                collapsed: true,
                items: [
                  { text: 'Theme', link: '/discovery/documentation/strategy/templates/theme' },
                  { text: 'Initiative', link: '/discovery/documentation/strategy/templates/initiative' },
                ]
              },
              {
                text: 'Analysis',
                link: '/discovery/documentation/analysis/',
                collapsed: true,
                items: [
                  { text: 'Need', link: '/discovery/documentation/analysis/templates/need' },
                  { text: 'Requirement', link: '/discovery/documentation/analysis/templates/requirement' },
                  { text: 'Use Case', link: '/discovery/documentation/analysis/templates/use-case' },
                  { text: 'Business Rule', link: '/discovery/documentation/analysis/templates/business-rule' },
                ]
              },
              {
                text: 'Architecture',
                link: '/discovery/documentation/architecture/',
                collapsed: true,
                items: [
                  { text: 'ADR', link: '/discovery/documentation/architecture/templates/adr' },
                  { text: 'Contract', link: '/discovery/documentation/architecture/templates/contract' },
                ]
              },
              {
                text: 'Delivery',
                link: '/discovery/documentation/delivery/',
                collapsed: true,
                items: [
                  { text: 'Epic', link: '/discovery/documentation/delivery/templates/epic' },
                  { text: 'PBI / User Story', link: '/discovery/documentation/delivery/templates/pbi' },
                  { text: 'Task', link: '/discovery/documentation/delivery/templates/task' },
                ]
              },
              {
                text: 'Validation',
                link: '/discovery/documentation/validation/',
                collapsed: true,
                items: [
                  { text: 'Acceptance Criteria', link: '/discovery/documentation/validation/templates/acceptance-criteria' },
                  { text: 'GWT Scenario', link: '/discovery/documentation/validation/templates/gwt-scenario' },
                  { text: 'Test Case', link: '/discovery/documentation/validation/templates/test-case' },
                ]
              },
            ]
          },
        ]
      },
      {
        text: 'Technologies — Backend',
        items: [
          { text: 'General Concepts', link: '/technologies/backend/concepts' },
          {
            text: 'Vertical Slice Architecture',
            items: [
              { text: 'Concepts', link: '/technologies/backend/vertical-slice-architecture/concepts' },
              { text: 'C# with Minimal APIs', link: '/technologies/backend/vertical-slice-architecture/csharp-minimal-apis' },
            ]
          },
          {
            text: 'Clean Architecture',
            items: [
              { text: 'Concepts', link: '/technologies/backend/clean-architecture/concepts' },
            ]
          },
          {
            text: 'Event-Driven Architecture',
            items: [
              { text: 'Concepts', link: '/technologies/backend/event-driven-architecture/concepts' },
              { text: 'Background Services in C#', link: '/technologies/backend/event-driven-architecture/csharp-background-services' },
            ]
          },
          {
            text: 'Event Sourcing',
            items: [
              { text: 'Concepts', link: '/technologies/backend/event-sourcing/concepts' },
              { text: 'Kafka and Redpanda', link: '/technologies/backend/event-sourcing/kafka-redpanda' },
            ]
          },
          {
            text: 'Relational Databases',
            items: [
              { text: 'Concepts', link: '/technologies/backend/relational-databases/concepts' },
            ]
          },
          {
            text: 'Database Migrations',
            items: [
              { text: 'Concepts', link: '/technologies/backend/database-migrations/concepts' },
              { text: 'Evolve and Flyway', link: '/technologies/backend/database-migrations/evolve-flyway' },
            ]
          },
        ]
      },
      {
        text: 'Technologies — Frontend',
        items: [
          {
            text: 'Modular Architecture',
            items: [
              { text: 'Concepts', link: '/technologies/frontend/modular-architecture/concepts' },
              { text: 'Vue Ecosystem', link: '/technologies/frontend/modular-architecture/vue-ecosystem' },
            ]
          },
        ]
      },
      {
        text: 'Conventions',
        items: [
          { text: 'C#', link: '/conventions/csharp' },
          { text: 'PostgreSQL', link: '/conventions/postgresql' },
          { text: 'TypeScript', link: '/conventions/typescript' },
          { text: 'Vue', link: '/conventions/vue' },
          { text: 'Git', link: '/conventions/source-control/git' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/flowsydev' }
    ]
  },
  mermaid: {}
})
