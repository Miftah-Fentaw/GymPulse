package leads

import (
	"errors"
	"net"
	"strings"
	"sync"
	"time"
)

type Captcha interface{ Verify(token, ip string) error }
type Limiter struct {
	mu     sync.Mutex
	max    int
	window time.Duration
	hits   map[string][]time.Time
}

func NewLimiter(max int, window time.Duration) *Limiter {
	return &Limiter{max: max, window: window, hits: map[string][]time.Time{}}
}
func (l *Limiter) Allow(ip string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	h := l.hits[ip]
	cutoff := now.Add(-l.window)
	n := 0
	for _, t := range h {
		if t.After(cutoff) {
			h[n] = t
			n++
		}
	}
	h = h[:n]
	if len(h) >= l.max {
		l.hits[ip] = h
		return false
	}
	l.hits[ip] = append(h, now)
	return true
}
func Validate(name, email, phone, message, honeypot string) error {
	if strings.TrimSpace(honeypot) != "" {
		return nil
	}
	if len([]byte(name)) < 1 || len([]byte(name)) > 200 {
		return errors.New("invalid name")
	}
	if len([]byte(email)) > 320 || len([]byte(phone)) > 50 || len([]byte(message)) > 5000 {
		return errors.New("lead field too large")
	}
	if strings.TrimSpace(email) == "" && strings.TrimSpace(phone) == "" {
		return errors.New("email or phone is required")
	}
	return nil
}
func ClientIP(remote string) string {
	host, _, err := net.SplitHostPort(remote)
	if err == nil {
		return host
	}
	return remote
}
