const boliviaBounds = [
  [-22.95, -69.65],
  [-9.65, -57.45]
];

const map = L.map("map", {
  zoomControl: true
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.fitBounds(boliviaBounds);

let routeLayer;
let routeMarkers = [];

const apiStatus = document.getElementById("api-status");
const routeStatus = document.getElementById("route-status");

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    apiStatus.textContent = data.status === "ok" ? "OK" : "Revisar";
  } catch (error) {
    apiStatus.textContent = "Sin conexion";
  }
}

function clearRoute() {
  if (routeLayer) {
    map.removeLayer(routeLayer);
    routeLayer = null;
  }

  routeMarkers.forEach((marker) => map.removeLayer(marker));
  routeMarkers = [];
  routeStatus.textContent = "Listo para probar";
}

async function testRoute() {
  clearRoute();
  routeStatus.textContent = "Calculando...";

  const start = [-68.1193, -16.4897];
  const end = [-68.135, -16.5];
  const url = `/osrm/route/v1/driving/${start.join(",")};${end.join(",")}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const route = data.routes?.[0];

    if (!route) {
      routeStatus.textContent = "Sin ruta";
      return;
    }

    const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    routeLayer = L.polyline(coordinates, {
      color: "#d62828",
      weight: 5,
      opacity: 0.9
    }).addTo(map);

    routeMarkers = [
      L.marker([start[1], start[0]]).addTo(map).bindPopup("Inicio"),
      L.marker([end[1], end[0]]).addTo(map).bindPopup("Destino")
    ];

    map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });
    routeStatus.textContent = `${(route.distance / 1000).toFixed(2)} km`;
  } catch (error) {
    routeStatus.textContent = "Error OSRM";
  }
}

document.getElementById("fit-bolivia").addEventListener("click", () => map.fitBounds(boliviaBounds));
document.getElementById("test-route").addEventListener("click", testRoute);
document.getElementById("clear-route").addEventListener("click", clearRoute);

checkHealth();
