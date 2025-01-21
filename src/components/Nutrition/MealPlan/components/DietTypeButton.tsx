import { Button } from "@/components/ui/button";

interface DietTypeButtonProps {
  type: string;
  currentType: string;
  label: string;
  onClick: (type: string) => void;
}

export const DietTypeButton = ({ type, currentType, label, onClick }: DietTypeButtonProps) => {
  return (
    <Button
      type="button"
      variant={currentType === type ? "default" : "outline"}
      onClick={() => onClick(type)}
      className="w-full justify-start gap-2 text-sm"
    >
      {label}
    </Button>
  );
};