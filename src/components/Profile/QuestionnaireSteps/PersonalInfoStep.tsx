
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface PersonalInfoStepProps {
  age: string;
  weight: string;
  height: string;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  validationMessage?: string | null;
}

export const PersonalInfoStep = ({
  age,
  weight,
  height,
  onAgeChange,
  onWeightChange,
  onHeightChange,
  validationMessage,
}: PersonalInfoStepProps) => {
  // Calculer l'IMC (Indice de Masse Corporelle) si le poids et la taille sont disponibles
  const calculateBMI = () => {
    if (!weight || !height) return null;
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height) / 100; // Convertir en mètres
    if (isNaN(weightValue) || isNaN(heightValue) || heightValue <= 0) return null;
    
    const bmi = weightValue / (heightValue * heightValue);
    return bmi.toFixed(1);
  };

  const bmi = calculateBMI();
  
  // Déterminer la catégorie d'IMC
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Insuffisance pondérale", color: "text-blue-500" };
    if (bmi < 25) return { category: "Corpulence normale", color: "text-green-500" };
    if (bmi < 30) return { category: "Surpoids", color: "text-yellow-500" };
    if (bmi < 35) return { category: "Obésité modérée", color: "text-orange-500" };
    if (bmi < 40) return { category: "Obésité sévère", color: "text-red-500" };
    return { category: "Obésité morbide", color: "text-red-700" };
  };
  
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {validationMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Âge (18-100 ans)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => onAgeChange(e.target.value)}
                placeholder="Votre âge"
                min={18}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (30-300 kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Votre poids en kg"
                min={30}
                max={300}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Taille (130-250 cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => onHeightChange(e.target.value)}
                placeholder="Votre taille en cm"
                min={130}
                max={250}
              />
            </div>

            {bmi && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>IMC:</span>
                    <span className="font-bold">{bmi}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>L'Indice de Masse Corporelle permet d'évaluer votre corpulence</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className={bmiInfo?.color}>{bmiInfo?.category}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
