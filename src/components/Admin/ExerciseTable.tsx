import { Card } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { AdminHeaderActions } from "./AdminHeaderActions";
import { ExerciseRow } from "./ExerciseTable/ExerciseRow";
import { FilterTabs } from "./ExerciseTable/FilterTabs";
import { TableHeader } from "./ExerciseTable/TableHeader";
import { useExerciseTable } from "./ExerciseTable/useExerciseTable";

export const ExerciseTable = () => {
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 space-y-4">
        <FilterTabs 
          publishFilter={publishFilter}
          onFilterChange={setPublishFilter}
        />

        {!publishFilter && (
          <AdminHeaderActions
            selectedExercises={selectedExercises}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Table>
        <TableHeader 
          onSelectAll={handleSelectAll}
          allSelected={selectedExercises.length === exercises.length}
        />
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
              }}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};