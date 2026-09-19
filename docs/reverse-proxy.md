# Reverse proxy

The Go server is the API process only. Serve TLS and static frontends with Caddy or nginx installed on the host. Do not run them from this repository.

Suggested hostnames: `api.<domain>` → GymPulse (`HTTP_ADDR`), `admin.<domain>` and `app.<domain>` → static builds, root domain → landing.

## Caddy example

```caddy
api.example.com {
  reverse_proxy 127.0.0.1:8080
}

admin.example.com {
  root * /var/www/gympulse/admin
  file_server
}

app.example.com {
  root * /var/www/gympulse/app
  file_server
}

example.com {
  root * /var/www/gympulse/landing
  file_server
}
```

nginx is an equivalent option. Cookie refresh assumes `admin.` and `app.` share an eTLD+1 with `api.`.
