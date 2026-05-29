const OSRM_URL = process.env.OSRM_URL || "http://osrm:5000";

export async function getRoute(origin, destination) {
  const originOsrm = `${origin.lng},${origin.lat}`;
  const destinationOsrm = `${destination.lng},${destination.lat}`;
  const url = `${OSRM_URL}/route/v1/driving/${originOsrm};${destinationOsrm}?overview=full&geometries=geojson`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    const err = new Error("Servidor de rutas no disponible.");
    err.statusCode = 503;
    throw err;
  }

  if (!response.ok) {
    const err = new Error("No se pudo calcular la ruta.");
    err.statusCode = response.status >= 500 ? 503 : 400;
    throw err;
  }

  const data = await response.json();
  const route = data.routes?.[0];

  if (!route?.geometry) {
    const err = new Error("No se pudo calcular la ruta.");
    err.statusCode = 404;
    throw err;
  }

  return {
    distanceMeters: Number(route.distance || 0),
    durationSeconds: Number(route.duration || 0),
    geometry: {
      type: "LineString",
      coordinates: route.geometry.coordinates
    }
  };
}
