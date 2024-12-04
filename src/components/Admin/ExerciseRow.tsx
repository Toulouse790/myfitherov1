import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { UploadForm } from "./UploadForm";
import { DifficultyBadges } from "./DifficultyBadges";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    difficulty: string[];
  };
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
  onDifficultyChange: (difficulty: string) => void;
  selectedDifficulties: string[];
}

export const ExerciseRow = ({
  exercise,
  onFileChange,
  onUpload,
  selectedFile,
  onDifficultyChange,
  selectedDifficulties,
}: ExerciseRowProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-shrink-0 w-48">
          <h3 className="font-medium">{exercise.name}</h3>
        </div>
        
        <DifficultyBadges
          selectedDifficulties={selectedDifficulties}
          onDifficultyChange={onDifficultyChange}
        />

        <div className="flex-shrink-0 w-64">
          <UploadForm
            type="image"
            onFileChange={onFileChange}
            onUpload={onUpload}
            selectedFile={selectedFile}
          />
        </div>

        <Button 
          variant="default" 
          size="sm"
          onClick={onUpload}
          disabled={!selectedFile}
        >
          <Upload className="mr-2 h-4 w-4" />
          Publier
        </Button>
      </div>
    </Card>
  );
};