import { LocateFixed } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function LocationButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full border border-sky-400/20 bg-slate-950/90 text-sky-100 shadow-panel transition hover:text-brand-blue"
      title="Mi ubicación"
    >
      <LocateFixed size={22} />
    </button>
  );
}
