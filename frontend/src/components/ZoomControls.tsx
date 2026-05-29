import { Minus, Plus } from "lucide-react";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function ZoomControls({ onZoomIn, onZoomOut }: Props) {
  return (
    <div className="overflow-hidden rounded-full bg-white shadow-panel">
      <button
        type="button"
        onClick={onZoomIn}
        className="grid h-12 w-12 place-items-center text-slate-950 transition hover:text-flash-orange"
        title="Acercar"
      >
        <Plus size={22} />
      </button>
      <div className="mx-3 h-px bg-slate-200" />
      <button
        type="button"
        onClick={onZoomOut}
        className="grid h-12 w-12 place-items-center text-slate-950 transition hover:text-flash-orange"
        title="Alejar"
      >
        <Minus size={22} />
      </button>
    </div>
  );
}
