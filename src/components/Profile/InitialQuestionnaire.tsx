import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuestionnaireData {
  objective: string;
  activityLevel: string;
  weight: string;
  height: string;
  age: string;
  workoutsPerWeek: string;
  sleepHours: string;
  hasAllergies: boolean;
  allergies: string[];
  dietaryRestrictions: string[];
}

const commonAllergies = [
  "Arachides",
  "Fruits à coque",
  "Lait",
  "Œufs",
  "Poisson",
  "Crustacés",
  "Soja",
  "Blé",
  "Gluten",
];

export const InitialQuestionnaire = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objective: "",
    activityLevel: "",
    weight: "",
    height: "",
    age: "",
    workoutsPerWeek: "",
    sleepHours: "",
    hasAllergies: false,
    allergies: [],
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

  const handleAllergyChange = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
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
            <h3 className="font-medium">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workoutsPerWeek">Entraînements par semaine</Label>
                <Input
                  id="workoutsPerWeek"
                  type="number"
                  value={formData.workoutsPerWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, workoutsPerWeek: e.target.value })
                  }
                />
              </div>
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Allergies et restrictions alimentaires</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAllergies"
                checked={formData.hasAllergies}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, hasAllergies: checked as boolean })
                }
              />
              <Label htmlFor="hasAllergies">J'ai des allergies alimentaires</Label>
            </div>
            
            {formData.hasAllergies && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Sélectionner mes allergies</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Allergies alimentaires</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    {commonAllergies.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={() => handleAllergyChange(allergy)}
                        />
                        <Label htmlFor={allergy}>{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
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