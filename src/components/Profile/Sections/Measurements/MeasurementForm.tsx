import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { measurementLabels } from "./measurementUtils";
import { MeasurementFormData } from "./types";

interface MeasurementFormProps {
  measurements: MeasurementFormData;
  setMeasurements: (measurements: MeasurementFormData) => void;
}

export const MeasurementForm = ({ measurements, setMeasurements }: MeasurementFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      {Object.entries(measurementLabels).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type="number"
            inputMode="numeric"
            step="0.1"
            value={measurements[key as keyof MeasurementFormData]}
            onChange={(e) => setMeasurements({
              ...measurements,
              [key]: e.target.value
            })}
            placeholder="0.0"
          />
        </div>
      ))}
    </div>
  );
};