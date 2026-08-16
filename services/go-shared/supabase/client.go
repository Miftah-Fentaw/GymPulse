// Package supabase provides a shared Supabase client and PostgREST helper
// used by all Go services in the GymPulse monorepo.
package supabase

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Client wraps Supabase Auth Admin API and PostgREST calls using the
// service-role key, which bypasses Row Level Security server-side.
type Client struct {
	URL        string
	AnonKey    string
	ServiceKey string
}

// New creates a new Supabase client.
func New(url, anonKey, serviceKey string) *Client {
	return &Client{URL: url, AnonKey: anonKey, ServiceKey: serviceKey}
}

// ─── Auth Admin API ───────────────────────────────────────────────────────────

// AuthRequest calls the Supabase Auth REST API.
// Pass userToken="" to use the service-role key, or a user JWT for user-scoped calls.
func (c *Client) AuthRequest(method, path string, payload interface{}, userToken string) (interface{}, error) {
	body, err := marshalBody(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(method, c.URL+path, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", c.AnonKey)

	if userToken != "" {
		req.Header.Set("Authorization", "Bearer "+userToken)
	} else {
		req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	}

	return c.do(req)
}

// ─── PostgREST (database) ────────────────────────────────────────────────────

// DB executes a PostgREST request against the given table/path fragment.
// path examples: "products?id=eq.abc&select=*"  or  "orders"
func (c *Client) DB(method, path string, payload interface{}) (interface{}, error) {
	body, err := marshalBody(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(method, c.URL+"/rest/v1/"+path, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Prefer", "return=representation")

	return c.do(req)
}

// ─── Storage ──────────────────────────────────────────────────────────────────

// Upload stores bytes in a Supabase Storage bucket and returns the public URL.
func (c *Client) Upload(bucket, key string, data []byte, mimeType string) (string, error) {
	url := fmt.Sprintf("%s/storage/v1/object/%s/%s", c.URL, bucket, key)

	req, err := http.NewRequest("POST", url, bytes.NewReader(data))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", mimeType)
	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		b, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("storage upload failed (%d): %s", resp.StatusCode, b)
	}

	return fmt.Sprintf("%s/storage/v1/object/public/%s/%s", c.URL, bucket, key), nil
}

// ─── helpers ─────────────────────────────────────────────────────────────────

func (c *Client) do(req *http.Request) (interface{}, error) {
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent {
		return nil, nil
	}

	var result interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		if m, ok := result.(map[string]interface{}); ok {
			for _, k := range []string{"msg", "message", "error_description", "details", "hint"} {
				if v, ok := m[k].(string); ok && v != "" {
					return nil, fmt.Errorf("%s", v)
				}
			}
		}
		return nil, fmt.Errorf("supabase error (status %d)", resp.StatusCode)
	}
	return result, nil
}

func marshalBody(payload interface{}) (io.Reader, error) {
	if payload == nil {
		return nil, nil
	}
	b, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	return bytes.NewReader(b), nil
}
