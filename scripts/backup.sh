#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f ".env" ]; then
  set -a
  # shellcheck disable=SC1091
  . ".env"
  set +a
fi

BACKUP_DIR="${BACKUP_DIR:-backups}"
POSTGRES_DB="${POSTGRES_DB:-maps}"
POSTGRES_USER="${POSTGRES_USER:-maps}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/${POSTGRES_DB}-${TIMESTAMP}.dump"

mkdir -p "$BACKUP_DIR"

echo "Creando backup de PostgreSQL en ${BACKUP_FILE}..."
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB" > "$BACKUP_FILE"

echo "Backup creado:"
ls -lh "$BACKUP_FILE"
