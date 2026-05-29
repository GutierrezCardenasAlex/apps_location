import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import maplibregl, { type GeoJSONSource, type Map } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { env } from "../config/env";
import type { Coordinate, RouteResult, SelectionMode } from "../types/maps";

type MapActions = {
  zoomIn: () => void;
  zoomOut: () => void;
  centerOn: (coordinate: Coordinate, zoom?: number) => void;
  fitRoute: () => void;
  set3D: (enabled: boolean) => void;
};

type Props = {
  initialCenter: Coordinate;
  origin: Coordinate | null;
  destination: Coordinate | null;
  userLocation: Coordinate | null;
  route: RouteResult | null;
  selectionMode: SelectionMode;
  onMapClick: (coordinate: Coordinate) => void;
  onActionsReady: (actions: MapActions) => void;
  onMapReady: () => void;
  onMapError: () => void;
};

export default function MapView({
  initialCenter,
  origin,
  destination,
  userLocation,
  route,
  selectionMode,
  onMapClick,
  onActionsReady,
  onMapReady,
  onMapError
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const routeRef = useRef<RouteResult | null>(route);
  const onMapClickRef = useRef(onMapClick);
  const markersRef = useRef<Record<string, maplibregl.Marker | null>>({
    origin: null,
    destination: null,
    user: null
  });

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    async function createMap() {
      const style = await resolveMapStyle(onMapError);
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style,
        center: [initialCenter.lng, initialCenter.lat],
        zoom: 13,
        attributionControl: false
      });

      mapRef.current = map;

      map.on("load", () => {
        addRouteLayer(map);
        onMapReady();
      });

      map.on("error", onMapError);
      map.on("click", (event) => {
        onMapClickRef.current({
          lng: event.lngLat.lng,
          lat: event.lngLat.lat
        });
      });

      onActionsReady({
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
        centerOn: (coordinate, zoom = 15) => {
          map.flyTo({ center: [coordinate.lng, coordinate.lat], zoom, essential: true });
        },
        fitRoute: () => {
          fitRoute(map, routeRef.current);
        },
        set3D: (enabled) => {
          map.easeTo({
            pitch: enabled ? 60 : 0,
            bearing: enabled ? -20 : 0,
            duration: 500
          });
        }
      });
    }

    void createMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialCenter.lat, initialCenter.lng, onActionsReady, onMapError, onMapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.getCanvas().style.cursor = selectionMode === "none" ? "grab" : "crosshair";
  }, [selectionMode]);

  useEffect(() => {
    updateMarker("origin", origin, "marker marker-origin", markersRef, mapRef);
    updateMarker("destination", destination, "marker marker-destination", markersRef, mapRef);
    updateMarker("user", userLocation, "marker marker-user", markersRef, mapRef);
  }, [destination, origin, userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("route-line") as GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "Feature",
      properties: {},
      geometry: route?.geometry || {
        type: "LineString",
        coordinates: []
      }
    });

    if (route) {
      fitRoute(map, route);
    }
  }, [route]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

async function resolveMapStyle(onMapError: () => void): Promise<string | StyleSpecification> {
  try {
    const response = await fetch(env.mapStyleUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Map style returned ${response.status}`);
    return (await response.json()) as StyleSpecification;
  } catch (error) {
    onMapError();
    return fallbackStyle;
  }
}

const fallbackStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "OpenStreetMap"
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ]
};

function addRouteLayer(map: Map) {
  if (map.getSource("route-line")) return;

  map.addSource("route-line", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: []
      }
    }
  });

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route-line",
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#ff7a00",
      "line-width": 6,
      "line-opacity": 0.92
    }
  });
}

function updateMarker(
  key: "origin" | "destination" | "user",
  coordinate: Coordinate | null,
  className: string,
  markersRef: MutableRefObject<Record<string, maplibregl.Marker | null>>,
  mapRef: MutableRefObject<Map | null>
) {
  const current = markersRef.current[key];

  if (!coordinate) {
    current?.remove();
    markersRef.current[key] = null;
    return;
  }

  if (current) {
    current.setLngLat([coordinate.lng, coordinate.lat]);
    return;
  }

  const element = document.createElement("div");
  element.className = className;

  markersRef.current[key] = new maplibregl.Marker({ element })
    .setLngLat([coordinate.lng, coordinate.lat])
    .addTo(mapRef.current!);
}

function fitRoute(map: Map, route: RouteResult | null) {
  if (!route?.geometry.coordinates.length) return;

  const bounds = route.geometry.coordinates.reduce(
    (currentBounds, coordinate) => currentBounds.extend(coordinate),
    new maplibregl.LngLatBounds(route.geometry.coordinates[0], route.geometry.coordinates[0])
  );

  map.fitBounds(bounds, {
    padding: 90,
    duration: 500,
    maxZoom: 16
  });
}
