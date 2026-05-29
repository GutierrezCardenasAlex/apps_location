import { Router } from "express";
import { getRoute } from "../services/osrm.service.js";
import { estimateRoute } from "../services/route-estimator.service.js";
import { logRoute } from "../services/route-log.service.js";
import { formatDistance } from "../utils/formatDistance.js";
import { formatDuration } from "../utils/formatDuration.js";
import { parseLatLng, validateMode } from "../utils/validators.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const origin = parseLatLng(req.query.origin, "origin");
    const destination = parseLatLng(req.query.destination, "destination");
    const mode = validateMode(req.query.mode || "car");

    const baseRoute = await getRoute(origin, destination);
    const estimated = estimateRoute(baseRoute, mode);

    const response = {
      mode,
      distance_meters: Math.round(estimated.distanceMeters),
      duration_seconds: Math.round(estimated.durationSeconds),
      duration_text: formatDuration(estimated.durationSeconds),
      distance_text: formatDistance(estimated.distanceMeters),
      geometry: baseRoute.geometry
    };

    logRoute({
      origin,
      destination,
      mode,
      distanceMeters: response.distance_meters,
      durationSeconds: response.duration_seconds
    }).catch((error) => {
      console.warn("Route log skipped:", error.message);
    });

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
