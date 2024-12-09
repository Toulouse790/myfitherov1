import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface MediaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mediaUrls: { type: 'image' | 'video', url: string }[];
  exerciseName: string;
}

export const MediaPreview = ({ isOpen, onClose, onConfirm, mediaUrls, exerciseName }: MediaPreviewProps) => {
  console.log("MediaPreview - isOpen:", isOpen);
  console.log("MediaPreview - mediaUrls:", mediaUrls);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Prévisualisation des médias pour {exerciseName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {mediaUrls.map((media, index) => (
            <div key={index} className="relative">
              {media.type === 'image' ? (
                <img 
                  src={media.url} 
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video 
                  src={media.url}
                  controls
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" />
            Confirmer la publication
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};