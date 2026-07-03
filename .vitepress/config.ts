import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "Flowsy DevGuide",
  description: "Guide for Designing and Developing Solutions",
  srcDir: './content',
  vite: {
    build: {
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/d3')) return 'd3'
            if (id.includes('node_modules/dagre-d3-es')) return 'dagre'
            if (id.includes('node_modules/cytoscape')) return 'cytoscape'
            if (id.includes('node_modules/@mermaid-js')) return 'mermaid-parser'
            if (id.includes('node_modules/khroma')) return 'mermaid-core'
            if (id.includes('node_modules/mermaid')) return 'mermaid-core'
            if (id.includes('node_modules/markdown-it')) return 'markdown-it'
            if (id.includes('node_modules/shiki')) return 'shiki'
          }
        }
      }
    }
  },
  themeConfig: {
    logo: {
      src: '/assets/img/flowsy-isotype-three-color.svg?v=transparent',
      alt: 'Flowsy'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'AI',
        items: [
          { text: 'Overview', link: '/ai-assisted-development/' },
          { text: 'Agent Context Guides', link: '/ai-assisted-development/context-guides/' },
        ]
      },
      {
        text: 'Discovery',
        items: [
          { text: 'Overview', link: '/discovery/' },
          { text: 'Ubiquitous Language', link: '/discovery/ubiquitous-language' },
          { text: 'Project Documentation', link: '/discovery/documentation/' },
          { text: 'Disciplinary Layers', link: '/discovery/documentation/layers/' },
          { text: 'Static Site Generators', link: '/discovery/documentation/static-site-generators/' },
        ]
      },
      {
        text: 'Tech',
        items: [
          { text: 'Overview', link: '/technologies/' },
          { text: 'Testing', link: '/technologies/testing/' },
          { text: 'Backend', link: '/technologies/backend/concepts' },
          { text: 'Frontend', link: '/technologies/frontend/' },
        ]
      },
      {
        text: 'Conventions',
        items: [
          { text: 'Overview', link: '/conventions/' },
          { text: 'Writing Guidelines', link: '/conventions/writing-guidelines' },
          { text: 'Repository Documentation', link: '/conventions/repository-documentation' },
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
          {
            text: 'Domain Discovery',
            collapsed: true,
            items: [
              { text: 'Ubiquitous Language', link: '/discovery/ubiquitous-language' },
              { text: 'Design Techniques', link: '/discovery/design-techniques' },
              { text: 'Event Storming', link: '/discovery/event-storming' },
              { text: 'Domain-Driven Design', link: '/discovery/domain-driven-design' },
            ]
          },
          {
            text: 'Project Documentation',
            link: '/discovery/documentation/',
            items: [
              {
                text: 'Disciplinary Layers',
                link: '/discovery/documentation/layers/',
                items: [
                  {
                    text: 'Strategy',
                    link: '/discovery/documentation/layers/strategy/',
                    collapsed: true,
                    items: [
                      { text: 'Theme', link: '/discovery/documentation/layers/strategy/templates/theme' },
                      { text: 'Initiative', link: '/discovery/documentation/layers/strategy/templates/initiative' },
                    ]
                  },
                  {
                    text: 'Analysis',
                    link: '/discovery/documentation/layers/analysis/',
                    collapsed: true,
                    items: [
                      { text: 'Need', link: '/discovery/documentation/layers/analysis/templates/need' },
                      { text: 'Requirement', link: '/discovery/documentation/layers/analysis/templates/requirement' },
                      { text: 'Use Case', link: '/discovery/documentation/layers/analysis/templates/use-case' },
                      { text: 'Business Rule', link: '/discovery/documentation/layers/analysis/templates/business-rule' },
                    ]
                  },
                  {
                    text: 'Architecture',
                    link: '/discovery/documentation/layers/architecture/',
                    collapsed: true,
                    items: [
                      { text: 'ADR', link: '/discovery/documentation/layers/architecture/templates/adr' },
                      { text: 'Contract', link: '/discovery/documentation/layers/architecture/templates/contract' },
                    ]
                  },
                  {
                    text: 'Delivery',
                    link: '/discovery/documentation/layers/delivery/',
                    collapsed: true,
                    items: [
                      { text: 'Epic', link: '/discovery/documentation/layers/delivery/templates/epic' },
                      { text: 'PBI / User Story', link: '/discovery/documentation/layers/delivery/templates/pbi' },
                      { text: 'Task', link: '/discovery/documentation/layers/delivery/templates/task' },
                    ]
                  },
                  {
                    text: 'Validation',
                    link: '/discovery/documentation/layers/validation/',
                    collapsed: true,
                    items: [
                      { text: 'Acceptance Criteria', link: '/discovery/documentation/layers/validation/templates/acceptance-criteria' },
                      { text: 'GWT Scenario', link: '/discovery/documentation/layers/validation/templates/gwt-scenario' },
                      { text: 'Test Case', link: '/discovery/documentation/layers/validation/templates/test-case' },
                    ]
                  },
                ]
              },
              {
                text: 'Static Site Generators',
                link: '/discovery/documentation/static-site-generators/',
                items: [
                  { text: 'VitePress', link: '/discovery/documentation/static-site-generators/vitepress' },
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
              { text: 'Relational Databases', link: '/technologies/testing/database/relational-databases' },
              { text: 'Database Migration Testing', link: '/technologies/testing/database/migrations' },
              { text: 'Event-Driven Systems', link: '/technologies/testing/event-driven-systems' },
            ]
          },
          {
            text: 'Backend',
            collapsed: true,
            items: [
              {
                text: 'General',
                collapsed: true,
                items: [
                  { text: 'General Concepts', link: '/technologies/backend/concepts' },
                  { text: 'Project Design Baseline', link: '/technologies/backend/project-design-baseline' },
                  { text: 'HTTP API Design', link: '/technologies/backend/api-design' },
                  { text: 'Error Handling', link: '/technologies/backend/error-handling' },
                ]
              },
              {
                text: 'Architecture',
                collapsed: true,
                items: [
                  { text: 'Vertical Slice Architecture', link: '/technologies/backend/vertical-slice-architecture/concepts' },
                  { text: 'Clean Architecture', link: '/technologies/backend/clean-architecture/concepts' },
                ]
              },
              {
                text: 'Events and Messaging',
                collapsed: true,
                items: [
                  { text: 'Event-Driven Architecture', link: '/technologies/backend/event-driven-architecture/concepts' },
                  { text: 'Event Sourcing', link: '/technologies/backend/event-sourcing/concepts' },
                  { text: 'Kafka and Redpanda', link: '/technologies/backend/event-sourcing/kafka-redpanda' },
                ]
              },
              {
                text: 'Data and Persistence',
                collapsed: true,
                items: [
                  { text: 'Relational Modeling', link: '/technologies/backend/data-and-migrations/relational-modeling' },
                  {
                    text: 'Migrations',
                    collapsed: true,
                    items: [
                      { text: 'Migration Concepts', link: '/technologies/backend/data-and-migrations/migration-concepts' },
                      { text: 'Tools and Strategies', link: '/technologies/backend/data-and-migrations/tools-and-strategies' },
                      { text: 'flwdb CLI', link: '/technologies/backend/data-and-migrations/cli' },
                    ]
                  },
                  {
                    text: 'Database Engines',
                    collapsed: true,
                    items: [
                      { text: 'PostgreSQL', link: '/technologies/backend/data-and-migrations/database-engines/postgresql' },
                      { text: 'SQL Server', link: '/technologies/backend/data-and-migrations/database-engines/sql-server' },
                      { text: 'MySQL and MariaDB', link: '/technologies/backend/data-and-migrations/database-engines/mysql-mariadb' },
                    ]
                  },
                ]
              },
              {
                text: '.NET',
                collapsed: true,
                items: [
                  { text: 'Lenguaje C#', link: '/technologies/backend/dotnet/csharp' },
                  { text: 'VSA with Minimal APIs', link: '/technologies/backend/dotnet/csharp-minimal-apis' },
                  { text: 'Background Services', link: '/technologies/backend/dotnet/csharp-background-services' },
                ]
              },
            ]
          },
          {
            text: 'Frontend',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/technologies/frontend/' },
              { text: 'Modular Architecture', link: '/technologies/frontend/modular-architecture' },
              {
                text: 'Vue',
                collapsed: true,
                items: [
                  { text: 'Vue 3 and TypeScript Conventions', link: '/technologies/frontend/vue/conventions' },
                  { text: 'Vue Ecosystem', link: '/technologies/frontend/vue/ecosystem' },
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
          { text: 'Writing Guidelines', link: '/conventions/writing-guidelines' },
          { text: 'Repository Documentation', link: '/conventions/repository-documentation' },
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
