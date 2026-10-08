# Two Sides. One Mind.

Interactive portfolio gateway for Dulitha Kariyapperuma. This first implementation covers the brain gateway and the `/build` and `/create` entry routes.

## Run locally

Install [Bun](https://bun.sh), then run:

```sh
bun install
bun run dev
```

The preview opens at `http://localhost:3000`. Verify production output with `bun run build` and types with `bun run typecheck`.

## Brain scene

The gateway loads `public/models/brain.glb` with React Three Fiber and Drei. It detects the named left and right meshes to light the build and create sides independently. Pointer position gives the model a restrained parallax turn; the interface also works through keyboard accessible buttons if WebGL is unavailable. `BrainPlaceholder` provides a procedural fallback while the model is loading. The model URL can be changed with `VITE_BRAIN_MODEL_URL`.

To replace the model, copy a GLB to `public/models/brain.glb`. Name its hemisphere meshes with `Left` and `Right` in the object names for side-specific lighting. A single mesh also renders; the accessible HTML buttons remain the reliable hemisphere controls. The current supplied model is kept as-is and styled at runtime.

## Included routes

- `/` — full-screen brain gateway
- `/build` — software and systems introduction
- `/create` — visual storytelling introduction

The `/build` and `/create` pages are intentionally entry points. Project archives, cinematic camera transitions, enquiry handling, and backend integrations belong to later phases.

## Packages

TanStack Start and Router, React 19, Three.js, React Three Fiber, Drei, Motion, Tailwind CSS, Lucide React, TypeScript, Vite, ESLint, and Prettier.

## Environment

Copy `.env.example` to `.env` only when configuring a model URL. Backend and analytics keys listed there are reserved for future phases; never expose server secrets through `VITE_` variables.
