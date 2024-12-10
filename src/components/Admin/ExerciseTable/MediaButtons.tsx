import { Button } from "@/components/ui/button";
import { Image, Video, Globe, GlobeSlash } from "lucide-react";

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
        onClick={onImageClick}
        className="h-8 w-8"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onVideoClick}
        className="h-8 w-8"
      >
        <Video className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onPublishToggle}
        disabled={isPublishing}
        className="h-8 w-8"
      >
        {isPublished ? (
          <Globe className="h-4 w-4" />
        ) : (
          <GlobeSlash className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};