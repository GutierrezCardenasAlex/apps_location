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
    <section className="rounded-xl bg-white/95 p-4 shadow-panel backdrop-blur">
      <p className="mb-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white">{toast}</p>

      {route ? (
        <div className="grid grid-cols-3 gap-2">
          <SummaryItem icon={Route} label="Distancia" value={route.distance_text} />
          <SummaryItem icon={Clock} label="Tiempo" value={route.duration_text} />
          <SummaryItem icon={Map} label="Modo" value={labels[route.mode]} />
        </div>
      ) : (
        <div className="text-sm text-slate-600">
          Selecciona origen y destino para ver distancia, tiempo estimado y ruta recomendada.
        </div>
      )}

      {route && mode !== "car" ? (
        <p className="mt-3 text-xs font-semibold text-slate-500">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <Icon className="mb-2 text-flash-orange" size={18} />
      <span className="block text-[11px] font-bold uppercase text-slate-500">{label}</span>
      <strong className="block text-sm text-slate-950">{value}</strong>
    </div>
  );
}
