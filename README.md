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

- `backend`: expone `/api/health` dentro de la red Docker.
- `postgres`: PostGIS sin puerto publicado al host.
- `osrm`: usa `./osrm/data:/data:ro` y sirve `/data/bolivia-latest.osrm`.
- `tileserver`: usa `./maps/mbtiles:/data`.
- `nginx`: publica `80:80` y enruta `/api`, `/osrm` y `/tiles`.

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
