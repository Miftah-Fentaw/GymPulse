package leads

import (
	"testing"
	"time"
)

func TestLimiter(t *testing.T) {
	l := NewLimiter(2, time.Minute)
	now := time.Unix(100, 0)
	if !l.Allow("198.51.100.1", now) {
		t.Fatal("first request should be accepted")
	}
	if !l.Allow("198.51.100.1", now.Add(time.Second)) {
		t.Fatal("second request should be accepted")
	}
	if l.Allow("198.51.100.1", now) {
		t.Fatal("third request should be rejected")
	}
	if !l.Allow("198.51.100.1", now.Add(time.Minute)) {
		t.Fatal("request after window should be accepted")
	}
}

func TestValidateLead(t *testing.T) {
	if err := Validate("Jane", "jane@example.com", "", "trial", ""); err != nil {
		t.Fatalf("valid lead rejected: %v", err)
	}
	if err := Validate("", "jane@example.com", "", "", ""); err == nil {
		t.Fatal("empty name should be rejected")
	}
	if err := Validate("Jane", "", "", "", ""); err == nil {
		t.Fatal("missing contact should be rejected")
	}
	if err := Validate("Jane", "jane@example.com", "", "", "filled"); err != nil {
		t.Fatalf("honeypot should be silently accepted: %v", err)
	}
}
