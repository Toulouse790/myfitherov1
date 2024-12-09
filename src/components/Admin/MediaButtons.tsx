import { Button } from "@/components/ui/button";
import { Image, Video, Upload } from "lucide-react";

interface MediaButtonsProps {
  onImageClick: () => void;
  onVideoClick: () => void;
  onPublish: () => void;
  hasMedia: boolean;
}

export const MediaButtons = ({ onImageClick, onVideoClick, onPublish, hasMedia }: MediaButtonsProps) => {
  console.log("MediaButtons - hasMedia:", hasMedia);
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onImageClick}
      >
        <Image className="mr-2 h-4 w-4" />
        Image
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-purple-500 hover:bg-purple-600 text-white"
        onClick={onVideoClick}
      >
        <Video className="mr-2 h-4 w-4" />
        Vidéo
      </Button>
      <Button
        variant="default"
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        onClick={onPublish}
        disabled={!hasMedia}
      >
        <Upload className="mr-2 h-4 w-4" />
        Publier
      </Button>
    </div>
  );
};