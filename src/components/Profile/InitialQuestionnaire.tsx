import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const InitialQuestionnaire = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      toast({
        title: "Configuration terminée",
        description: "Vos préférences ont été enregistrées avec succès !",
      });
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Configuration initiale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Objectif principal</h3>
              <p className="text-muted-foreground">
                Quel est votre objectif principal ?
              </p>
              <div className="grid gap-2">
                <Button variant="outline" onClick={handleNext}>
                  Perte de poids
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Prise de masse
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Maintien
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fréquence d'entraînement</h3>
              <p className="text-muted-foreground">
                Combien de fois par semaine souhaitez-vous vous entraîner ?
              </p>
              <div className="grid gap-2">
                <Button variant="outline" onClick={handleNext}>
                  2-3 fois par semaine
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  4-5 fois par semaine
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  6+ fois par semaine
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Niveau d'expérience</h3>
              <p className="text-muted-foreground">
                Quel est votre niveau d'expérience en musculation ?
              </p>
              <div className="grid gap-2">
                <Button variant="outline" onClick={handleNext}>
                  Débutant
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Intermédiaire
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Avancé
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Équipement disponible</h3>
              <p className="text-muted-foreground">
                Quel équipement avez-vous à disposition ?
              </p>
              <div className="grid gap-2">
                <Button variant="outline" onClick={handleNext}>
                  Salle de sport complète
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Équipement à domicile basique
                </Button>
                <Button variant="outline" onClick={handleNext}>
                  Poids du corps uniquement
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Précédent
            </Button>
            <div className="text-sm text-muted-foreground">
              Étape {step} sur 4
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};