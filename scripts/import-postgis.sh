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

OSM_DIR="${OSM_DIR:-maps/osm}"
OSM_FILE="${OSM_FILE:-bolivia-latest.osm.pbf}"
OSM_SOURCE="${OSM_DIR}/${OSM_FILE}"
POSTGRES_DB="${POSTGRES_DB:-maps}"
POSTGRES_USER="${POSTGRES_USER:-maps}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-maps_password}"
POSTGRES_HOST="${POSTGRES_HOST:-postgres}"

if [ ! -f "$OSM_SOURCE" ]; then
  echo "Error: no existe ${OSM_SOURCE}"
  echo "Ejecuta primero: ./scripts/download-osm.sh"
  exit 1
fi

echo "Importando ${OSM_SOURCE} a PostGIS..."
echo "Asegurate de que PostgreSQL este arriba: docker compose up -d postgres"

docker compose up -d postgres

docker run --rm -t --network map-server-network \
  -v "${ROOT_DIR}/${OSM_DIR}:/data" \
  -e PGPASSWORD="$POSTGRES_PASSWORD" \
  iboates/osm2pgsql:latest \
  -H "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --create --slim --hstore --latlong "/data/${OSM_FILE}"

echo "Importacion a PostGIS finalizada."
