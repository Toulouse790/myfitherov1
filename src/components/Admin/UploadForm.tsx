import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadFormProps {
  exercise_id: string;
  type: "image" | "video";
  onUpload: () => void;
  selectedFile: File | null;
}

export const UploadForm = ({ type, exercise_id, onUpload }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('exercise-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('exercise-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('exercise_media')
        .insert({
          exercise_id,
          media_type: type,
          media_url: publicUrl
        });

      if (dbError) throw dbError;

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