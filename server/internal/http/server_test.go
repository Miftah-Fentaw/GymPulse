package httpserver

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"gympulse-server/internal/db"
	"gympulse-server/internal/testutil"
)

func testLogger(buf *bytes.Buffer) *slog.Logger {
	return slog.New(slog.NewJSONHandler(buf, nil))
}

func closeBody(t *testing.T, c io.Closer) {
	t.Helper()
	if err := c.Close(); err != nil {
		t.Errorf("close body: %v", err)
	}
}

func TestHealthWithoutDB(t *testing.T) {
	var buf bytes.Buffer
	h, err := newRouter(testLogger(&buf), &apiImpl{})
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Get(ts.URL + "/health")
	if err != nil {
		t.Fatal(err)
	}
	defer closeBody(t, resp.Body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status %d", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if !strings.Contains(string(body), `"ok"`) {
		t.Fatalf("body %s", body)
	}
}

func TestReady503WithoutPool(t *testing.T) {
	var buf bytes.Buffer
	h, err := newRouter(testLogger(&buf), &apiImpl{})
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Get(ts.URL + "/ready")
	if err != nil {
		t.Fatal(err)
	}
	defer closeBody(t, resp.Body)
	if resp.StatusCode != http.StatusServiceUnavailable {
		t.Fatalf("status %d", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	if !strings.Contains(string(body), "not_ready") {
		t.Fatalf("body %s", body)
	}
}

func TestReadyAgainstPostgres16(t *testing.T) {
	url := testutil.PostgresURL(t)
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	pool, err := db.NewPool(ctx, url)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(pool.Close)

	var buf bytes.Buffer
	h, err := newRouter(testLogger(&buf), &apiImpl{pool: pool})
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Get(ts.URL + "/ready")
	if err != nil {
		t.Fatal(err)
	}
	defer closeBody(t, resp.Body)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("status %d", resp.StatusCode)
	}
}

func TestRequestLogIncludesRequestID(t *testing.T) {
	var buf bytes.Buffer
	h, err := newRouter(testLogger(&buf), &apiImpl{})
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Get(ts.URL + "/health")
	if err != nil {
		t.Fatal(err)
	}
	closeBody(t, resp.Body)
	if resp.Header.Get("X-Request-ID") == "" {
		t.Fatal("missing X-Request-ID")
	}
	if !strings.Contains(buf.String(), `"request_id"`) {
		t.Fatalf("log missing request_id: %s", buf.String())
	}
}

func TestStartLogOmitsPassword(t *testing.T) {
	var buf bytes.Buffer
	log := testLogger(&buf)
	log.Info("database pool open")
	log.Info("listening", "addr", ":8080")
	out := buf.String()
	if strings.Contains(out, "postgres://") || strings.Contains(out, "gympulse:gympulse") {
		t.Fatalf("log leaked DSN: %s", out)
	}
	if !strings.Contains(out, "listening") || !strings.Contains(out, ":8080") {
		t.Fatalf("missing listen log: %s", out)
	}
}

func TestEchoValidationDoesNotInvokeHandler(t *testing.T) {
	var buf bytes.Buffer
	impl := &apiImpl{}
	h, err := newRouter(testLogger(&buf), impl)
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Post(ts.URL+"/v1/echo", "application/json", strings.NewReader(`{"unknown":true}`))
	if err != nil {
		t.Fatal(err)
	}
	defer closeBody(t, resp.Body)
	if resp.StatusCode < 400 || resp.StatusCode >= 500 {
		t.Fatalf("expected 4xx, got %d", resp.StatusCode)
	}
	if impl.echoCalled.Load() {
		t.Fatal("handler was invoked for invalid body")
	}
	var envelope map[string]any
	if err := json.NewDecoder(resp.Body).Decode(&envelope); err != nil {
		t.Fatal(err)
	}
	errObj, _ := envelope["error"].(map[string]any)
	if errObj == nil || errObj["code"] == nil {
		t.Fatalf("expected error envelope, got %#v", envelope)
	}
}

func TestEchoOK(t *testing.T) {
	impl := &apiImpl{}
	h, err := newRouter(testLogger(new(bytes.Buffer)), impl)
	if err != nil {
		t.Fatal(err)
	}
	ts := httptest.NewServer(h)
	t.Cleanup(ts.Close)

	resp, err := http.Post(ts.URL+"/v1/echo", "application/json", strings.NewReader(`{"message":"hi"}`))
	if err != nil {
		t.Fatal(err)
	}
	defer closeBody(t, resp.Body)
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		t.Fatalf("status %d body %s", resp.StatusCode, body)
	}
	if !impl.echoCalled.Load() {
		t.Fatal("handler was not invoked")
	}
}

func TestGracefulShutdown(t *testing.T) {
	srv, err := New("127.0.0.1:0", testLogger(new(bytes.Buffer)), nil)
	if err != nil {
		t.Fatal(err)
	}
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	errCh := make(chan error, 1)
	go func() { errCh <- srv.HTTP.Serve(ln) }()

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		t.Fatal(err)
	}
	select {
	case err := <-errCh:
		if err != nil && err != http.ErrServerClosed {
			t.Fatal(err)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("server did not shut down")
	}
}
