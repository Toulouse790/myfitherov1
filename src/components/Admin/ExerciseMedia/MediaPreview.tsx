import { Card } from "@/components/ui/card";

interface MediaPreviewProps {
  imageUrl?: string;
  videoUrl?: string;
  exerciseName: string;
}

export const MediaPreview = ({ imageUrl, videoUrl, exerciseName }: MediaPreviewProps) => {
  if (!imageUrl && !videoUrl) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={exerciseName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {videoUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};