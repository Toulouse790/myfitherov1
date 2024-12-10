import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminHeaderActions } from "./AdminHeaderActions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseRow } from "./ExerciseTable/ExerciseRow";

interface Exercise {
  id: string;
  name: string;
  difficulty: string[];
  location: string[];
  is_published: boolean;
  image_url?: string;
  video_url?: string;
}

export const ExerciseTable = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  const [showVideoUpload, setShowVideoUpload] = useState<string | null>(null);
  const [publishFilter, setPublishFilter] = useState<boolean | null>(false);

  useEffect(() => {
    fetchExercises();
  }, [publishFilter]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('unified_exercises').select('*');
      
      if (publishFilter !== null) {
        query = query.eq('is_published', publishFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedExercises(checked ? exercises.map(e => e.id) : []);
  };

  const handleDelete = async (exerciseIds: string[]) => {
    try {
      const { error } = await supabase
        .from('unified_exercises')
        .delete()
        .in('id', exerciseIds);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Exercices supprimés avec succès",
      });
      
      setSelectedExercises([]);
      fetchExercises();
    } catch (error) {
      console.error('Error deleting exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les exercices",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (exerciseId: string, name: string) => {
    try {
      const newPublishState = !publishFilter;
      const { error } = await supabase
        .from('unified_exercises')
        .update({ 
          is_published: newPublishState,
          name: name 
        })
        .eq('id', exerciseId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Exercice ${newPublishState ? 'publié' : 'dépublié'}`,
      });
      
      fetchExercises();
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'exercice",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 space-y-4">
        <Tabs 
          value={publishFilter === null ? "all" : publishFilter ? "published" : "unpublished"} 
          onValueChange={(value) => setPublishFilter(value === "all" ? null : value === "published")}
        >
          <TabsList>
            <TabsTrigger value="unpublished">À publier</TabsTrigger>
            <TabsTrigger value="published">Publiés</TabsTrigger>
            <TabsTrigger value="all">Tous</TabsTrigger>
          </TabsList>
        </Tabs>

        {!publishFilter && (
          <AdminHeaderActions
            selectedExercises={selectedExercises}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedExercises.length === exercises.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Informations</TableHead>
            <TableHead>Médias</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.id}
              exercise={exercise}
              isSelected={selectedExercises.includes(exercise.id)}
              onSelect={(checked) => {
                setSelectedExercises(prev => 
                  checked 
                    ? [...prev, exercise.id]
                    : prev.filter(id => id !== exercise.id)
                );
              }}
              onNameChange={(name) => handlePublish(exercise.id, name)}
              onPublish={() => handlePublish(exercise.id, exercise.name)}
              showImageUpload={showImageUpload === exercise.id}
              showVideoUpload={showVideoUpload === exercise.id}
              onImageClick={() => setShowImageUpload(exercise.id)}
              onVideoClick={() => setShowVideoUpload(exercise.id)}
              onUploadSuccess={() => {
                setShowImageUpload(null);
                setShowVideoUpload(null);
                fetchExercises();
              }}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};