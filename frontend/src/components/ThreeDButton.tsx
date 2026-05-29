import { Box } from "lucide-react";

type Props = {
  enabled: boolean;
  onClick: () => void;
};

export default function ThreeDButton({ enabled, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-12 w-12 place-items-center rounded-full shadow-panel transition ${
        enabled ? "bg-brand-orange text-white" : "bg-white text-slate-950 hover:text-brand-orange"
      }`}
      title={enabled ? "Vista 2D" : "Vista 3D"}
    >
      <Box size={22} />
    </button>
  );
}
