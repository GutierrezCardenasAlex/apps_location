import { Router } from "express";

const router = Router();

router.get("/search", (req, res) => {
  const q = String(req.query.q || "").trim();

  res.status(501).json({
    message: "Geocoding service not configured yet",
    query: q,
    provider: null,
    results: []
  });
});

router.get("/reverse", (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  res.status(501).json({
    message: "Geocoding service not configured yet",
    coordinates: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
    provider: null,
    result: null
  });
});

export default router;
