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
        enabled
          ? "border border-brand-blue bg-brand-blue text-white"
          : "border border-sky-400/20 bg-slate-950/90 text-sky-100 hover:text-brand-blue"
      }`}
      title={enabled ? "Vista 2D" : "Vista 3D"}
    >
      <Box size={22} />
    </button>
  );
}
