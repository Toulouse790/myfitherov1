import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface UploadFormProps {
  type: "image" | "video";
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
}

export const UploadForm = ({ type, onFileChange, onUpload, selectedFile }: UploadFormProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={onFileChange}
        className="flex-1"
      />
      <Button onClick={onUpload} disabled={!selectedFile}>
        <Upload className="mr-2 h-4 w-4" />
        Uploader
      </Button>
    </div>
  );
};