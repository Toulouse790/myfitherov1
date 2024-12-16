import { Button } from "@/components/ui/button";
import { Image, Video } from "lucide-react";

interface MediaButtonsProps {
  isPublished: boolean;
  isPublishing: boolean;
  onPublishToggle: () => void;
  onImageClick: () => void;
  onVideoClick: () => void;
}

export const MediaButtons = ({
  isPublished,
  isPublishing,
  onPublishToggle,
  onImageClick,
  onVideoClick,
}: MediaButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={onImageClick}
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="bg-purple-500 hover:bg-purple-600 text-white"
        onClick={onVideoClick}
      >
        <Video className="h-4 w-4" />
      </Button>
    </div>
  );
};