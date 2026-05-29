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

OSM_URL="${OSM_URL:-https://download.geofabrik.de/south-america/bolivia-latest.osm.pbf}"
OSM_DIR="${OSM_DIR:-maps/osm}"
OSM_FILE="${OSM_FILE:-bolivia-latest.osm.pbf}"
OSM_PATH="${OSM_DIR}/${OSM_FILE}"

echo "Preparando carpeta ${OSM_DIR}..."
mkdir -p "$OSM_DIR"

if [ -f "$OSM_PATH" ]; then
  echo "El archivo ya existe: ${OSM_PATH}"
  echo "No se descargara nuevamente."
  exit 0
fi

echo "Descargando OSM desde:"
echo "$OSM_URL"
echo "Destino: ${OSM_PATH}"

if command -v curl >/dev/null 2>&1; then
  curl -L --fail --progress-bar "$OSM_URL" -o "$OSM_PATH"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$OSM_PATH" "$OSM_URL"
else
  echo "Error: instala curl o wget antes de continuar."
  exit 1
fi

echo "Descarga completada:"
ls -lh "$OSM_PATH"
