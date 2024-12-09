import { ExerciseMedia } from "@/types/exercise-media";

export interface MediaSectionProps {
  mediaUrls: string[];
  onDelete: (url: string, exerciseName: string, type: 'image' | 'video') => void;
  exerciseName: string;
  type: 'image' | 'video';
}

export interface MediaManagerProps {
  exercise: {
    id: string;
    name: string;
  };
  media: ExerciseMedia[];
  onUpload: () => void;
}

export interface UploadSectionProps {
  showImageUpload: boolean;
  showVideoUpload: boolean;
  exercise: {
    id: string;
    name: string;
    difficulty: string[];
    location?: string[];
  };
  onUpload: () => void;
  selectedFile: File | null;
}