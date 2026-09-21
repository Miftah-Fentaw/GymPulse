# GymPulse Landing

Public landing frontend for GymPulse. It is currently a Vue 3 + TypeScript + Vite application.

## Development

```bash
npm install
npm run dev
```

Public data is served by the Go API in `../server`; this project must not connect directly to PostgreSQL.

## Build and preview

```bash
npm run build
npm run preview
```

See the repository [README](../README.md) for PostgreSQL, API, and deployment setup.
