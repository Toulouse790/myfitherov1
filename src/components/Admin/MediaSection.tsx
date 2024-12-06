import { MediaGrid } from "./MediaGrid";

interface MediaSectionProps {
  mediaUrls: string[];
  onDelete: (url: string, exerciseName: string, type: 'image' | 'video') => void;
  exerciseName: string;
  type: 'image' | 'video';
}

export const MediaSection = ({ mediaUrls, onDelete, exerciseName, type }: MediaSectionProps) => {
  if (mediaUrls.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">{type === 'image' ? 'Images' : 'Vidéos'}</h4>
      <MediaGrid
        mediaUrls={mediaUrls}
        onDelete={onDelete}
        exerciseName={exerciseName}
        type={type}
      />
    </div>
  );
};