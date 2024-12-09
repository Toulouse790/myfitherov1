import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadFormProps {
  exercise_id: string;
  exercise_name: string;
  type: "image" | "video";
  onUpload: () => void;
  selectedFile: File | null;
  difficulty: string[];
  location: string[];
}

export const UploadForm = ({ 
  type, 
  exercise_id,
  exercise_name,
  onUpload,
  difficulty,
  location,
  selectedFile: initialSelectedFile
}: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(initialSelectedFile);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  console.log("UploadForm - Initial props:", {
    exercise_id,
    exercise_name,
    type,
    difficulty,
    location,
    file
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log("Starting upload process with data:", {
        file_name: file.name,
        exercise_id,
        exercise_name,
        type,
        difficulty,
        location
      });

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('exercise-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully:", uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('exercise-media')
        .getPublicUrl(filePath);

      console.log("Inserting media record with data:", {
        exercise_id,
        exercise_name,
        media_type: type,
        media_url: publicUrl,
        difficulty: Array.isArray(difficulty) ? difficulty : [],
        location: Array.isArray(location) ? location : []
      });

      const { error: dbError } = await supabase
        .from('exercise_media')
        .insert({
          exercise_id,
          exercise_name,
          media_type: type,
          media_url: publicUrl,
          difficulty: Array.isArray(difficulty) ? difficulty : [],
          location: Array.isArray(location) ? location : []
        });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      toast({
        title: "Succès",
        description: "Le fichier a été téléchargé avec succès",
      });

      setFile(null);
      onUpload();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={handleFileChange}
        className="w-[200px]"
      />
      <Button 
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Téléchargement..." : "Télécharger"}
      </Button>
    </div>
  );
};