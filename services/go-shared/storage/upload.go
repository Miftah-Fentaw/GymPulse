// Package storage provides reusable file-upload helpers for Supabase Storage.
// Any Go service that needs to upload user content imports this package.
package storage

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
	"gympulse/shared/supabase"
)

// AllowedImages is the set of MIME types accepted for image uploads.
var AllowedImages = []string{"image/jpeg", "image/png", "image/gif", "image/webp"}

// AllowedVideos is the set of MIME types accepted for video uploads.
var AllowedVideos = []string{"video/mp4", "video/webm", "video/mpeg", "video/quicktime"}

// Result holds the outcome of a single file upload.
type Result struct {
	URL       string `json:"url"`
	MimeType  string `json:"mime_type"`
	SizeBytes int    `json:"size_bytes"`
	FileName  string `json:"file_name"`
}

// Uploader wraps a Supabase client for file uploads.
type Uploader struct {
	sb     *supabase.Client
	bucket string
	prefix string // storage key prefix, e.g. "products" or "sport-content"
}

// New creates an Uploader.
func New(sb *supabase.Client, bucket, prefix string) *Uploader {
	return &Uploader{sb: sb, bucket: bucket, prefix: prefix}
}

// UploadFile reads a multipart file header, validates its MIME type against
// allowed, uploads to Supabase Storage, and returns the public URL.
func (u *Uploader) UploadFile(fh *multipart.FileHeader, allowed []string) (Result, error) {
	file, err := fh.Open()
	if err != nil {
		return Result{}, fmt.Errorf("open file: %w", err)
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return Result{}, fmt.Errorf("read file: %w", err)
	}

	mime := fh.Header.Get("Content-Type")
	if mime == "" {
		mime = http.DetectContentType(data)
	}

	if !MimeAllowed(mime, allowed) {
		return Result{}, fmt.Errorf("file type %q is not allowed", mime)
	}

	ext := filepath.Ext(fh.Filename)
	if ext == "" {
		ext = MimeToExt(mime)
	}

	key := fmt.Sprintf("%s/%s%s", u.prefix, uuid.New().String(), ext)
	publicURL, err := u.sb.Upload(u.bucket, key, data, mime)
	if err != nil {
		return Result{}, fmt.Errorf("storage upload: %w", err)
	}

	return Result{
		URL:       publicURL,
		MimeType:  mime,
		SizeBytes: len(data),
		FileName:  fh.Filename,
	}, nil
}

// UploadFromRequest parses a multipart form and uploads all files under
// fieldName, returning a slice of results.
func (u *Uploader) UploadFromRequest(r *http.Request, fieldName string, allowed []string, maxBytes int64) ([]Result, error) {
	if err := r.ParseMultipartForm(maxBytes); err != nil {
		return nil, fmt.Errorf("parse form: %w", err)
	}

	headers := r.MultipartForm.File[fieldName]
	if len(headers) == 0 {
		return nil, fmt.Errorf("no files in field %q", fieldName)
	}

	results := make([]Result, 0, len(headers))
	for _, fh := range headers {
		res, err := u.UploadFile(fh, allowed)
		if err != nil {
			return nil, err
		}
		results = append(results, res)
	}
	return results, nil
}

// MimeAllowed returns true if mime is in the allowed list (case-insensitive).
func MimeAllowed(mime string, allowed []string) bool {
	for _, a := range allowed {
		if strings.EqualFold(mime, a) {
			return true
		}
	}
	return false
}

// MimeToExt maps a MIME type to a file extension.
func MimeToExt(mime string) string {
	m := map[string]string{
		"image/jpeg":      ".jpg",
		"image/png":       ".png",
		"image/gif":       ".gif",
		"image/webp":      ".webp",
		"video/mp4":       ".mp4",
		"video/webm":      ".webm",
		"video/mpeg":      ".mpeg",
		"video/quicktime": ".mov",
	}
	return m[strings.ToLower(mime)]
}
