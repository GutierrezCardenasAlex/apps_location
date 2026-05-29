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

DOMAIN="${DOMAIN:-maps.cybernovatech.space}"
SSL_EMAIL="${SSL_EMAIL:-admin@cybernovatech.space}"
CERT_DIR="certbot/conf/live/${DOMAIN}"

echo "Configurando SSL para ${DOMAIN}..."
echo "Correo Let's Encrypt: ${SSL_EMAIL}"

mkdir -p certbot/www certbot/conf

echo "Activando Nginx temporal HTTP para validacion ACME..."
cp nginx/http.conf nginx/default.conf
docker compose up -d nginx

echo "Solicitando certificado Let's Encrypt..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$SSL_EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  -d "$DOMAIN"

if [ ! -f "${CERT_DIR}/fullchain.pem" ]; then
  echo "Error: no se encontro el certificado en ${CERT_DIR}/fullchain.pem"
  exit 1
fi

echo "Activando configuracion HTTPS..."
cp nginx/ssl.conf nginx/default.conf
docker compose up -d nginx

echo "SSL listo. Prueba con:"
echo "curl https://${DOMAIN}/api/health"
