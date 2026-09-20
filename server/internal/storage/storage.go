package storage

import (
	"context"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"
)

type Object struct {
	Key, ContentType string
	Size             int64
}

type Store interface {
	Put(context.Context, string, io.Reader) (Object, error)
	Get(context.Context, string) (io.ReadCloser, error)
	Delete(context.Context, string) error
}

type Local struct{ Root string }

func NewLocal(root string) (*Local, error) {
	if root == "" {
		return nil, errors.New("storage root is required")
	}
	if err := os.MkdirAll(root, 0o750); err != nil {
		return nil, err
	}
	return &Local{Root: root}, nil
}
func (s *Local) path(key string) (string, error) {
	clean := filepath.Clean(key)
	if clean == "." || clean == ".." || strings.HasPrefix(clean, ".."+string(filepath.Separator)) || filepath.IsAbs(key) {
		return "", errors.New("invalid object key")
	}
	return filepath.Join(s.Root, clean), nil
}
func (s *Local) Put(ctx context.Context, key string, r io.Reader) (Object, error) {
	select { case <-ctx.Done(): return Object{}, ctx.Err(); default: }
	p, err := s.path(key); if err != nil { return Object{}, err }
	if err := os.MkdirAll(filepath.Dir(p), 0o750); err != nil { return Object{}, err }
	f, err := os.OpenFile(p, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o640); if err != nil { return Object{}, err }
	n, err := io.Copy(f, r); closeErr := f.Close(); if err != nil { return Object{}, err }; if closeErr != nil { return Object{}, closeErr }
	return Object{Key:key, Size:n}, nil
}
func (s *Local) Get(_ context.Context, key string) (io.ReadCloser, error) { p, err := s.path(key); if err != nil { return nil, err }; return os.Open(p) }
func (s *Local) Delete(_ context.Context, key string) error { p, err := s.path(key); if err != nil { return err }; return os.Remove(p) }
