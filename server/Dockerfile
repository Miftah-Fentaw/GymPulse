FROM golang:1.26-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /gympulse ./cmd/gympulse

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /gympulse /gympulse
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/gympulse"]
