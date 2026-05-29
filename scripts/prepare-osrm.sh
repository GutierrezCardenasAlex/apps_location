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
OSRM_DATA_DIR="${OSRM_DATA_DIR:-osrm/data}"
OSRM_IMAGE="${OSRM_IMAGE:-osrm/osrm-backend:latest}"
OSRM_ALGORITHM="${OSRM_ALGORITHM:-mld}"
OSRM_BASE_NAME="${OSM_FILE%.osm.pbf}"
OSRM_CONTAINER_PBF="/data/${OSM_FILE}"
OSRM_CONTAINER_BASE="/data/${OSRM_BASE_NAME}.osrm"

if [ ! -f "$OSM_SOURCE" ]; then
  echo "Error: no existe ${OSM_SOURCE}"
  echo "Ejecuta primero: ./scripts/download-osm.sh"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker no esta instalado o no esta disponible en PATH."
  exit 1
fi

mkdir -p "$OSRM_DATA_DIR"
cp "$OSM_SOURCE" "${OSRM_DATA_DIR}/${OSM_FILE}"

echo "Preparando datos OSRM con perfil car.lua..."
echo "Imagen: ${OSRM_IMAGE}"
echo "Algoritmo: ${OSRM_ALGORITHM}"

docker run --rm -t -v "${ROOT_DIR}/${OSRM_DATA_DIR}:/data" "$OSRM_IMAGE" \
  osrm-extract -p /opt/car.lua "$OSRM_CONTAINER_PBF"

case "$OSRM_ALGORITHM" in
  mld)
    docker run --rm -t -v "${ROOT_DIR}/${OSRM_DATA_DIR}:/data" "$OSRM_IMAGE" \
      osrm-partition "$OSRM_CONTAINER_BASE"
    docker run --rm -t -v "${ROOT_DIR}/${OSRM_DATA_DIR}:/data" "$OSRM_IMAGE" \
      osrm-customize "$OSRM_CONTAINER_BASE"
    ;;
  ch)
    docker run --rm -t -v "${ROOT_DIR}/${OSRM_DATA_DIR}:/data" "$OSRM_IMAGE" \
      osrm-contract "$OSRM_CONTAINER_BASE"
    ;;
  *)
    echo "Error: OSRM_ALGORITHM debe ser 'mld' o 'ch'. Valor actual: ${OSRM_ALGORITHM}"
    exit 1
    ;;
esac

echo "OSRM listo en ${OSRM_DATA_DIR}:"
ls -lh "$OSRM_DATA_DIR" | grep "${OSRM_BASE_NAME}" || true
echo "Archivo principal: ${OSRM_DATA_DIR}/${OSRM_BASE_NAME}.osrm"
