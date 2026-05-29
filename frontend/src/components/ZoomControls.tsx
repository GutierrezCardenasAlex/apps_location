import { Minus, Plus } from "lucide-react";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function ZoomControls({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="overflow-hidden rounded-full border border-sky-400/20 bg-slate-950/90 shadow-panel">
      <button
        type="button"
        onClick={onZoomIn}
        className="grid h-12 w-12 place-items-center text-sky-100 transition hover:text-brand-blue"
        title="Acercar"
      >
        <Plus size={22} />
      </button>
      <div className="mx-3 h-px bg-white/10" />
      <button
        type="button"
        onClick={onZoomOut}
        className="grid h-12 w-12 place-items-center text-sky-100 transition hover:text-brand-blue"
        title="Alejar"
      >
        <Minus size={22} />
      </button>
    </div>
  );
}
