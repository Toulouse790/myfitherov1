import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Upload, Trash2 } from "lucide-react";

interface AdminHeaderProps {
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
}

export const AdminHeader = ({ isEditing, onEditingChange }: AdminHeaderProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Publication en cours",
      description: "Les modifications sont en cours de publication...",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Suppression",
      description: "L'élément a été supprimé avec succès",
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
      <div className="flex gap-2">
        <Button
          variant={isEditing ? "secondary" : "outline"}
          onClick={() => onEditingChange(!isEditing)}
          className="gap-2"
          size="sm"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Terminer" : "Modifier"}
        </Button>
        <Button 
          variant="default"
          size="sm" 
          onClick={handlePublish}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Upload className="w-4 h-4" />
          Publier
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </Button>
        <Button size="sm" onClick={handleExport}>Exporter</Button>
      </div>
    </div>
  );
};