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
    <div className="grid grid-cols-5 gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.id === value;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-lg border text-[11px] font-bold transition ${
              active
                ? "border-brand-orange bg-brand-orange text-white shadow-lg shadow-orange-500/25"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-orange"
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
