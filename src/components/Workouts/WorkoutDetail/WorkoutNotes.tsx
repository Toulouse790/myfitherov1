import { Textarea } from "@/components/ui/textarea";

interface WorkoutNotesProps {
  notes: string;
  onChange: (value: string) => void;
}

export const WorkoutNotes = ({ notes, onChange }: WorkoutNotesProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-gray-900 font-medium">Notes</h3>
      <Textarea
        placeholder="Ajouter des notes..."
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border text-gray-900 placeholder:text-gray-500"
      />
    </div>
  );
};