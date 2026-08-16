// Package response provides standardised JSON response helpers shared
// across all Go services in the GymPulse monorepo.
package response

import (
	"encoding/json"
	"net/http"
)

type envelope struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

func JSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func OK(w http.ResponseWriter, data interface{}) {
	JSON(w, http.StatusOK, envelope{Success: true, Data: data})
}

func Created(w http.ResponseWriter, data interface{}) {
	JSON(w, http.StatusCreated, envelope{Success: true, Data: data})
}

func NoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}

func BadRequest(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusBadRequest, envelope{Success: false, Error: msg})
}

func Unauthorized(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusUnauthorized, envelope{Success: false, Error: msg})
}

func Forbidden(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusForbidden, envelope{Success: false, Error: msg})
}

func NotFound(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusNotFound, envelope{Success: false, Error: msg})
}

func Conflict(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusConflict, envelope{Success: false, Error: msg})
}

func InternalError(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusInternalServerError, envelope{Success: false, Error: msg})
}

func Message(w http.ResponseWriter, msg string) {
	JSON(w, http.StatusOK, envelope{Success: true, Message: msg})
}
