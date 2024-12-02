import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface QuestionnaireData {
  objective: string;
  activityLevel: string;
  weight: string;
  height: string;
  sleepHours: string;
  dietaryRestrictions: string[];
}

export const InitialQuestionnaire = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objective: "",
    activityLevel: "",
    weight: "",
    height: "",
    sleepHours: "",
    dietaryRestrictions: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourrez ajouter la logique pour sauvegarder les données
    toast({
      title: "Profil complété !",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Quel est votre objectif principal ?</h3>
            <RadioGroup
              value={formData.objective}
              onValueChange={(value) =>
                setFormData({ ...formData, objective: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss">Perte de poids</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                <Label htmlFor="muscle_gain">Prise de masse musculaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance">Maintien de la forme</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Quel est votre niveau d'activité ?</h3>
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, activityLevel: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sedentary" id="sedentary" />
                <Label htmlFor="sedentary">Sédentaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate">Modérément actif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">Très actif</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep">Heures de sommeil moyennes</Label>
              <Input
                id="sleep"
                type="number"
                value={formData.sleepHours}
                onChange={(e) =>
                  setFormData({ ...formData, sleepHours: e.target.value })
                }
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Questionnaire initial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              >
                Suivant
              </Button>
            ) : (
              <Button type="submit">Terminer</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};