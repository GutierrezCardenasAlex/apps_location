import { api } from "./api";
import type { Coordinate, RouteResult, TransportMode } from "../types/maps";

export async function getRoute(
  origin: Coordinate,
  destination: Coordinate,
  mode: TransportMode
): Promise<RouteResult> {
  try {
    const response = await api.get<RouteResult>("/route", {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode
      }
    });

    return response.data;
  } catch (error) {
    throw new Error("No se pudo calcular la ruta.");
  }
}
