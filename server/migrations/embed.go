package migrations

import "embed"

// FS holds embedded SQL files. Goose ignores non-.sql entries such as .gitkeep.
//
//go:embed *
var FS embed.FS
