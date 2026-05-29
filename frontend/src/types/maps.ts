export type Coordinate = {
  lng: number;
  lat: number;
};

export type TransportMode = "car" | "motorcycle" | "walking" | "cycling" | "public_transport";

export type SelectionMode = "none" | "origin" | "destination";

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

export type RouteResult = {
  mode: TransportMode;
  distance_meters: number;
  duration_seconds: number;
  duration_text: string;
  distance_text: string;
  geometry: RouteGeometry;
};
