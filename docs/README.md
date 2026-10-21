# react-native-navigation docs

The documentation website, built with Next.js (App Router). It is a standalone
npm project, separate from the library's yarn workspace.

```sh
cd docs
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
```

- `app/` — routes: `/` (Home) and `/docs/[slug]`
- `content/nav.ts` — sidebar sections, page titles and order
- `content/pages/` — one file per doc page
- `components/` — navbar, sidebar, theme toggle, code blocks (Shiki) and doc building blocks

To add a page: create `content/pages/<slug>.tsx`, register it in
`content/pages/index.ts`, and list it in `content/nav.ts`.
