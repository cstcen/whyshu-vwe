# VWE Website Template

This package is a starter website template for integrating the VWE visual editor and renderer.

How to run

1. From the repo root, install dependencies (pnpm):

```bash
pnpm install
pnpm --filter @whyshu/website-template dev
```

2. Open `http://localhost:5174` and visit `/editor` for the integration demo.

Integration notes

- To embed the editor UI, reuse components from `packages/editor/src/components` (React).
- To render pages produced by the editor, use `packages/renderer/src/PageRenderer.tsx`.
- If your source pages are Vue (from `E:\Code\\lktop\\website\\pages`), you can:
  - Convert them to React pages for this template, or
  - Host them separately and embed via `iframe` for preview.
