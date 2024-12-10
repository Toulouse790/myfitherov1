import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AdminHeaderActions } from "./AdminHeaderActions";
import { MediaButtons } from "./MediaButtons";
import { UploadForm } from "./UploadForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
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

  const handleSelectExercise = (exerciseId: string, checked: boolean) => {
    setSelectedExercises(prev => 
      checked 
        ? [...prev, exerciseId]
        : prev.filter(id => id !== exerciseId)
    );
  };

  const handleDelete = async (exerciseIds: string[]) => {
    try {
      console.log('Deleting exercises:', exerciseIds);
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
      console.log('Publishing exercise:', exerciseId);
      const { error } = await supabase
        .from('unified_exercises')
        .update({ 
          is_published: !publishFilter,
          name: name 
        })
        .eq('id', exerciseId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Exercice ${publishFilter ? 'dépublié' : 'publié'}`,
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

  const handleUploadSuccess = () => {
    setShowImageUpload(null);
    setShowVideoUpload(null);
    fetchExercises();
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
        <Tabs value={publishFilter === null ? "all" : publishFilter ? "published" : "unpublished"} 
              onValueChange={(value) => setPublishFilter(value === "all" ? null : value === "published")}>
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
            <TableHead>Groupe musculaire</TableHead>
            <TableHead>Médias</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exercises.map((exercise) => (
            <TableRow key={exercise.id}>
              <TableCell>
                <Checkbox 
                  checked={selectedExercises.includes(exercise.id)}
                  onCheckedChange={(checked) => handleSelectExercise(exercise.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => handlePublish(exercise.id, e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>{translateMuscleGroup(exercise.muscle_group)}</TableCell>
              <TableCell>
                <MediaButtons
                  isPublished={exercise.is_published}
                  isPublishing={false}
                  onPublishToggle={() => handlePublish(exercise.id, exercise.name)}
                  onImageClick={() => setShowImageUpload(exercise.id)}
                  onVideoClick={() => setShowVideoUpload(exercise.id)}
                />
                {showImageUpload === exercise.id && (
                  <div className="mt-2">
                    <UploadForm
                      exerciseId={exercise.id}
                      exerciseName={exercise.name}
                      type="image"
                      onSuccess={handleUploadSuccess}
                    />
                  </div>
                )}
                {showVideoUpload === exercise.id && (
                  <div className="mt-2">
                    <UploadForm
                      exerciseId={exercise.id}
                      exerciseName={exercise.name}
                      type="video"
                      onSuccess={handleUploadSuccess}
                    />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePublish(exercise.id, exercise.name)}
                >
                  {exercise.is_published ? 'Dépublier' : 'Publier'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};