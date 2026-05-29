import { Bike, Bus, Car, Footprints } from "lucide-react";
import type { TransportMode } from "../types/maps";

type Option = {
  id: TransportMode;
  label: string;
  icon: typeof Car;
};

const options: Option[] = [
  { id: "car", label: "Auto", icon: Car },
  { id: "motorcycle", label: "Moto", icon: Bike },
  { id: "walking", label: "Caminar", icon: Footprints },
  { id: "cycling", label: "Bici", icon: Bike },
  { id: "public_transport", label: "Transporte", icon: Bus }
];

type Props = {
  value: TransportMode;
  onChange: (mode: TransportMode) => void;
};

export default function TransportSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1.5 md:gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg border px-1 text-[10px] font-bold transition md:min-h-[58px] md:text-[11px] ${
              active
                ? "border-brand-blue bg-brand-blue text-white shadow-lg shadow-sky-500/25"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-brand-blue hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
