import { Button } from "@/components/ui/button";
import { Image, Video, Upload, Check } from "lucide-react";

interface MediaButtonsProps {
  isPublished?: boolean;
  isPublishing?: boolean;
  onPublishToggle?: () => void;
  onImageClick: () => void;
  onVideoClick: () => void;
}

export const MediaButtons = ({
  isPublished = false,
  isPublishing = false,
  onPublishToggle,
  onImageClick,
  onVideoClick,
}: MediaButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
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
      {onPublishToggle && (
        <Button
          variant="outline"
          size="icon"
          onClick={onPublishToggle}
          disabled={isPublishing}
          className={`${
            isPublished 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          {isPublished ? (
            <Check className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};