#!/usr/bin/env bash
# Create or upgrade a GymPulse super_admin via the Supabase Auth Admin API.
# Usage:
#   ./scripts/create-super-admin.sh [email] [password]
# Defaults:
#   email    = admin@gympulse.app
#   password = prompted if omitted

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [ ! -f "$ROOT/.env" ]; then
  echo "Missing $ROOT/.env — copy .env.example and fill in Supabase keys." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ROOT/.env"
set +a

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
  echo "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env" >&2
  exit 1
fi

EMAIL="${1:-admin@gympulse.app}"
PASSWORD="${2:-}"

if [ -z "$PASSWORD" ]; then
  if [ -t 0 ]; then
    read -r -s -p "Password for $EMAIL: " PASSWORD
    echo
  else
    echo "Usage: $0 <email> <password>" >&2
    exit 1
  fi
fi

if [ "${#PASSWORD}" -lt 8 ]; then
  echo "Password must be at least 8 characters." >&2
  exit 1
fi

export EMAIL PASSWORD SUPABASE_URL SUPABASE_SERVICE_KEY

python3 <<'PY'
import json, os, sys, urllib.request, urllib.error

url = os.environ["SUPABASE_URL"].rstrip("/")
key = os.environ["SUPABASE_SERVICE_KEY"]
email = os.environ["EMAIL"]
password = os.environ["PASSWORD"]

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
}

def request(method, path, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            parsed = json.loads(body)
        except json.JSONDecodeError:
            parsed = {"message": body}
        print("Failed:", parsed.get("msg") or parsed.get("message") or parsed.get("error") or parsed, file=sys.stderr)
        sys.exit(1)

payload = {
    "email": email,
    "password": password,
    "email_confirm": True,
    "user_metadata": {"full_name": "Super Admin"},
    "app_metadata": {"admin_role": "super_admin", "is_admin": True},
}

print(f"Creating super_admin {email}...")
user = request("POST", "/auth/v1/admin/users", payload)

meta = user.get("app_metadata") or {}
print("OK")
print("  id:         ", user.get("id"))
print("  email:      ", user.get("email"))
print("  admin_role: ", meta.get("admin_role"))
print("  confirmed:  ", bool(user.get("email_confirmed_at")))
PY
