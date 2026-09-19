## 1. Public API

- [ ] 1.1 Unauthenticated GET published plans and schedule; POST lead credential-free; update `openapi.yaml` and `make generate` if new — verify: curl without cookies; unpublished omitted; generate clean

## 2. Astro site

- [ ] 2.1 Astro static/hybrid with React islands, packages/api-client, i18n English catalog — verify: `pnpm --filter landing build` succeeds
- [ ] 2.2 Plans HTML contains plan names without client-only rendering — verify: curl built/SSR page includes a plan name
- [ ] 2.3 Trial form success/validation; no refresh cookie — verify: empty submit does not store; valid submit succeeds

## 3. Integration verification

- [ ] 3.1 Landing env is public API origin only — verify: `.env.example`
