import { LocateFixed, MapPin, Navigation, Search } from "lucide-react";
import TransportSelector from "./TransportSelector";
import type { Coordinate, SelectionMode, TransportMode } from "../types/maps";

type Props = {
  origin: Coordinate | null;
  destination: Coordinate | null;
  originText: string;
  destinationText: string;
  selectionMode: SelectionMode;
  transportMode: TransportMode;
  canCalculate: boolean;
  isRouting: boolean;
  onSelectOrigin: () => void;
  onSelectDestination: () => void;
  onOriginTextChange: (value: string) => void;
  onDestinationTextChange: (value: string) => void;
  onApplyOriginText: () => void;
  onApplyDestinationText: () => void;
  onUseCurrentLocation: () => void;
  onTransportChange: (mode: TransportMode) => void;
  onCalculate: () => void;
};

export default function SearchPanel({
  origin,
  destination,
  originText,
  destinationText,
  selectionMode,
  transportMode,
  canCalculate,
  isRouting,
  onSelectOrigin,
  onSelectDestination,
  onOriginTextChange,
  onDestinationTextChange,
  onApplyOriginText,
  onApplyDestinationText,
  onUseCurrentLocation,
  onTransportChange,
  onCalculate
}: Props) {
  return (
    <section className="rounded-xl border border-sky-400/20 bg-slate-950/90 p-3 text-white shadow-panel backdrop-blur md:p-5">
      <div className="mb-3 flex items-center justify-between gap-4 md:mb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-blue">Developer Maps</p>
          <h1 className="text-xl font-black text-white md:text-2xl">Plataforma de mapas</h1>
        </div>
        <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-bold text-sky-200">Beta</div>
      </div>

      <div className="grid gap-2">
        <div
          className={`rounded-lg border p-3 transition ${
            selectionMode === "origin" ? "border-brand-blue bg-sky-500/10" : "border-white/10 bg-white/5"
          }`}
        >
          <div className="mb-2 flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-sky-300 ring-1 ring-sky-400/30">
              <Navigation size={17} />
            </span>
            <div>
              <span className="block text-xs font-bold text-slate-400">¿Dónde estás?</span>
              <span className="block text-xs font-semibold text-slate-300">
                {origin ? "Origen marcado" : "Escribe o marca tu origen"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={originText}
              onChange={(event) => onOriginTextChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onApplyOriginText();
              }}
              placeholder="Ej: -19.5836,-65.7531"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-blue md:text-sm"
            />
            <button
              type="button"
              onClick={onApplyOriginText}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-500 text-white transition hover:bg-sky-400"
              title="Aplicar origen escrito"
            >
              <Search size={17} />
            </button>
          </div>
          <button
            type="button"
            onClick={onSelectOrigin}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-brand-blue"
          >
            <Navigation size={17} />
            Marcar origen en el mapa
          </button>
        </div>

        <div
          className={`rounded-lg border p-3 transition ${
            selectionMode === "destination" ? "border-brand-blue bg-sky-500/10" : "border-white/10 bg-white/5"
          }`}
        >
          <div className="mb-2 flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-blue text-white shadow-lg shadow-sky-500/20">
              <MapPin size={17} />
            </span>
            <div>
              <span className="block text-xs font-bold text-slate-400">¿A dónde vas?</span>
              <span className="block text-xs font-semibold text-slate-300">
                {destination ? "Destino marcado" : "Escribe o marca tu destino"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={destinationText}
              onChange={(event) => onDestinationTextChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onApplyDestinationText();
              }}
              placeholder="Ej: Plaza 10 de Noviembre"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-blue md:text-sm"
            />
            <button
              type="button"
              onClick={onApplyDestinationText}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-500 text-white transition hover:bg-sky-400"
              title="Aplicar destino escrito"
            >
              <Search size={17} />
            </button>
          </div>
          <button
            type="button"
            onClick={onSelectDestination}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-brand-blue"
          >
            <MapPin size={17} />
            Marcar destino en el mapa
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onUseCurrentLocation}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm font-black text-sky-100 transition hover:border-brand-blue hover:bg-sky-500/20"
      >
        <LocateFixed size={18} />
        Usar mi ubicación como origen
      </button>

      <div className="my-3 md:my-4">
        <TransportSelector value={transportMode} onChange={onTransportChange} />
      </div>

      <button
        type="button"
        disabled={!canCalculate || isRouting}
        onClick={onCalculate}
        className="w-full rounded-lg bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
      >
        {isRouting ? "Calculando..." : "Calcular ruta"}
      </button>
    </section>
  );
}
