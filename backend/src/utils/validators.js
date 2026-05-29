const VALID_MODES = new Set(["car", "motorcycle", "walking", "cycling", "public_transport"]);

export function parseLatLng(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequest(`${fieldName} requerido. Formato esperado: lat,lng`);
  }

  const [latRaw, lngRaw] = value.split(",");
  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw badRequest(`${fieldName} debe contener coordenadas validas: lat,lng`);
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw badRequest(`${fieldName} fuera de rango.`);
  }

  return { lat, lng };
}

export function validateMode(value) {
  const mode = String(value);

  if (!VALID_MODES.has(mode)) {
    throw badRequest("mode invalido. Usa car, motorcycle, walking, cycling o public_transport.");
  }

  return mode;
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}
