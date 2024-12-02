import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const AdminHeader = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <p className="text-muted-foreground">
          Gérez votre application et suivez vos statistiques
        </p>
      </div>
      <Button onClick={handleExport}>Exporter les données</Button>
    </div>
  );
};