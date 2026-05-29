# map-server

Proyecto preparado para pruebas y produccion en Ubuntu Server con Docker Compose, PostgreSQL/PostGIS, OSRM, TileServer GL, backend y Nginx como punto de entrada.

## Estructura de scripts

```text
scripts/
├── backup.sh
├── download-osm.sh
├── fix-permissions.sh
├── import-postgis.sh
└── prepare-osrm.sh
```

Todos los scripts deben ejecutarse en Linux/Ubuntu con formato Unix LF y shebang:

```bash
#!/usr/bin/env bash
```

## Instalacion desde cero en Ubuntu

```bash
sudo apt update
sudo apt install unzip curl wget dos2unix -y

unzip map-server.zip
cd map-server

cp .env.example .env

chmod +x scripts/*.sh
dos2unix scripts/*.sh

./scripts/download-osm.sh
./scripts/prepare-osrm.sh

docker compose up -d --build

docker compose ps

curl http://localhost/api/health
```

## Permisos y formato de scripts

Si subiste el proyecto desde Windows o descomprimiste un `.zip`, ejecuta:

```bash
chmod +x scripts/*.sh
dos2unix scripts/*.sh
```

El archivo `.gitattributes` fuerza LF para scripts y archivos de configuracion cuando el proyecto se maneja con Git.

Tambien puedes usar:

```bash
./scripts/fix-permissions.sh
```

Ese script aplica permisos de ejecucion, convierte CRLF a LF si `dos2unix` existe y muestra el estado final con:

```bash
ls -lah scripts/
```

## Descargar OSM

Por defecto descarga Bolivia desde Geofabrik:

```text
https://download.geofabrik.de/south-america/bolivia-latest.osm.pbf
```

El archivo queda en:

```text
maps/osm/bolivia-latest.osm.pbf
```

El script no descarga de nuevo si el archivo ya existe.

```bash
./scripts/download-osm.sh
```

Puedes cambiar la URL o nombres en `.env`:

```bash
OSM_URL=https://download.geofabrik.de/south-america/bolivia-latest.osm.pbf
OSM_DIR=maps/osm
OSM_FILE=bolivia-latest.osm.pbf
```

## Preparar OSRM

Genera los archivos `.osrm` necesarios para que Docker Compose levante OSRM:

```bash
./scripts/prepare-osrm.sh
```

Por defecto usa `osrm/osrm-backend:latest`, perfil `car.lua` y algoritmo `mld`:

```bash
OSRM_ALGORITHM=mld
OSRM_FILE=bolivia-latest.osrm
```

Si quieres usar CH:

```bash
OSRM_ALGORITHM=ch
```

## Docker Compose

Nginx es el punto de entrada publico en el puerto `80`.

Dominio configurado:

```text
maps.cybernovatech.space
```

En tu proveedor DNS crea un registro `A`:

```text
maps.cybernovatech.space -> IP_PUBLICA_DEL_SERVIDOR
```

Servicios internos:

- `frontend`: app React/Vite servida con Nginx ligero.
- `backend`: expone `/api/health` dentro de la red Docker.
- `postgres`: PostGIS sin puerto publicado al host.
- `osrm`: usa `./osrm/data:/data:ro` y sirve `/data/bolivia-latest.osrm`.
- `tileserver`: usa `./maps/mbtiles:/data`.
- `nginx`: publica `80:80` y `443:443`; enruta `/`, `/api`, `/maps`, `/route` y `/osrm`.

Levantar:

```bash
docker compose up -d --build
docker compose ps
```

Probar:

```bash
curl http://localhost/api/health
curl http://maps.cybernovatech.space/api/health
curl "http://localhost/osrm/route/v1/driving/-68.1193,-16.4897;-68.1350,-16.5000?overview=false"
```

## Plataforma Web De Mapas

El frontend vive en:

```text
frontend/
├── package.json
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── src/
```

Tecnologias:

- Vite
- React
- TypeScript
- MapLibre GL JS
- TailwindCSS
- Axios
- Lucide React

Variables principales:

```bash
VITE_MAP_STYLE_URL=/maps/styles/basic-preview/style.json
VITE_API_URL=/api
```

Instalar y ejecutar frontend local:

```bash
cd frontend
npm install
npm run dev
```

Compilar frontend:

```bash
cd frontend
npm run build
```

Levantar toda la plataforma con Docker:

```bash
docker compose up -d --build
```

Abrir:

```text
http://localhost
https://maps.cybernovatech.space
```

La interfaz permite:

- Ver el mapa a pantalla completa.
- Pedir ubicacion actual con `navigator.geolocation`.
- Elegir origen y destino haciendo clic en el mapa.
- Usar la ubicacion actual como origen.
- Calcular ruta con OSRM.
- Ver distancia y tiempo estimado.
- Cambiar entre auto, moto, caminar, bici y transporte publico.
- Hacer zoom con controles personalizados.
- Activar vista 3D con pitch y bearing de MapLibre.

## API De Rutas

Endpoint:

```bash
curl "http://localhost/api/route?origin=-19.5836,-65.7531&destination=-19.5890,-65.7550&mode=car"
```

Modos soportados:

```text
car
motorcycle
walking
cycling
public_transport
```

Respuesta:

```json
{
  "mode": "car",
  "distance_meters": 2500,
  "duration_seconds": 420,
  "duration_text": "7 min",
  "distance_text": "2.5 km",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-65.7531, -19.5836], [-65.755, -19.589]]
  }
}
```

Coordenadas:

- Frontend trabaja con `[lng, lat]`.
- Backend recibe `lat,lng`.
- OSRM usa `lng,lat`.

Estimaciones:

- `car`: usa duracion real de OSRM.
- `motorcycle`: usa OSRM y aplica factor `0.85`.
- `walking`: distancia / 5 km/h.
- `cycling`: distancia / 15 km/h.
- `public_transport`: distancia / 18 km/h + 5 minutos.

El backend intenta guardar cada consulta en `route_logs`. Si PostgreSQL no esta disponible, la ruta sigue respondiendo y solo omite el log.

## Geocoding

Endpoints preparados:

```bash
curl "http://localhost/api/geocode/search?q=Plaza 10 de Noviembre"
curl "http://localhost/api/geocode/reverse?lat=-19.5836&lng=-65.7531"
```

Mientras no exista Nominatim o Photon configurado, responden:

```text
Geocoding service not configured yet
```

Para agregar busqueda real despues:

- Levantar Nominatim o Photon como servicio Docker.
- Crear `GEOCODER_URL` en `.env`.
- Reemplazar la respuesta placeholder en `backend/src/routes/geocode.routes.js`.

## Apps Moviles Y Otros Proyectos

Puedes consumir esta plataforma desde taxi, delivery, turismo o rastreo usando:

```text
GET https://maps.cybernovatech.space/api/route
GET https://maps.cybernovatech.space/api/geocode/search
GET https://maps.cybernovatech.space/api/geocode/reverse
```

Ejemplo para apps moviles:

```text
https://maps.cybernovatech.space/api/route?origin=-19.5836,-65.7531&destination=-19.5890,-65.7550&mode=motorcycle
```

## Cambiar Dominio

Edita:

```text
nginx/default.conf
nginx/http.conf
nginx/ssl.conf
.env
```

Cambia:

```text
maps.cybernovatech.space
```

por tu nuevo dominio. Luego:

```bash
docker compose up -d --build
docker compose restart nginx
```

## SSL con Let's Encrypt

El proyecto incluye Certbot para emitir SSL en:

```text
https://maps.cybernovatech.space
```

Antes de emitir el certificado, confirma que el DNS del subdominio apunta a la IP publica del servidor:

```bash
dig +short maps.cybernovatech.space
```

Abre los puertos HTTP y HTTPS en Ubuntu:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

Si tu proveedor VPS tiene firewall externo, abre tambien los puertos `80` y `443` en el panel.

Configura el correo en `.env`:

```bash
DOMAIN=maps.cybernovatech.space
SSL_EMAIL=admin@cybernovatech.space
```

Emite y activa SSL:

```bash
chmod +x scripts/*.sh
./scripts/enable-ssl.sh
```

Prueba:

```bash
curl https://maps.cybernovatech.space/api/health
```

Abre la interfaz web:

```text
https://maps.cybernovatech.space
```

La pantalla principal muestra un mapa de Bolivia con OpenStreetMap como capa base publica y un boton para probar rutas con OSRM.

Renovar certificado:

```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

## TileServer GL

Coloca tus archivos `.mbtiles` en:

```text
maps/mbtiles/
```

Luego reinicia:

```bash
docker compose restart tileserver
```

## Importar a PostGIS

Cuando el contenedor `postgres` este arriba:

```bash
./scripts/import-postgis.sh
```

Este paso usa Docker y `osm2pgsql`. Puede tardar bastante y requiere memoria suficiente segun el tamano del archivo OSM.

## Backup

```bash
./scripts/backup.sh
```

Los backups se guardan en:

```text
backups/
```

## Troubleshooting

Error:

```text
Permission denied
```

Solucion:

```bash
chmod +x scripts/*.sh
```

Error:

```text
bad interpreter: /bin/bash^M
```

Solucion:

```bash
sudo apt install dos2unix -y
dos2unix scripts/*.sh
```

Error:

```text
docker: permission denied
```

Solucion:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Error:

```text
Failed to connect to maps.cybernovatech.space port 80
```

Solucion:

```bash
dig +short maps.cybernovatech.space
docker compose ps
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

Verifica tambien que el firewall del proveedor VPS permita `80` y `443`.

Error:

```text
OSRM no encuentra archivo .osrm
```

Solucion:

```bash
./scripts/prepare-osrm.sh
docker compose restart osrm
```

## Comandos rapidos desde cero

```bash
sudo apt update
sudo apt install unzip curl wget dos2unix -y

unzip map-server.zip
cd map-server

cp .env.example .env
chmod +x scripts/*.sh
dos2unix scripts/*.sh

./scripts/download-osm.sh
./scripts/prepare-osrm.sh

docker compose up -d --build
docker compose ps
curl http://localhost/api/health
```
