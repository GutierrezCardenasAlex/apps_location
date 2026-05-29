import { LocateFixed } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function LocationButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950 shadow-panel transition hover:text-flash-orange"
      title="Mi ubicación"
    >
      <LocateFixed size={22} />
    </button>
  );
}
