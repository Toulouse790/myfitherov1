
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SetControlsProps {
  value: number;
  label: string;
  minValue?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const SetControls = ({
  value,
  label,
  minValue = 1,
  step = 1,
  onChange,
  disabled = false
}: SetControlsProps) => {
  const { t } = useLanguage();
  
  const handleIncrease = () => {
    onChange(value + step);
  };
  
  const handleDecrease = () => {
    if (value > minValue) {
      onChange(value - step);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleDecrease}
        disabled={disabled || value <= minValue}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium">{value} {label}</span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleIncrease}
        disabled={disabled}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
