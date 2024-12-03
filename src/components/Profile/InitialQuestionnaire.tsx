import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface QuestionnaireResponses {
  objective: string;
  training_frequency: string;
  experience_level: string;
  available_equipment: string;
}

export const InitialQuestionnaire = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<QuestionnaireResponses>({
    objective: "",
    training_frequency: "",
    experience_level: "",
    available_equipment: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveResponse = async (finalResponses: QuestionnaireResponses) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour continuer",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    const { error } = await supabase
      .from("questionnaire_responses")
      .insert([
        {
          user_id: user.id,
          ...finalResponses
        }
      ]);

    if (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration terminée",
      description: "Vos préférences ont été enregistrées avec succès !",
    });
    navigate("/");
  };

  const handleNext = async (selectedValue: string) => {
    let updatedResponses = { ...responses };

    // Mettre à jour la réponse correspondante selon l'étape
    switch (step) {
      case 1:
        updatedResponses.objective = selectedValue;
        break;
      case 2:
        updatedResponses.training_frequency = selectedValue;
        break;
      case 3:
        updatedResponses.experience_level = selectedValue;
        break;
      case 4:
        updatedResponses.available_equipment = selectedValue;
        break;
    }

    setResponses(updatedResponses);

    if (step < 4) {
      setStep(step + 1);
    } else {
      await saveResponse(updatedResponses);
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
                <Button variant="outline" onClick={() => handleNext("perte_de_poids")}>
                  Perte de poids
                </Button>
                <Button variant="outline" onClick={() => handleNext("prise_de_masse")}>
                  Prise de masse
                </Button>
                <Button variant="outline" onClick={() => handleNext("maintien")}>
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
                <Button variant="outline" onClick={() => handleNext("2-3_fois")}>
                  2-3 fois par semaine
                </Button>
                <Button variant="outline" onClick={() => handleNext("4-5_fois")}>
                  4-5 fois par semaine
                </Button>
                <Button variant="outline" onClick={() => handleNext("6+_fois")}>
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
                <Button variant="outline" onClick={() => handleNext("debutant")}>
                  Débutant
                </Button>
                <Button variant="outline" onClick={() => handleNext("intermediaire")}>
                  Intermédiaire
                </Button>
                <Button variant="outline" onClick={() => handleNext("avance")}>
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
                <Button variant="outline" onClick={() => handleNext("salle_complete")}>
                  Salle de sport complète
                </Button>
                <Button variant="outline" onClick={() => handleNext("equipement_basique")}>
                  Équipement à domicile basique
                </Button>
                <Button variant="outline" onClick={() => handleNext("poids_du_corps")}>
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