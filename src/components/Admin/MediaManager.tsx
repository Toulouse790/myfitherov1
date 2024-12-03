import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Video } from "lucide-react";

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // TODO: Implement actual file upload logic
      toast({
        title: "Upload en cours",
        description: `Upload du fichier ${selectedFile.name}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionnaire de médias</h2>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          <Upload className="mr-2 h-4 w-4" />
          Uploader
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Image className="mr-2 h-4 w-4" />
            Images
          </h3>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          <div className="grid gap-4 grid-cols-2">
            {/* Placeholder pour la liste des images */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">Image 1</p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">Image 2</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Video className="mr-2 h-4 w-4" />
            Vidéos
          </h3>
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="mb-4"
          />
          <div className="grid gap-4 grid-cols-2">
            {/* Placeholder pour la liste des vidéos */}
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">Vidéo 1</p>
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">Vidéo 2</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};