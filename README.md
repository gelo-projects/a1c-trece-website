# A1C Driving Academy — Trece Martires

Fresh website project. The earlier 3D concept is not reused. This repository follows the owner's twelve-phase master brief; only **Phase 1 — Foundation** is implemented so far.

## Stack

- Vite + strict TypeScript for a static-first Cloudflare Pages build.
- Semantic native HTML/CSS; browser-native dialog and history APIs.
- Locally hosted DM Sans Variable fonts (OFL license).
- Three.js will be evaluated/added in Phase 2; no 3D engine is loaded by the foundation.
- Vitest/jsdom for preference and navigation boundaries, and Chromium browser QA.

The shell needs no running operations API, database, third-party scripts, paid services, analytics, or cookies. Preferences are saved only on the visitor's device. No student or internal operations records are read.

## Development

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Node 22 or newer. Vite uses port 4175 by default. The deployable output is `dist/`.

## Structure

- `index.html`: accessible, useful base content without JavaScript.
- `src/styles/tokens.css`: brand palette and separate light/dark surface tokens.
- `src/main.ts`: shell controls and integration.
- `src/content/branch.ts`: typed Trece identity, course names, verified links and regular hours; no guessed address, phone, map, prices, or transmission mapping.
- `src/lib/preferences.ts`: safe persistence, device preferences, automatic Lite Mode, typed preference events.
- `src/lib/router.ts`: native section navigation, browser history and focus management.
- `src/lib/scene-contract.ts`: lifecycle contract for future, lazy-loaded scenes.
- `public/media/`: only media used in the current phase.
- `reference-assets/`: unchanged owner-supplied originals for later approved phases; not shipped in the current build.
- `docs/`: provenance, approval boundaries, deployment instructions and phase results.

## Deployment policy

`main` is the reserved production branch. Phase work lives on `phase-1-foundation`. The review upload must explicitly target that preview branch. No production deployment or production workflow is authorized before Phase 12 approval.

The Cloudflare Pages preview is a view-only website, without repository access, admin controls or deployment controls. A preview URL is not an access-controlled secret: anyone who has the URL can view it. Preview output is `noindex,nofollow`.

GitHub Actions runs checks only. It has no Cloudflare token and cannot deploy production. Preview deployment can use GitHub Actions with a scoped deployment token once deliberately configured, or authenticated Direct Upload of the exact checked commit. The source remains in GitHub either way.

## Review Phase 1

1. Open the preview on a phone and a desktop.
2. Open Menu, try Light/Dark, Lite Mode and Reduce motion, then reload.
3. Navigate between sections and use browser Back.
4. Check the supplied logo and typography.

The detailed 3D intro, vehicle models, course experiences, operations integrations, PWA, analytics, SEO and legal content belong to later phases. No phase starts without the owner's explicit approval.
