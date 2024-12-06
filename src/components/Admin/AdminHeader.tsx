import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Upload, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminHeaderProps {
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
  selectedExercises: string[];
  onExercisesDeleted: () => void;
}

export const AdminHeader = ({ 
  isEditing, 
  onEditingChange,
  selectedExercises,
  onExercisesDeleted
}: AdminHeaderProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
    });
  };

  const handlePublish = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice à publier",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mettre à jour le statut des exercices sélectionnés
      const { error } = await supabase
        .from('exercises')
        .update({ is_published: true })
        .in('id', selectedExercises);

      if (error) throw error;

      toast({
        title: "Publication réussie",
        description: `${selectedExercises.length} exercice(s) publié(s) avec succès`,
      });

      // Rafraîchir la liste des exercices
      onExercisesDeleted();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice à supprimer",
        variant: "destructive",
      });
      return;
    }

    try {
      // Supprimer les médias associés d'abord
      const { error: mediaError } = await supabase
        .from('exercise_media')
        .delete()
        .in('exercise_id', selectedExercises);

      if (mediaError) throw mediaError;

      // Ensuite, supprimer les exercices
      const { error: exerciseError } = await supabase
        .from('exercises')
        .delete()
        .in('id', selectedExercises);

      if (exerciseError) throw exerciseError;

      toast({
        title: "Suppression réussie",
        description: `${selectedExercises.length} exercice(s) supprimé(s) avec succès`,
      });

      // Rafraîchir la liste des exercices
      onExercisesDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
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
          disabled={selectedExercises.length === 0}
        >
          <Upload className="w-4 h-4" />
          Publier
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="gap-2"
          disabled={selectedExercises.length === 0}
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </Button>
        <Button size="sm" onClick={handleExport}>Exporter</Button>
      </div>
    </div>
  );
};