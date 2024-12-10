import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
}

export const ActionButtons = ({ onApprove, onReject }: ActionButtonsProps) => {
  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={onApprove}
        className="text-green-600 hover:text-green-700"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onReject}
        className="text-red-600 hover:text-red-700"
      >
        <X className="h-4 w-4" />
      </Button>
    </>
  );
};