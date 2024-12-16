import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NumberControlProps {
  value: number;
  label: string;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export const NumberControl = ({
  value,
  label,
  onIncrease,
  onDecrease,
  disabled = false
}: NumberControlProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          disabled={disabled}
          className="h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center">{value}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          disabled={disabled}
          className="h-8 w-8"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};