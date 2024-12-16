import { Dialog } from "@/components/ui/dialog";

interface MediaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mediaUrls: { type: 'image' | 'video'; url: string }[];
  exerciseName: string;
}

export const MediaPreview = ({
  isOpen,
  onClose,
  onConfirm,
  mediaUrls,
  exerciseName,
}: MediaPreviewProps) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4">
        {mediaUrls.map((media, index) => (
          <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`${exerciseName} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};