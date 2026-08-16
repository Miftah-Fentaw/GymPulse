// Package validator provides common input validation helpers shared across
// all Go services in the GymPulse monorepo.
package validator

import (
	"regexp"
	"strings"
)

var emailRe = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// IsEmail returns true if s is a valid email address.
func IsEmail(s string) bool {
	return emailRe.MatchString(strings.TrimSpace(s))
}

// IsSlug returns true if s is a valid URL slug (lowercase, hyphens, no spaces).
func IsSlug(s string) bool {
	if s == "" {
		return false
	}
	for _, c := range s {
		if !((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '-' || c == '_') {
			return false
		}
	}
	return true
}

// NotEmpty returns true if all strings are non-empty after trimming.
func NotEmpty(fields ...string) bool {
	for _, f := range fields {
		if strings.TrimSpace(f) == "" {
			return false
		}
	}
	return true
}

// MinLength returns true if s has at least n characters.
func MinLength(s string, n int) bool {
	return len(strings.TrimSpace(s)) >= n
}

// OneOf returns true if val is one of the allowed values.
func OneOf(val string, allowed ...string) bool {
	for _, a := range allowed {
		if val == a {
			return true
		}
	}
	return false
}
