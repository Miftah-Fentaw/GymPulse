package middleware

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"sync"
	"time"
)

type jwkSet struct {
	Keys []jwk `json:"keys"`
}

type jwk struct {
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	Alg string `json:"alg"`
	Crv string `json:"crv"`
	X   string `json:"x"`
	Y   string `json:"y"`
	N   string `json:"n"`
	E   string `json:"e"`
}

type jwtHeader struct {
	Alg string `json:"alg"`
	Kid string `json:"kid"`
}

type jwksCache struct {
	mu      sync.Mutex
	url     string
	keys    map[string]jwk
	fetched time.Time
}

func newJWKSCache(supabaseURL string) *jwksCache {
	return &jwksCache{
		url:  strings.TrimRight(supabaseURL, "/") + "/auth/v1/.well-known/jwks.json",
		keys: map[string]jwk{},
	}
}

func parseJWTHeader(token string) (jwtHeader, error) {
	var h jwtHeader
	parts := strings.Split(token, ".")
	if len(parts) < 2 {
		return h, fmt.Errorf("malformed token")
	}
	raw, err := base64.RawURLEncoding.DecodeString(parts[0])
	if err != nil {
		return h, err
	}
	if err := json.Unmarshal(raw, &h); err != nil {
		return h, err
	}
	return h, nil
}

func (c *jwksCache) keyFor(kid string) (jwk, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if k, ok := c.keys[kid]; ok && time.Since(c.fetched) < time.Hour {
		return k, nil
	}
	if err := c.refreshLocked(); err != nil {
		if k, ok := c.keys[kid]; ok {
			return k, nil
		}
		return jwk{}, err
	}
	k, ok := c.keys[kid]
	if !ok {
		return jwk{}, fmt.Errorf("jwks: unknown kid %s", kid)
	}
	return k, nil
}

func (c *jwksCache) refreshLocked() error {
	req, err := http.NewRequest(http.MethodGet, c.url, nil)
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return fmt.Errorf("jwks fetch failed (%d)", resp.StatusCode)
	}
	var set jwkSet
	if err := json.NewDecoder(resp.Body).Decode(&set); err != nil {
		return err
	}
	next := make(map[string]jwk, len(set.Keys))
	for _, k := range set.Keys {
		if k.Kid != "" {
			next[k.Kid] = k
		}
	}
	c.keys = next
	c.fetched = time.Now()
	return nil
}

func (k jwk) ecdsaPublicKey() (*ecdsa.PublicKey, error) {
	if k.Kty != "EC" {
		return nil, fmt.Errorf("jwk is not EC")
	}
	var curve elliptic.Curve
	switch k.Crv {
	case "P-256":
		curve = elliptic.P256()
	case "P-384":
		curve = elliptic.P384()
	case "P-521":
		curve = elliptic.P521()
	default:
		return nil, fmt.Errorf("unsupported curve %s", k.Crv)
	}
	xBytes, err := base64.RawURLEncoding.DecodeString(k.X)
	if err != nil {
		return nil, err
	}
	yBytes, err := base64.RawURLEncoding.DecodeString(k.Y)
	if err != nil {
		return nil, err
	}
	return &ecdsa.PublicKey{
		Curve: curve,
		X:     new(big.Int).SetBytes(xBytes),
		Y:     new(big.Int).SetBytes(yBytes),
	}, nil
}
