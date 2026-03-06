# insure9ja

Frontend web app for an insurance client flow:
- marketing landing page
- guided quote/application flow for:
  - refundable life plan
  - non-refundable life plan
  - annuity

Built with React + TypeScript + Vite + Tailwind.

## Prerequisites

- Node.js `>= 20.19.0` (required by Vite 7)
- npm

This repo is pinned to Node `20.19.0` via Volta in `package.json`.

## Install

```bash
npm ci
```

## Run Locally (Dev)

```bash
npm run dev
```

Default local URL:
- `http://127.0.0.1:4173/` (if you pass explicit host/port)
- otherwise Vite will print the URL in terminal

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Troubleshooting

If `npm run dev` fails with a Node/Vite version error:

```bash
volta install node@20.19.0
volta pin node@20.19.0
node -v
```

Then reinstall deps and run again:

```bash
npm ci
npm run dev
```
