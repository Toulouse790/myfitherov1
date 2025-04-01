
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { JournalHeader } from "./JournalHeader";
import { JournalTabs } from "./JournalTabs";
import { useFoodJournal } from "@/hooks/food-journal/use-food-journal";
import { useToast } from "@/hooks/use-toast";
import { FoodEntry } from "@/types/food";

export const FoodJournal = () => {
  const { 
    entries, 
    isLoading, 
    handleAddEntry,
    handleDeleteEntry,
    handleBarcodeScan
  } = useFoodJournal();
  
  const { toast } = useToast();

  const handleScanBarcode = async (barcode: string) => {
    try {
      const result = await handleBarcodeScan(barcode);
      if (result) {
        toast({
          title: "Produit trouvé",
          description: `${result.name || 'Produit'} a été ajouté au journal`,
        });
        return true;
      } else {
        toast({
          title: "Produit non trouvé",
          description: "Essayez d'ajouter ce produit manuellement",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error scanning barcode:", error);
      toast({
        title: "Erreur de scan",
        description: "Une erreur s'est produite lors du scan",
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
