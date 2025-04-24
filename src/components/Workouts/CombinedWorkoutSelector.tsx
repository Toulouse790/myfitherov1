
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MuscleGroupCard } from "./components/MuscleGroupCard";
import { muscleGroups } from "./workoutConstants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Footprints } from "lucide-react";
import { motion } from "framer-motion";
import { debugLogger } from "@/utils/debug-logger";

interface CombinedWorkoutSelectorProps {
  onSelectMuscleGroup: (muscleId: string) => void;
  onNavigateToSport: () => void;
  onQuickStart: () => void;
}

export const CombinedWorkoutSelector = ({
  onSelectMuscleGroup,
  onNavigateToSport,
  onQuickStart
}: CombinedWorkoutSelectorProps) => {
  const { t } = useLanguage();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  const handleMuscleGroupClick = (muscleId: string) => {
    setSelectedMuscleGroup(previousId => {
      // Toggle selection if clicking the same group
      const newSelection = previousId === muscleId ? null : muscleId;
      
      if (newSelection) {
        debugLogger.log("CombinedWorkoutSelector", "Groupe musculaire sélectionné:", newSelection);
        onSelectMuscleGroup(newSelection);
      }
      
      return newSelection;
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-center mb-4">
        <Button 
          variant="outline" 
          className="relative overflow-hidden group"
          onClick={onQuickStart}
        >
          <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          <span className="relative">
            {t("difficulty.quickStart") || "Démarrage rapide"} ⚡
          </span>
        </Button>
      </div>

      <Tabs defaultValue="muscles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="muscles">
            <Dumbbell className="h-4 w-4 mr-2" />
            {t("workouts.byMuscleGroup") || "Par groupe musculaire"}
          </TabsTrigger>
          <TabsTrigger value="sport" onClick={onNavigateToSport}>
            <Footprints className="h-4 w-4 mr-2" />
            {t("workouts.bySport") || "Par sport"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="muscles" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {muscleGroups.map((muscle) => (
                  <MuscleGroupCard
                    key={muscle.id}
                    id={muscle.id}
                    name={muscle.name}
                    isSelected={selectedMuscleGroup === muscle.id}
                    onClick={() => handleMuscleGroupClick(muscle.id)}
                  />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Badge variant="outline" className="text-xs">
                  {t("workouts.selectToSeeExercises") || "Sélectionnez pour voir les exercices"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sport">
          {/* Le contenu pour l'onglet sport sera géré par la redirection */}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
