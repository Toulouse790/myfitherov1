import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadFormProps {
  exerciseId: string;
  exerciseName: string;
  type: "image" | "video";
  onSuccess: () => void;
}

export const UploadForm = ({
  exerciseId,
  exerciseName,
  type,
  onSuccess,
}: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    // Implement file upload logic here
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button type="submit" disabled={!file}>
        Upload {type}
      </Button>
    </form>
  );
};