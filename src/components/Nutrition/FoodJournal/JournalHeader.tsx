
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Scan } from "lucide-react";
import { useState } from "react";
import { FoodEntryForm } from "../FoodEntry/FoodEntryForm";
import { useFoodInput } from "@/hooks/food-journal/use-food-input";
import { BarcodeScanner } from "../BarcodeScanner";

interface JournalHeaderProps {
  onAddEntry: (mealType: string) => Promise<any>;
  onScanBarcode: (barcode: string) => Promise<boolean>;
  isLoading: boolean;
}

export const JournalHeader = ({ onAddEntry, onScanBarcode, isLoading }: JournalHeaderProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const {
    newFood,
    calories,
    proteins,
    carbs,
    fats,
    weight,
    notes,
    baseCalories,
    selectedCategory,
    setNewFood,
    setCalories,
    setProteins,
    setCarbs,
    setFats,
    setWeight,
    setNotes,
    setSelectedCategory
  } = useFoodInput();

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Journal Alimentaire</h3>
      
      <div className="flex space-x-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default"
              size="sm"
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un aliment</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un aliment</DialogTitle>
            </DialogHeader>
            <FoodEntryForm 
              newFood={newFood}
              calories={calories.toString()}
              proteins={proteins.toString()}
              carbs={carbs.toString()}
              fats={fats.toString()}
              weight={weight.toString()}
              notes={notes}
              baseCalories={baseCalories}
              selectedCategory={selectedCategory || ""}
              onFoodChange={setNewFood}
              onCaloriesChange={(val) => setCalories(parseInt(val) || 0)}
              onProteinsChange={(val) => setProteins(parseInt(val) || 0)}
              onCarbsChange={(val) => setCarbs(parseInt(val) || 0)}
              onFatsChange={(val) => setFats(parseInt(val) || 0)}
              onWeightChange={(val) => setWeight(parseInt(val) || 0)}
              onNotesChange={setNotes}
              onAddEntry={async (mealType) => {
                const result = await onAddEntry(mealType);
                if (result) {
                  setIsAddDialogOpen(false);
                }
              }}
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <Scan className="h-4 w-4" />
              <span className="hidden sm:inline">Scanner</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scanner un code barre</DialogTitle>
            </DialogHeader>
            <BarcodeScanner 
              onScan={async (barcode) => {
                const success = await onScanBarcode(barcode);
                if (success) {
                  setIsScannerOpen(false);
                }
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
