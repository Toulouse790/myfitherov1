import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadFormProps {
  exerciseId: string;
  exerciseName: string;
  type: "image" | "video";
  onSuccess: () => void;
}

export const UploadForm = ({ exerciseId, exerciseName, type, onSuccess }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
          exercise_id: exerciseId,
          exercise_name: exerciseName,
          media_type: type,
          media_url: publicUrl,
        });

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Média téléchargé avec succès",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le fichier",
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
        onChange={(e) => setFile(e.target.files?.[0] || null)}
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