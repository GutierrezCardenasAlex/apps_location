#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Corrigiendo permisos de TileServer GL..."

mkdir -p maps/mbtiles maps/styles/basic-preview
chmod -R a+rwX maps/mbtiles

if [ "$(id -u)" -eq 0 ] && [ -n "${SUDO_USER:-}" ]; then
  chown -R "$SUDO_USER:$SUDO_USER" maps/mbtiles || true
fi

echo "Estado actual:"
ls -lah maps/mbtiles

echo "Listo."
