# Module Federation POC

This Phase 2 proof of concept keeps the existing Next.js application as the
shell/container and adds a small transactions remote.

## Shell

- App: current project root
- Port: `3000`
- Command:

```bash
npm run dev
```

The shell owns routing, layout, `useTransactions`, and `localStorage`.

## Transactions Remote

- App: `transactions-remote`
- Port: `3001`
- Command:

```bash
npm run dev:remote
```

The remote exposes:

```txt
transactionsRemote/TransactionsFeature
```

Its remote entry is served from:

```txt
http://localhost:3001/_next/static/chunks/remoteEntry.js
```

## How The Shell Consumes The Remote

The shell configures webpack Module Federation in `next.config.ts` and maps:

```txt
transactionsRemote@http://localhost:3001/_next/static/chunks/remoteEntry.js
```

The `/trasacoes` page loads the remote with `next/dynamic` and `ssr: false`.
The shell passes `transactions`, `onDelete`, and `onUpdate` as props. The remote
does not read or write `localStorage`.

If the remote is unavailable in the browser, the shell falls back to the local
transactions implementation so the current app still works.

## Build Commands

```bash
npm run build:remote
npm run build
```

Both builds run in webpack mode because Module Federation is a webpack feature.
The shell build may warn that the external remote script uses `async/await`;
the build still completes successfully.
