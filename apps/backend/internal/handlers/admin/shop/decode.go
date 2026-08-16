package shop

import (
	"encoding/json"
	"net/http"
)

func decodeJSON(r *http.Request, dst interface{}) error {
	return json.NewDecoder(r.Body).Decode(dst)
}
