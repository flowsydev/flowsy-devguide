import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: 'Flowsy DevGuide',
  description: 'Guide for Designing and Developing Solutions',
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
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Foundations', link: '/foundations/' },
      { text: 'Documentation', link: '/documentation/' },
      { text: 'Engineering', link: '/engineering/' },
      { text: 'Quality', link: '/quality/' },
      { text: 'AI-Assisted Development', link: '/ai-assisted-development/' },
      { text: 'Conventions', link: '/conventions/' }
    ],
    sidebar: {
      '/foundations/': [
        {
          text: 'Foundations',
          items: [
            { text: 'Overview', link: '/foundations/' },
            { text: 'Ubiquitous Language', link: '/foundations/ubiquitous-language' },
            {
              text: 'Domain Discovery',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/foundations/discovery/' },
                { text: 'Design Techniques', link: '/foundations/discovery/design-techniques' },
                { text: 'Event Storming', link: '/foundations/discovery/event-storming' }
              ]
            },
            {
              text: 'Domain Modeling',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/foundations/domain-modeling/' },
                { text: 'Bounded Contexts', link: '/foundations/domain-modeling/bounded-contexts' },
                { text: 'Entities and Value Objects', link: '/foundations/domain-modeling/entities-and-value-objects' },
                { text: 'Aggregates', link: '/foundations/domain-modeling/aggregates' },
                { text: 'Dynamic Consistency Boundaries', link: '/foundations/domain-modeling/dynamic-consistency-boundaries' }
              ]
            }
          ]
        }
      ],
      '/documentation/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Overview', link: '/documentation/' },
            { text: 'Adopting the DevGuide', link: '/documentation/adopting-the-devguide' },
            { text: 'Contributing', link: '/documentation/contributing' },
            {
              text: 'Project Artifacts',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/documentation/project-artifacts/' },
                { text: 'Organization', link: '/documentation/project-artifacts/organization' },
                { text: 'Identifiers and Traceability', link: '/documentation/project-artifacts/identifiers-and-traceability' },
                { text: 'Disciplinary Layers', link: '/documentation/project-artifacts/layers/' },
                { text: 'Strategy', link: '/documentation/project-artifacts/layers/strategy/' },
                { text: 'Analysis', link: '/documentation/project-artifacts/layers/analysis/' },
                { text: 'Architecture', link: '/documentation/project-artifacts/layers/architecture/' },
                { text: 'Delivery', link: '/documentation/project-artifacts/layers/delivery/' },
                { text: 'Validation', link: '/documentation/project-artifacts/layers/validation/' }
              ]
            },
            {
              text: 'Repositories',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/documentation/repositories/' },
                { text: 'README', link: '/documentation/repositories/readme' },
                { text: 'Local Documentation', link: '/documentation/repositories/local-documentation' }
              ]
            },
            {
              text: 'Work Specs',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/documentation/work-specs/' },
                { text: 'Workflow', link: '/documentation/work-specs/workflow' },
                { text: 'Document Reference', link: '/documentation/work-specs/document-reference' }
              ]
            },
            {
              text: 'Documentation Tooling',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/documentation/tooling/' },
                { text: 'VitePress', link: '/documentation/tooling/vitepress/' },
                { text: 'Configuration', link: '/documentation/tooling/vitepress/configuration' },
                { text: 'Layouts and Navigation', link: '/documentation/tooling/vitepress/layouts-and-navigation' },
                { text: 'Deployment', link: '/documentation/tooling/vitepress/deployment' }
              ]
            }
          ]
        }
      ],
      '/engineering/': [
        {
          text: 'Engineering',
          items: [
            { text: 'Overview', link: '/engineering/' },
            {
              text: 'Cross-Cutting Topics',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/engineering/cross-cutting/' },
                { text: 'Date and Time', link: '/engineering/cross-cutting/date-and-time' },
                { text: 'Auditing and Validity', link: '/engineering/cross-cutting/auditing-and-validity' },
                { text: 'Public Identifiers', link: '/engineering/cross-cutting/identifiers' }
              ]
            },
            {
              text: 'Backend',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/engineering/backend/' },
                { text: 'Design Baseline', link: '/engineering/backend/design-baseline' },
                { text: 'Backend Architectures', link: '/engineering/backend/architecture/' },
                { text: 'Vertical Slice Architecture', link: '/engineering/backend/architecture/vertical-slice-architecture' },
                { text: 'Clean Architecture', link: '/engineering/backend/architecture/clean-architecture' },
                { text: 'HTTP API Design', link: '/engineering/backend/api/http-api-design' },
                { text: 'Reliability', link: '/engineering/backend/reliability/' },
                { text: 'Error Handling', link: '/engineering/backend/reliability/error-handling' },
                { text: 'Validation and Domain Rules', link: '/engineering/backend/reliability/validation-and-domain-rules' },
                { text: 'Transactional Consistency', link: '/engineering/backend/reliability/transactional-consistency' },
                { text: '.NET', link: '/engineering/backend/dotnet/' },
                { text: 'C#', link: '/engineering/backend/dotnet/csharp' },
                { text: 'Minimal APIs', link: '/engineering/backend/dotnet/minimal-apis/' },
                { text: 'Feature-Set Structure', link: '/engineering/backend/dotnet/minimal-apis/feature-set-structure' },
                { text: 'Endpoints and HTTP Results', link: '/engineering/backend/dotnet/minimal-apis/endpoints-and-http-results' },
                { text: 'Commands and Queries', link: '/engineering/backend/dotnet/minimal-apis/commands-and-queries' },
                { text: 'State and StateHandler', link: '/engineering/backend/dotnet/minimal-apis/state-and-statehandler' },
                { text: 'Minimal API Examples', link: '/engineering/backend/dotnet/minimal-apis/examples/' },
                { text: 'Background Services', link: '/engineering/backend/dotnet/background-services/' }
              ]
            },
            {
              text: 'Data',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/engineering/data/' },
                { text: 'Relational Modeling', link: '/engineering/data/relational-modeling' },
                { text: 'Migrations', link: '/engineering/data/migrations/' },
                { text: 'Migration Concepts', link: '/engineering/data/migrations/concepts' },
                { text: 'Tools and Strategies', link: '/engineering/data/migrations/tools-and-strategies' },
                { text: 'flwdb CLI', link: '/engineering/data/migrations/flwdb-cli' },
                { text: 'PostgreSQL', link: '/engineering/data/database-engines/postgresql' },
                { text: 'SQL Server', link: '/engineering/data/database-engines/sql-server' },
                { text: 'MySQL and MariaDB', link: '/engineering/data/database-engines/mysql-mariadb' }
              ]
            },
            {
              text: 'Messaging',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/engineering/messaging/' },
                { text: 'Event-Driven Architecture', link: '/engineering/messaging/event-driven-architecture' },
                { text: 'Reliable Delivery', link: '/engineering/messaging/reliable-delivery' },
                { text: 'Event Sourcing', link: '/engineering/messaging/event-sourcing' },
                { text: 'Kafka and Redpanda', link: '/engineering/messaging/kafka-redpanda-event-store' }
              ]
            },
            {
              text: 'Frontend',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/engineering/frontend/' },
                { text: 'Modular Architecture', link: '/engineering/frontend/modular-architecture' },
                { text: 'Vue', link: '/engineering/frontend/vue/' },
                { text: 'Vue Conventions', link: '/engineering/frontend/vue/conventions' },
                { text: 'Components', link: '/engineering/frontend/vue/components' },
                { text: 'Vue Structure', link: '/engineering/frontend/vue/structure' },
                { text: 'State and Composables', link: '/engineering/frontend/vue/state-and-composables' },
                { text: 'UI/API Contracts', link: '/engineering/frontend/vue/ui-api-contracts' },
                { text: 'Visual Design and Storybook', link: '/engineering/frontend/vue/visual-design-and-storybook' }
              ]
            },
            {
              text: 'Security',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/engineering/security/' },
                { text: 'Dependency Safety', link: '/engineering/security/dependency-safety' }
              ]
            }
          ]
        }
      ],
      '/quality/': [
        {
          text: 'Quality',
          items: [
            { text: 'Overview', link: '/quality/' },
            { text: 'Automated Testing Strategy', link: '/quality/automated-testing-strategy' },
            { text: 'Unit Tests', link: '/quality/unit-tests' },
            { text: 'Integration Tests', link: '/quality/integration-tests' },
            { text: 'End-to-End Tests', link: '/quality/end-to-end-tests' },
            { text: 'Evidence and Reporting', link: '/quality/evidence-and-reporting' },
            {
              text: 'Stacks',
              items: [
                { text: 'Overview', link: '/quality/stacks/' },
                { text: 'C#/.NET', link: '/quality/stacks/csharp-dotnet' },
                { text: 'TypeScript and Vue', link: '/quality/stacks/typescript-vue' }
              ]
            },
            {
              text: 'Systems',
              items: [
                { text: 'Overview', link: '/quality/systems/' },
                { text: 'Relational Databases', link: '/quality/systems/relational-databases' },
                { text: 'Database Migrations', link: '/quality/systems/database-migrations' },
                { text: 'Event-Driven Systems', link: '/quality/systems/event-driven-systems' }
              ]
            }
          ]
        }
      ],
      '/ai-assisted-development/': [
        {
          text: 'AI-Assisted Development',
          items: [
            { text: 'Overview', link: '/ai-assisted-development/' },
            { text: 'Best Practices', link: '/ai-assisted-development/best-practices' },
            { text: 'Agent Context Routing', link: '/ai-assisted-development/agent-routing' },
            { text: 'Context Guides', link: '/ai-assisted-development/context-guides/' },
            { text: 'Backend VSA with Minimal APIs', link: '/ai-assisted-development/context-guides/backend-vsa-minimal-api' },
            { text: 'Frontend Vue Feature-Set', link: '/ai-assisted-development/context-guides/frontend-vue-feature-set' },
            { text: 'PostgreSQL and Migrations', link: '/ai-assisted-development/context-guides/postgres-migrations' },
            { text: 'Project Documentation', link: '/ai-assisted-development/context-guides/project-documentation-artifact' },
            { text: 'Repository Agent Instructions', link: '/ai-assisted-development/context-guides/repository-agent-instructions' },
            { text: 'Specs-Driven Development', link: '/ai-assisted-development/context-guides/specs-driven-development' },
            { text: 'Platform Guidance', link: '/ai-assisted-development/platform-guidance' },
            { text: 'Official References', link: '/ai-assisted-development/official-references' }
          ]
        }
      ],
      '/conventions/': [
        {
          text: 'Conventions',
          items: [
            { text: 'Overview', link: '/conventions/' },
            { text: 'Documentation Governance', link: '/conventions/documentation-governance' },
            { text: 'Writing Guidelines', link: '/conventions/writing-guidelines' },
            { text: 'Git', link: '/conventions/source-control/git' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/flowsydev' }
    ]
  },
  mermaid: {}
})
