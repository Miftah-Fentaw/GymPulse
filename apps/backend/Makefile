## GymPulse Backend – convenience targets

.PHONY: build run tidy test clean

build:
	go build -o ./bin/api ./cmd/api/...

run:
	go run ./cmd/api/...

tidy:
	go mod tidy

test:
	go test ./...

clean:
	rm -rf ./bin
