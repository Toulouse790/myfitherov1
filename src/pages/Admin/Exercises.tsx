import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Added import
import { useToast } from "@/hooks/use-toast";
import { useExerciseTable } from "@/hooks/exercise-table/useExerciseTable";
import { ExerciseRow } from "@/components/Admin/ExerciseTable/ExerciseRow";
import { FilterTabs } from "@/components/Admin/ExerciseTable/FilterTabs";

export default function ExercisesAdmin() {
  const { toast } = useToast();
  const {
    exercises,
    isLoading,
    selectedExercises,
    showImageUpload,
    showVideoUpload,
    publishFilter,
    setShowImageUpload,
    setShowVideoUpload,
    setSelectedExercises,
    handleSelectAll,
    handleDelete,
    handlePublish,
    setPublishFilter,
  } = useExerciseTable();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des exercices</h1>
        <div className="space-x-2">
          <Button
            variant="destructive"
            onClick={() => handleDelete(selectedExercises)}
            disabled={selectedExercises.length === 0}
          >
            Supprimer
          </Button>
          <Button
            variant="default"
            onClick={() => handlePublish(selectedExercises)}
            disabled={selectedExercises.length === 0}
          >
            Publier
          </Button>
        </div>
      </div>

      <FilterTabs 
        publishFilter={publishFilter}
        onFilterChange={(value) => setPublishFilter(value)}
      />

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedExercises.length === exercises.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean, exercises)}
                />
              </TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Paramètres</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((exercise) => (
              <ExerciseRow
                key={exercise.id}
                exercise={exercise}
                isSelected={selectedExercises.includes(exercise.id)}
                onSelect={(checked) => {
                  if (checked) {
                    setSelectedExercises([...selectedExercises, exercise.id]);
                  } else {
                    setSelectedExercises(selectedExercises.filter(id => id !== exercise.id));
                  }
                }}
                onNameChange={(name) => {
                  // Implement name change logic
                }}
                onPublish={() => handlePublish([exercise.id])}
                showImageUpload={showImageUpload === exercise.id}
                showVideoUpload={showVideoUpload === exercise.id}
                onImageClick={() => setShowImageUpload(showImageUpload === exercise.id ? null : exercise.id)}
                onVideoClick={() => setShowVideoUpload(showVideoUpload === exercise.id ? null : exercise.id)}
                onUploadSuccess={() => {
                  setShowImageUpload(null);
                  setShowVideoUpload(null);
                  toast({
                    title: "Succès",
                    description: "Le média a été téléchargé avec succès",
                  });
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}