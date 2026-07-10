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

The remote origin is controlled by:

```txt
NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL
```

Local default:

```txt
NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL=http://127.0.0.1:3001
```

The `/trasacoes` page loads the remote in a client component with `import()`.
The shell passes `transactions`, `onDelete`, and `onUpdate` as props. The remote
does not read or write `localStorage`.

If the remote is unavailable in the browser, the shell falls back to the local
transactions implementation so the current app still works. In that case, the
page shows a small warning that the local transactions module is being used.

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

For a Docker build that points the shell at a different remote URL:

```bash
docker compose build \
  --build-arg NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL=https://your-remote.example.com
```

## Deployment Strategy

The simplest deployment target is two separate Vercel projects:

1. Deploy the transactions remote first.
   - Root directory: `transactions-remote`
   - Build command: `npm run build`
   - Framework: Next.js

2. Copy the deployed remote URL, for example:

```txt
https://transactions-remote.example.vercel.app
```

3. Deploy the shell second.
   - Root directory: project root
   - Build command: `npm run build`
   - Framework: Next.js
   - Environment variable:

```txt
NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL=https://transactions-remote.example.vercel.app
```

4. Redeploy the shell whenever the remote URL changes. The remote URL is read by
   `next.config.ts` at build time.

## Health Checks

Local shell:

```txt
http://127.0.0.1:3000
```

Local transactions route:

```txt
http://127.0.0.1:3000/trasacoes
```

Local remote entry:

```txt
http://127.0.0.1:3001/_next/static/chunks/remoteEntry.js
```

Production remote entry:

```txt
https://your-remote.example.com/_next/static/chunks/remoteEntry.js
```

## Deployment Checklist

- Run `npm run lint`.
- Run `npm run build:remote`.
- Run `npm run build`.
- Deploy the remote before the shell.
- Verify the remote entry returns `200`.
- Set `NEXT_PUBLIC_TRANSACTIONS_REMOTE_URL` in the shell deployment.
- Deploy or redeploy the shell after setting the remote URL.
- Open `/trasacoes` from the deployed shell and confirm the remote feature loads.
- If the fallback warning appears, inspect the deployed remote entry URL and
  browser network requests for missing remote chunks.
