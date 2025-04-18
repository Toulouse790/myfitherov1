
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JournalHeader } from "./JournalHeader";
import { JournalTabs } from "./JournalTabs";
import { useFoodJournal } from "@/hooks/food-journal/use-food-journal";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export const FoodJournal = () => {
  const { 
    entries, 
    isLoading, 
    handleAddEntry,
    handleDeleteEntry,
    handleBarcodeScan
  } = useFoodJournal();
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleScanBarcode = async (barcode: string) => {
    try {
      const result = await handleBarcodeScan(barcode);
      if (result) {
        toast({
          title: t("nutrition.productFound"),
          description: t("nutrition.mealAddedSuccess"),
        });
        return true;
      } else {
        toast({
          title: t("nutrition.productNotFound"),
          description: t("nutrition.errorAddingMeal"),
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
      toast({
        title: t("nutrition.scanningError"),
        description: t("common.error"),
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <JournalHeader 
          onAddEntry={handleAddEntry} 
          onScanBarcode={handleScanBarcode}
          isLoading={isLoading}
        />
      </CardHeader>
      <CardContent>
        <JournalTabs 
          entries={entries} 
          isLoading={isLoading} 
          onDeleteEntry={handleDeleteEntry}
        />
      </CardContent>
    </Card>
  );
};
