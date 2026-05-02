import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Flowsy DevGuide",
  description: "Guide for Designing and Developing Solutions",
  srcExclude: ['AGENTS.md', 'docs/iterations/**', 'specs/**'],
  themeConfig: {
    logo: {
      src: '/assets/img/flowsy-isotype-three-color.svg?v=transparent',
      alt: 'Flowsy'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'AI-Assisted Development',
        items: [
          { text: 'Overview', link: '/ai-assisted-development/' },
          { text: 'Best Practices', link: '/ai-assisted-development/best-practices' },
          { text: 'Agent Context Routing', link: '/ai-assisted-development/agent-routing' },
          { text: 'Agent Context Guides', link: '/ai-assisted-development/context-guides/' },
          { text: 'Specs-Driven Development', link: '/ai-assisted-development/specs-driven-development' },
          { text: 'Platform Guidance', link: '/ai-assisted-development/platform-guidance' },
          { text: 'Official References', link: '/ai-assisted-development/official-references' },
        ]
      },
      {
        text: 'Discovery & Design',
        items: [
          { text: 'Overview', link: '/discovery/' },
          { text: 'Design Techniques', link: '/discovery/design-techniques' },
          { text: 'Event Storming', link: '/discovery/event-storming' },
          { text: 'Domain-Driven Design', link: '/discovery/domain-driven-design' },
          { text: 'Project Documentation', link: '/discovery/documentation/' },
          { text: 'Writing Guidelines', link: '/discovery/documentation/writing-guidelines' },
        ]
      },
      {
        text: 'Technologies',
        items: [
          { text: 'Overview', link: '/technologies/' },
          {
            text: 'Testing',
            items: [
              { text: 'Start', link: '/technologies/testing/' },
              { text: 'Automated Testing Strategy', link: '/technologies/testing/automated-testing' },
              { text: 'Unit Tests', link: '/technologies/testing/unit-tests' },
              { text: 'Integration Tests', link: '/technologies/testing/integration-tests' },
              { text: 'End-to-End Tests', link: '/technologies/testing/end-to-end-tests' },
              { text: 'Evidence and Reporting', link: '/technologies/testing/evidence-and-reporting' },
            ]
          },
          {
            text: 'Backend',
            items: [
              { text: 'General Concepts', link: '/technologies/backend/concepts' },
              { text: 'HTTP API Design', link: '/technologies/backend/api-design' },
              { text: 'Vertical Slice Architecture', link: '/technologies/backend/vertical-slice-architecture/concepts' },
              { text: 'Clean Architecture', link: '/technologies/backend/clean-architecture/concepts' },
              { text: 'Event-Driven Architecture', link: '/technologies/backend/event-driven-architecture/concepts' },
              { text: 'Event Sourcing', link: '/technologies/backend/event-sourcing/concepts' },
              { text: 'Relational Databases', link: '/technologies/backend/relational-databases/concepts' },
              { text: 'Database Migrations', link: '/technologies/backend/database-migrations/concepts' },
            ]
          },
          {
            text: 'Frontend',
            items: [
              { text: 'Modular Architecture', link: '/technologies/frontend/modular-architecture/concepts' },
              { text: 'Vue Ecosystem', link: '/technologies/frontend/modular-architecture/vue-ecosystem' },
            ]
          },
        ]
      },
      {
        text: 'Conventions',
        items: [
          { text: 'Overview', link: '/conventions/' },
          { text: 'Repository Documentation', link: '/conventions/repository-documentation' },
          { text: 'C#', link: '/conventions/csharp' },
          { text: 'PostgreSQL', link: '/conventions/postgresql' },
          { text: 'SQL Server', link: '/conventions/sql-server' },
          { text: 'MySQL and MariaDB', link: '/conventions/mysql-mariadb' },
          { text: 'TypeScript', link: '/conventions/typescript' },
          { text: 'Vue', link: '/conventions/vue' },
          { text: 'Git', link: '/conventions/source-control/git' },
        ]
      },
    ],

    sidebar: [
      {
        text: 'AI-Assisted Development',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/ai-assisted-development/' },
          { text: 'Best Practices', link: '/ai-assisted-development/best-practices' },
          { text: 'Agent Context Routing', link: '/ai-assisted-development/agent-routing' },
          {
            text: 'Agent Context Guides',
            collapsed: true,
            items: [
              { text: 'Index', link: '/ai-assisted-development/context-guides/' },
              { text: 'Backend VSA with Minimal APIs', link: '/ai-assisted-development/context-guides/backend-vsa-minimal-api' },
              { text: 'Frontend Vue Feature-Set', link: '/ai-assisted-development/context-guides/frontend-vue-feature-set' },
              { text: 'PostgreSQL and Migrations', link: '/ai-assisted-development/context-guides/postgres-migrations' },
              { text: 'Project Documentation', link: '/ai-assisted-development/context-guides/project-documentation-artifact' },
              { text: 'Repository Agent Instructions', link: '/ai-assisted-development/context-guides/repository-agent-instructions' },
              { text: 'Specs-Driven Development', link: '/ai-assisted-development/context-guides/specs-driven-development' },
            ]
          },
          { text: 'Specs-Driven Development', link: '/ai-assisted-development/specs-driven-development' },
          { text: 'Platform Guidance', link: '/ai-assisted-development/platform-guidance' },
          { text: 'Official References', link: '/ai-assisted-development/official-references' },
        ]
      },
      {
        text: 'Discovery & Design',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/discovery/' },
          { text: 'Design Techniques', link: '/discovery/design-techniques' },
          { text: 'Event Storming', link: '/discovery/event-storming' },
          { text: 'Domain-Driven Design', link: '/discovery/domain-driven-design' },
          {
            text: 'Project Documentation',
            link: '/discovery/documentation/',
            items: [
              { text: 'Writing Guidelines', link: '/discovery/documentation/writing-guidelines' },
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
        text: 'Technologies',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/technologies/' },
          {
            text: 'Testing',
            collapsed: true,
            items: [
              { text: 'Start', link: '/technologies/testing/' },
              { text: 'Automated Testing Strategy', link: '/technologies/testing/automated-testing' },
              { text: 'Unit Tests', link: '/technologies/testing/unit-tests' },
              { text: 'Integration Tests', link: '/technologies/testing/integration-tests' },
              { text: 'End-to-End Tests', link: '/technologies/testing/end-to-end-tests' },
              { text: 'Evidence and Reporting', link: '/technologies/testing/evidence-and-reporting' },
              { text: 'C#/.NET', link: '/technologies/testing/csharp-dotnet' },
              { text: 'TypeScript and Vue', link: '/technologies/testing/typescript-vue' },
              { text: 'PostgreSQL', link: '/technologies/testing/postgresql' },
              { text: 'Database Migrations', link: '/technologies/testing/database-migrations' },
              { text: 'Event-Driven Systems', link: '/technologies/testing/event-driven-systems' },
            ]
          },
          {
            text: 'Backend',
            collapsed: true,
            items: [
              { text: 'General Concepts', link: '/technologies/backend/concepts' },
              { text: 'HTTP API Design', link: '/technologies/backend/api-design' },
              {
                text: 'Vertical Slice Architecture',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/vertical-slice-architecture/concepts' },
                  { text: 'C# with Minimal APIs', link: '/technologies/backend/vertical-slice-architecture/csharp-minimal-apis' },
                ]
              },
              {
                text: 'Clean Architecture',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/clean-architecture/concepts' },
                ]
              },
              {
                text: 'Event-Driven Architecture',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/event-driven-architecture/concepts' },
                  { text: 'Background Services in C#', link: '/technologies/backend/event-driven-architecture/csharp-background-services' },
                ]
              },
              {
                text: 'Event Sourcing',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/event-sourcing/concepts' },
                  { text: 'Kafka and Redpanda', link: '/technologies/backend/event-sourcing/kafka-redpanda' },
                ]
              },
              {
                text: 'Relational Databases',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/relational-databases/concepts' },
                ]
              },
              {
                text: 'Database Migrations',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/backend/database-migrations/concepts' },
                  { text: 'Tools and Strategies', link: '/technologies/backend/database-migrations/tools-and-strategies' },
                  { text: 'flwdb CLI', link: '/technologies/backend/database-migrations/cli' },
                ]
              },
            ]
          },
          {
            text: 'Frontend',
            collapsed: true,
            items: [
              {
                text: 'Modular Architecture',
                collapsed: true,
                items: [
                  { text: 'Concepts', link: '/technologies/frontend/modular-architecture/concepts' },
                  { text: 'Vue Ecosystem', link: '/technologies/frontend/modular-architecture/vue-ecosystem' },
                ]
              },
            ]
          },
        ]
      },
      {
        text: 'Conventions',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/conventions/' },
          { text: 'Repository Documentation', link: '/conventions/repository-documentation' },
          { text: 'C#', link: '/conventions/csharp' },
          { text: 'PostgreSQL', link: '/conventions/postgresql' },
          { text: 'SQL Server', link: '/conventions/sql-server' },
          { text: 'MySQL and MariaDB', link: '/conventions/mysql-mariadb' },
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
