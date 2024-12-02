import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WaterTracker = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const { toast } = useToast();
  const goal = 2500; // 2.5L in ml

  const handleAddWater = (amount: number) => {
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);
    
    if (amount > 0) {
      toast({
        title: "Eau ajoutée",
        description: `${amount}ml d'eau ajoutés à votre suivi`,
      });
    }
  };

  const progress = (waterIntake / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          Suivi de l'eau
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{waterIntake}ml</span>
            <span className="text-sm text-muted-foreground">
              Objectif: {goal}ml
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddWater(-250)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleAddWater(250)}
            >
              Ajouter 250ml
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddWater(500)}
            >
              +500ml
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};