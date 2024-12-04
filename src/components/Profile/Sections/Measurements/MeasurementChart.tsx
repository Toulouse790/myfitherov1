import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Label } from "@/components/ui/label";
import { measurementLabels } from "./measurementUtils";
import { MeasurementHistory } from "./types";

interface MeasurementChartProps {
  history: MeasurementHistory[];
  selectedMeasure: string;
  setSelectedMeasure: (measure: string) => void;
}

export const MeasurementChart = ({ 
  history, 
  selectedMeasure, 
  setSelectedMeasure 
}: MeasurementChartProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Évolution</Label>
        <select 
          value={selectedMeasure}
          onChange={(e) => setSelectedMeasure(e.target.value)}
          className="p-2 border rounded-md"
        >
          {Object.entries(measurementLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="measurement_date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value) => [`${value} cm`, measurementLabels[selectedMeasure]]}
            />
            <Line 
              type="monotone" 
              dataKey={selectedMeasure} 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};