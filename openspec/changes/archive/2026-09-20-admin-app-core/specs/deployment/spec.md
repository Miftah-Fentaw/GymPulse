## MODIFIED Requirements

### Requirement: Native reverse proxy
TLS and static frontends SHALL be served by Caddy or nginx installed on the host, or equivalent. Reverse proxy is a documented option, not a process started from this repository. The Go server MAY remain API-only.

#### Scenario: Documented hostnames
- **WHEN** an operator reads reverse-proxy docs
- **THEN** they are shown how to proxy `api.` to the Go process and serve admin, app, and landing as static files
