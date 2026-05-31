# Findings and Improvement Opportunities

Issues and improvement opportunities detected while adding the Backend Error Handling guide (2026-05-31).

## Vite Build Circular Chunk Warnings

`npm run docs:build` succeeds, but Vite reports circular chunk warnings involving the manual Mermaid-related chunks:

- `dagre -> mermaid-core -> dagre`
- `mermaid-core -> cytoscape -> mermaid-core`
- `mermaid-core -> mermaid-parser -> mermaid-core`
- `dagre -> mermaid-core -> mermaid-parser -> dagre`

The site renders successfully, so this is not a broken navigation issue. It is an optimization warning caused by the current `manualChunks` configuration in `.vitepress/config.ts`.

**Recommended follow-up:** Review the Mermaid chunk-splitting strategy and consider grouping Mermaid, Dagre, Cytoscape and Mermaid parser dependencies into a single chunk, or removing the specific manual split if the default Rollup output is acceptable.
