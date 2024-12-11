import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export const NotesInput = ({ notes, onNotesChange }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notes</label>
      <Textarea
        placeholder="Ajouter des notes sur cette série..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="resize-none"
        rows={2}
      />
    </div>
  );
};