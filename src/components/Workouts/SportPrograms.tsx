
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  footballPrograms, 
  basketballPrograms, 
  volleyballPrograms, 
  handballPrograms, 
  hockeyPrograms 
} from "@/data/teamSports";
import { 
  tennisPrograms, 
  runningPrograms, 
  swimmingPrograms, 
  cyclingPrograms 
} from "@/data/individualSports";
import { SportProgram, SportType } from "@/types/sports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const SportPrograms = () => {
  const [selectedType, setSelectedType] = useState<SportType>("team");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const { user } = useAuth();

  // Récupérer les préférences d'emplacement de l'utilisateur
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('available_equipment')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération des préférences:", error);
          return;
        }

        if (data && data.available_equipment && data.available_equipment.length > 0) {
          // Utiliser le premier emplacement préféré de l'utilisateur
          setSelectedLocation(data.available_equipment[0]);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchUserPreferences();
  }, [user]);

  const filterProgramsByLocation = (programs: SportProgram[]) => {
    if (selectedLocation === "all") return programs;
    
    return programs.filter(program => {
      // Vérifier si le programme a des exigences d'équipement ou d'emplacement
      if (!program.requirements) return true;
      
      // Correspondances entre les emplacements dans le profil et les exigences des programmes
      const locationMapping: Record<string, string[]> = {
        "home": ["maison", "domicile", "chez soi", "sans équipement"],
        "gym": ["salle", "salle de sport", "gymnase", "gym"],
        "outdoor": ["extérieur", "plein air", "parc", "terrain"]
      };
      
      // Vérifier si l'une des exigences correspond à l'emplacement sélectionné
      return program.requirements.some(req => {
        const reqLower = req.toLowerCase();
        return locationMapping[selectedLocation]?.some(term => reqLower.includes(term));
      });
    });
  };

  const renderProgram = (program: SportProgram) => (
    <Card key={program.id} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{program.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{program.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.level}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.duration} semaines
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.sessionsPerWeek} séances/semaine
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Objectifs :</h4>
          <ul className="list-disc pl-4 space-y-1">
            {program.goals.map((goal, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Exercices :</h4>
          <div className="space-y-2">
            {program.exercises.map((exercise, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{exercise.name}</p>
                <p className="text-muted-foreground">
                  {exercise.sets} séries × {exercise.reps} répétitions
                  {exercise.notes && ` - ${exercise.notes}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {program.requirements && program.requirements.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Équipement nécessaire :</h4>
            <div className="flex flex-wrap gap-1">
              {program.requirements.map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Filtrer les programmes en fonction de l'emplacement sélectionné
  const filteredTeamPrograms = [
    ...filterProgramsByLocation(footballPrograms),
    ...filterProgramsByLocation(basketballPrograms),
    ...filterProgramsByLocation(volleyballPrograms),
    ...filterProgramsByLocation(handballPrograms),
    ...filterProgramsByLocation(hockeyPrograms)
  ];

  const filteredIndividualPrograms = [
    ...filterProgramsByLocation(tennisPrograms),
    ...filterProgramsByLocation(runningPrograms),
    ...filterProgramsByLocation(swimmingPrograms),
    ...filterProgramsByLocation(cyclingPrograms)
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Programmes sportifs</h2>
        
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Lieu d'entraînement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les lieux</SelectItem>
            <SelectItem value="home">À la maison</SelectItem>
            <SelectItem value="gym">En salle de sport</SelectItem>
            <SelectItem value="outdoor">En extérieur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="team" className="flex-1">Sports collectifs</TabsTrigger>
          <TabsTrigger value="individual" className="flex-1">Sports individuels</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="space-y-4">
          {filteredTeamPrograms.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTeamPrograms.map(renderProgram)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun programme disponible pour le lieu d'entraînement sélectionné.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="individual" className="space-y-4">
          {filteredIndividualPrograms.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredIndividualPrograms.map(renderProgram)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun programme disponible pour le lieu d'entraînement sélectionné.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
