import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const NotesInput = ({ value, onChange, disabled }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notes</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Ajoutez des notes sur votre série..."
        className="h-20 resize-none"
      />
    </div>
  );
};