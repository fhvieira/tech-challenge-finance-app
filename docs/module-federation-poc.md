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
http://127.0.0.1:3001/_next/static/chunks/remoteEntry.js
```

## How The Shell Consumes The Remote

The shell configures webpack Module Federation in `next.config.ts` and maps:

```txt
transactionsRemote@http://127.0.0.1:3001/_next/static/chunks/remoteEntry.js
```

The `/trasacoes` page loads the remote in a client component with `import()`.
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

## Docker

Build and run both applications together:

```bash
docker compose up --build
```

The shell is available at:

```txt
http://localhost:3000
```

The transactions remote is available at:

```txt
http://localhost:3001
```

Stop the containers:

```bash
docker compose down
```

The shell still consumes the remote entry from:

```txt
http://127.0.0.1:3001/_next/static/chunks/remoteEntry.js
```

This Docker setup is intended for local Phase 2 validation where both ports are
published to the host machine.
