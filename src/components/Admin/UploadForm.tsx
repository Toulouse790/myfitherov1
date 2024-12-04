import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface UploadFormProps {
  type: "image" | "video";
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
}

export const UploadForm = ({ type, onFileChange, selectedFile }: UploadFormProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={onFileChange}
        className="flex-1 text-sm"
      />
    </div>
  );
};