## MODIFIED Requirements

### Requirement: Caddy reverse proxy
The compose stack SHALL include Caddy once frontend apps exist. Caddy SHALL reverse-proxy `api.` to the server and serve the static admin, app, and landing builds. Subdomains SHALL be `api.`, `admin.`, `app.`, and the root domain for landing. Caddy SHALL obtain automatic HTTPS in production.

#### Scenario: Hostnames
- **WHEN** an operator runs compose with Caddy enabled
- **THEN** HTTP to the documented hostnames reaches the API and frontends
