import { Clock, Map, Route } from "lucide-react";
import type { RouteResult, TransportMode } from "../types/maps";

type Props = {
  route: RouteResult | null;
  mode: TransportMode;
  toast: string;
};

const labels: Record<TransportMode, string> = {
  car: "Auto",
  motorcycle: "Moto",
  walking: "Caminando",
  cycling: "Bicicleta",
  public_transport: "Transporte público"
};

export default function RouteSummary({ route, mode, toast }: Props) {
  return (
    <section className="rounded-xl border border-sky-400/20 bg-slate-950/90 p-3 text-white shadow-panel backdrop-blur md:p-4">
      <p className="mb-2 rounded-lg bg-sky-500/15 px-3 py-2 text-xs font-bold text-sky-100 md:mb-3 md:text-sm">
        {toast}
      </p>

      {route ? (
        <div className="grid grid-cols-3 gap-2">
          <SummaryItem icon={Route} label="Distancia" value={route.distance_text} />
          <SummaryItem icon={Clock} label="Tiempo" value={route.duration_text} />
          <SummaryItem icon={Map} label="Modo" value={labels[route.mode]} />
        </div>
      ) : (
        <div className="text-xs text-slate-300 md:text-sm">
          Selecciona origen y destino para ver distancia, tiempo estimado y ruta recomendada.
        </div>
      )}

      {route && mode !== "car" ? (
        <p className="mt-2 text-[11px] font-semibold text-slate-400 md:mt-3 md:text-xs">
          Tiempo aproximado calculado con distancia de OSRM y velocidad promedio para {labels[mode].toLowerCase()}.
        </p>
      ) : null}
    </section>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Route;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2 md:p-3">
      <Icon className="mb-1 text-brand-blue md:mb-2" size={18} />
      <span className="block text-[11px] font-bold uppercase text-slate-400">{label}</span>
      <strong className="block text-xs text-white md:text-sm">{value}</strong>
    </div>
  );
}
