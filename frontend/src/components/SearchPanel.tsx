import { LocateFixed, MapPin, Navigation } from "lucide-react";
import TransportSelector from "./TransportSelector";
import type { Coordinate, SelectionMode, TransportMode } from "../types/maps";

type Props = {
  origin: Coordinate | null;
  destination: Coordinate | null;
  selectionMode: SelectionMode;
  transportMode: TransportMode;
  canCalculate: boolean;
  isRouting: boolean;
  onSelectOrigin: () => void;
  onSelectDestination: () => void;
  onUseCurrentLocation: () => void;
  onTransportChange: (mode: TransportMode) => void;
  onCalculate: () => void;
};

export default function SearchPanel({
  origin,
  destination,
  selectionMode,
  transportMode,
  canCalculate,
  isRouting,
  onSelectOrigin,
  onSelectDestination,
  onUseCurrentLocation,
  onTransportChange,
  onCalculate
}: Props) {
  return (
    <section className="rounded-xl bg-white/95 p-4 shadow-panel backdrop-blur md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-flash-orange">FLASH GO</p>
          <h1 className="text-2xl font-black text-flash-black">Maps Platform</h1>
        </div>
        <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">Beta</div>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onSelectOrigin}
          className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
            selectionMode === "origin" ? "border-flash-orange bg-orange-50" : "border-slate-200 bg-white"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-white">
            <Navigation size={17} />
          </span>
          <span>
            <span className="block text-xs font-bold text-slate-500">¿Dónde estás?</span>
            <span className="block text-sm font-bold text-slate-950">
              {origin ? `${origin.lat.toFixed(5)}, ${origin.lng.toFixed(5)}` : "Elegir origen en el mapa"}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onSelectDestination}
          className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
            selectionMode === "destination" ? "border-flash-orange bg-orange-50" : "border-slate-200 bg-white"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-flash-orange text-white">
            <MapPin size={17} />
          </span>
          <span>
            <span className="block text-xs font-bold text-slate-500">¿A dónde vas?</span>
            <span className="block text-sm font-bold text-slate-950">
              {destination
                ? `${destination.lat.toFixed(5)}, ${destination.lng.toFixed(5)}`
                : "Elegir destino en el mapa"}
            </span>
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onUseCurrentLocation}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-flash-orange"
      >
        <LocateFixed size={18} />
        Usar mi ubicación como origen
      </button>

      <div className="my-4">
        <TransportSelector value={transportMode} onChange={onTransportChange} />
      </div>

      <button
        type="button"
        disabled={!canCalculate || isRouting}
        onClick={onCalculate}
        className="w-full rounded-lg bg-flash-orange px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {isRouting ? "Calculando..." : "Calcular ruta"}
      </button>
    </section>
  );
}
