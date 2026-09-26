.PHONY: dev run test lint generate build migrate-up migrate-down migrate-status db-create admin-dev admin-build

with-env = bash -c 'set -a && [ -f "$(CURDIR)/.env" ] && . "$(CURDIR)/.env"; set +a && $(1)'

generate:
	cd server && go tool oapi-codegen -config oapi-codegen.yaml ../openapi.yaml
	cd packages/api-client && pnpm install && pnpm run generate

lint:
	cd server && go tool golangci-lint run ./...

test:
	$(call with-env,cd "$(CURDIR)/server" && go test ./...)

build:
	cd server && go build -o bin/gympulse ./cmd/gympulse

dev:
	$(call with-env,cd "$(CURDIR)/server" && go run ./cmd/gympulse)

admin-dev:
	cd admin && pnpm run dev

admin-build:
	cd admin && pnpm run build

run: build
	$(call with-env,"$(CURDIR)/server/bin/gympulse")

migrate-up:
	$(call with-env,cd "$(CURDIR)/server" && go run ./cmd/gympulse migrate up)

migrate-down:
	$(call with-env,cd "$(CURDIR)/server" && go run ./cmd/gympulse migrate down)

migrate-status:
	$(call with-env,cd "$(CURDIR)/server" && go run ./cmd/gympulse migrate status)

db-create:
	$(call with-env,cd "$(CURDIR)/server" && go run ./cmd/gympulse db create)
