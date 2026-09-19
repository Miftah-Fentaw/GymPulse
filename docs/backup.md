# Database backups

GymPulse does not ship a backup container. Use native `pg_dump` on the host.

Example daily cron (keep 14 days):

```cron
15 2 * * * umask 077; . /etc/gympulse.env; mkdir -p /var/backups/gympulse; pg_dump "$DATABASE_URL" -Fc -f /var/backups/gympulse/gympulse-$(date +\%F).dump; find /var/backups/gympulse -name 'gympulse-*.dump' -mtime +14 -delete
```

## Restore

```bash
# Recreate an empty database, then:
pg_restore --clean --if-exists -d "$DATABASE_URL" /var/backups/gympulse/gympulse-YYYY-MM-DD.dump
```

Production rollback is restore from dump, not `gympulse migrate down`. `migrate down` is for local development only.
