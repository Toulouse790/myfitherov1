import { Input } from "@/components/ui/input";

interface UploadFormProps {
  exercise_id: string;
  type: "image" | "video";
  onUpload: () => void;
  selectedFile: File | null;
}

export const UploadForm = ({ type, exercise_id, onUpload, selectedFile }: UploadFormProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        onChange={onUpload}
        className="w-[200px]"
      />
    </div>
  );
};