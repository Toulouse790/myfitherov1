import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    try {
      setIsUploading(true);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${exerciseId}-${type}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('exercise-media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exercise-media')
        .getPublicUrl(fileName);

      // Update exercise record
      const updateData = type === 'image' 
        ? { image_url: publicUrl }
        : { video_url: publicUrl };

      const { error: updateError } = await supabase
        .from('unified_exercises')
        .update(updateData)
        .eq('id', exerciseId);

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Le média a été téléchargé",
      });

      onSuccess();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le média",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button 
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? "Téléchargement..." : "Télécharger"}
      </Button>
    </div>
  );
};