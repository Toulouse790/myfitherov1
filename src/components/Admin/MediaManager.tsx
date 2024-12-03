import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { muscleGroups } from "../Workouts/workoutConstants";

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(muscleGroups[0].id);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: {images: string[], videos: string[]}}>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        // Créer un objet URL pour le fichier
        const fileUrl = URL.createObjectURL(selectedFile);
        
        // Mettre à jour l'état des fichiers téléchargés
        setUploadedFiles(prev => ({
          ...prev,
          [selectedMuscleGroup]: {
            images: selectedFile.type.startsWith('image/') 
              ? [...(prev[selectedMuscleGroup]?.images || []), fileUrl]
              : (prev[selectedMuscleGroup]?.images || []),
            videos: selectedFile.type.startsWith('video/')
              ? [...(prev[selectedMuscleGroup]?.videos || []), fileUrl]
              : (prev[selectedMuscleGroup]?.videos || [])
          }
        }));

        toast({
          title: "Fichier téléchargé avec succès",
          description: `${selectedFile.name} a été ajouté à la bibliothèque de ${
            muscleGroups.find(group => group.id === selectedMuscleGroup)?.name
          }`,
        });

        // Réinitialiser le fichier sélectionné
        setSelectedFile(null);
      } catch (error) {
        toast({
          title: "Erreur lors du téléchargement",
          description: "Une erreur est survenue lors du téléchargement du fichier.",
          variant: "destructive",
        });
      }
    }
  };

  const MediaUploadSection = ({ type }: { type: "image" | "video" }) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button onClick={handleUpload} disabled={!selectedFile}>
          <Upload className="mr-2 h-4 w-4" />
          Uploader
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {uploadedFiles[selectedMuscleGroup]?.[type === "image" ? "images" : "videos"]?.map((fileUrl, index) => (
          <div 
            key={index}
            className={`${
              type === "image" ? "aspect-square" : "aspect-video"
            } bg-gray-100 rounded-lg overflow-hidden`}
          >
            {type === "image" ? (
              <img 
                src={fileUrl} 
                alt={`${type} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video 
                src={fileUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionnaire de médias</h2>
      </div>

      <Tabs defaultValue={muscleGroups[0].id} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {muscleGroups.map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              onClick={() => setSelectedMuscleGroup(group.id)}
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {muscleGroups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Images - {group.name}
              </h3>
              <MediaUploadSection type="image" />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Video className="mr-2 h-4 w-4" />
                Vidéos - {group.name}
              </h3>
              <MediaUploadSection type="video" />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};