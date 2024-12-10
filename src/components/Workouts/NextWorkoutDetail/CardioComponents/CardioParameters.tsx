import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface CardioParametersProps {
  exercise: any;
  parameters: { [key: string]: number | string };
  onParameterChange: (param: string, value: number | string) => void;
}

export const CardioParameters = ({
  exercise,
  parameters,
  onParameterChange
}: CardioParametersProps) => {
  const renderParameterInput = (paramName: string, paramConfig: any) => {
    if (paramConfig.options) {
      return (
        <Select
          value={parameters[paramName]?.toString()}
          onValueChange={(value) => onParameterChange(paramName, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Sélectionner ${paramName}`} />
          </SelectTrigger>
          <SelectContent>
            {paramConfig.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{paramName}</span>
          <span>{parameters[paramName]} {paramConfig.unit}</span>
        </div>
        <Slider
          value={[parameters[paramName] as number]}
          min={paramConfig.min}
          max={paramConfig.max}
          step={1}
          onValueChange={(value) => onParameterChange(paramName, value[0])}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(exercise.parameters).map(([param, config]) => (
        <div key={param} className="space-y-2">
          <label className="text-sm font-medium">{param}</label>
          {renderParameterInput(param, config)}
        </div>
      ))}
    </div>
  );
};