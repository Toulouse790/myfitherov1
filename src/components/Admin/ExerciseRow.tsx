import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Upload } from "lucide-react";
import { UploadForm } from "./UploadForm";
import { DifficultyBadges } from "./DifficultyBadges";
import { useState } from "react";

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
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium w-48">{exercise.name}</h3>
          
          <DifficultyBadges
            selectedDifficulties={selectedDifficulties}
            onDifficultyChange={onDifficultyChange}
          />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant={mediaType === 'image' ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType('image')}
                className="min-w-[100px]"
              >
                <Image className="mr-2 h-4 w-4" />
                Photo
              </Button>
              <Button 
                variant={mediaType === 'video' ? "default" : "outline"} 
                size="sm"
                onClick={() => setMediaType('video')}
                className="min-w-[100px]"
              >
                <Video className="mr-2 h-4 w-4" />
                Vidéo
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <UploadForm
                type={mediaType}
                onFileChange={onFileChange}
                onUpload={onUpload}
                selectedFile={selectedFile}
              />

              <Button 
                variant="default" 
                size="sm"
                onClick={onUpload}
                disabled={!selectedFile}
                className="min-w-[100px]"
              >
                <Upload className="mr-2 h-4 w-4" />
                Publier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};