// Package pagination provides helpers for PostgREST range-based pagination.
// Used by all Go services in the GymPulse monorepo.
package pagination

import (
	"fmt"
	"net/http"
	"strconv"
)

const (
	DefaultPage    = 1
	DefaultPerPage = 20
	MaxPerPage     = 100
)

// Params holds parsed pagination values.
type Params struct {
	Page    int
	PerPage int
}

// Parse reads page and per_page from query string with safe defaults.
func Parse(r *http.Request) Params {
	page := parseInt(r.URL.Query().Get("page"), DefaultPage)
	perPage := parseInt(r.URL.Query().Get("per_page"), DefaultPerPage)

	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = DefaultPerPage
	}
	if perPage > MaxPerPage {
		perPage = MaxPerPage
	}

	return Params{Page: page, PerPage: perPage}
}

// RangeHeader returns the PostgREST Range header value, e.g. "0-19".
func (p Params) RangeHeader() string {
	start := (p.Page - 1) * p.PerPage
	end := start + p.PerPage - 1
	return fmt.Sprintf("%d-%d", start, end)
}

// Offset returns the SQL offset for the current page.
func (p Params) Offset() int {
	return (p.Page - 1) * p.PerPage
}

// QueryFragment returns a PostgREST query string fragment for limit+offset.
func (p Params) QueryFragment() string {
	return fmt.Sprintf("limit=%d&offset=%d", p.PerPage, p.Offset())
}

func parseInt(s string, fallback int) int {
	if s == "" {
		return fallback
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return fallback
	}
	return v
}
