# Build from monorepo root so the shared Go library is accessible.
# docker build context must be the repo root:
#   docker build -f apps/backend/Dockerfile -t gympulse-backend .

FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy the Go workspace descriptor first so Docker can cache the layer.
COPY go.work go.work.sum ./

# Copy module manifests for both modules.
COPY apps/backend/go.mod apps/backend/go.sum ./apps/backend/
COPY services/go-shared/go.mod services/go-shared/go.sum ./services/go-shared/

# Download dependencies.
RUN go work sync

# Copy full source.
COPY apps/backend/ ./apps/backend/
COPY services/go-shared/ ./services/go-shared/

# Build the binary.
RUN CGO_ENABLED=0 GOOS=linux \
    go build -C apps/backend -a -installsuffix cgo -o /bin/api ./cmd/api/...

# ─── Minimal runtime image ────────────────────────────────────────────────────
FROM alpine:3.19

RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /bin/api /app/api

EXPOSE 8080

ENTRYPOINT ["/app/api"]
