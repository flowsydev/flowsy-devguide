# Technical Debt from the Documentation Architecture

## TD-001 — Review Mermaid `manualChunks`

### Context

The VitePress build completes successfully, but Rollup warns about cycles among the manual chunks `dagre`, `mermaid-core`, `mermaid-parser` and `cytoscape`.

### Future Scope

- evaluate whether to remove or simplify `manualChunks`;
- measure bundle size and load before and after;
- verify Mermaid diagrams in build and client-side navigation;
- keep the change outside the documentation migration so content architecture and bundling optimization stay separate.

### Status

Non-blocking. The warning predates the migration and does not prevent `npm run docs:build`.
