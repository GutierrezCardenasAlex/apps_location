#!/usr/bin/env bash
set -e

echo "Corrigiendo permisos..."

chmod +x scripts/*.sh

if command -v dos2unix >/dev/null 2>&1; then
  dos2unix scripts/*.sh || true
fi

if [ "$(id -u)" -eq 0 ] && [ -n "${SUDO_USER:-}" ]; then
  chown "$SUDO_USER:$SUDO_USER" scripts/*.sh || true
fi

echo "Permisos actuales:"
ls -lah scripts/

echo "Listo."
