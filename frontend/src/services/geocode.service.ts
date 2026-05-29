import { api } from "./api";
import type { Coordinate } from "../types/maps";

const knownPlaces: Record<string, Coordinate> = {
  potosi: { lat: -19.5836, lng: -65.7531 },
  "potosi bolivia": { lat: -19.5836, lng: -65.7531 },
  "plaza 10 de noviembre": { lat: -19.5888, lng: -65.7539 },
  "plaza 10 de noviembre potosi": { lat: -19.5888, lng: -65.7539 },
  "terminal de buses potosi": { lat: -19.5797, lng: -65.7602 },
  "cerro rico": { lat: -19.6228, lng: -65.7567 }
};

export async function resolvePlace(input: string): Promise<Coordinate> {
  const value = input.trim();
  if (!value) throw new Error("Escribe una direccion o coordenadas.");

  const coordinates = parseCoordinateInput(value);
  if (coordinates) return coordinates;

  const known = knownPlaces[normalize(value)];
  if (known) return known;

  try {
    const response = await api.get("/geocode/search", {
      params: { q: value }
    });
    const first = response.data?.results?.[0];

    if (first?.lat && first?.lng) {
      return {
        lat: Number(first.lat),
        lng: Number(first.lng)
      };
    }
  } catch (error) {
    throw new Error("Busqueda de direcciones no configurada todavia. Usa coordenadas lat,lng o marca en el mapa.");
  }

  throw new Error("No se encontro esa direccion. Usa coordenadas lat,lng o marca en el mapa.");
}

function parseCoordinateInput(value: string): Coordinate | null {
  const normalized = value.replace(/\s+/g, "");
  const match = normalized.match(/^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
