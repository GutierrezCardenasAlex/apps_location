import express from "express";

const app = express();
const port = Number(process.env.PORT || 3000);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "map-server",
    osrm: process.env.OSRM_URL || "http://osrm:5000",
    tileserver: process.env.TILESERVER_URL || "http://tileserver:8080"
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`map-server backend listening on ${port}`);
});
