import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MediaGridProps {
  mediaUrls: string[];
  onDelete: (url: string, exerciseName: string, type: 'image' | 'video') => void;
  exerciseName: string;
  type: 'image' | 'video';
}

export const MediaGrid = ({ mediaUrls, onDelete, exerciseName, type }: MediaGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {mediaUrls.map((mediaUrl, index) => (
        <div key={index} className="relative group">
          <div className={`${
            type === "image" ? "aspect-square" : "aspect-video"
          } bg-gray-100 rounded-lg overflow-hidden`}>
            {type === "image" ? (
              <img 
                src={mediaUrl} 
                alt={`${type} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video 
                src={mediaUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(mediaUrl, exerciseName, type)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};