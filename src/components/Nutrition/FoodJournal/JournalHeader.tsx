
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FilterX } from "lucide-react";
import { FoodEntryDialog } from "../FoodEntry/FoodEntryDialog";
import { useState } from "react";
import { BarcodeScannerDialog } from "./BarcodeScannerDialog";

interface JournalHeaderProps {
  onAddEntry?: (mealType: string) => void;
  onScanBarcode?: (barcode: string) => void;
  isLoading?: boolean;
}

export const JournalHeader = ({ onAddEntry, onScanBarcode, isLoading }: JournalHeaderProps) => {
  const [showFoodEntry, setShowFoodEntry] = useState(false);

  const handleAddEntry = (mealType: string) => {
    if (onAddEntry) {
      onAddEntry(mealType);
    }
    setShowFoodEntry(false);
  };

  const handleBarcodeScanned = (barcode: string) => {
    if (onScanBarcode) {
      onScanBarcode(barcode);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Journal alimentaire</h3>
      <div className="flex gap-2">
        <BarcodeScannerDialog onScanComplete={handleBarcodeScanned} />
        
        <Button
          onClick={() => setShowFoodEntry(true)}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </Button>
        
        {showFoodEntry && (
          <FoodEntryDialog
            open={showFoodEntry}
            onOpenChange={setShowFoodEntry}
            onSubmit={handleAddEntry}
          />
        )}
      </div>
    </div>
  );
};
