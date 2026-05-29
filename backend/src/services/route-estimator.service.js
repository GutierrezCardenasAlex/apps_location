const SPEEDS_KMH = {
  walking: 5,
  cycling: 15,
  public_transport: 18
};

export function estimateRoute(baseRoute, mode) {
  const distanceMeters = baseRoute.distanceMeters;
  let durationSeconds = baseRoute.durationSeconds;

  if (mode === "motorcycle") {
    durationSeconds *= 0.85;
  }

  if (mode === "walking" || mode === "cycling" || mode === "public_transport") {
    durationSeconds = durationFromSpeed(distanceMeters, SPEEDS_KMH[mode]);
  }

  if (mode === "public_transport") {
    durationSeconds += 300;
  }

  return {
    distanceMeters,
    durationSeconds
  };
}

function durationFromSpeed(distanceMeters, speedKmh) {
  const metersPerSecond = (speedKmh * 1000) / 3600;
  return distanceMeters / metersPerSecond;
}
