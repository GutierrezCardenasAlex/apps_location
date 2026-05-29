import express from "express";
import geocodeRoutes from "./routes/geocode.routes.js";
import routeRoutes from "./routes/route.routes.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "map-server",
    osrm: process.env.OSRM_URL || "http://osrm:5000",
    tileserver: process.env.TILESERVER_URL || "http://tileserver:8080"
  });
});

app.use("/api/geocode", geocodeRoutes);
app.use("/api/route", routeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error"
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`map-server backend listening on ${port}`);
});
