import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { CombinedWorkoutSelector } from "./CombinedWorkoutSelector";
import { ExerciseSelection } from "./ExerciseSelection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickStartWorkout } from "./QuickStartWorkout";
import { WorkoutGenerator } from "./WorkoutGenerator";
import { RecommendedPrograms } from "./RecommendedPrograms";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { useWorkoutOperations } from "@/hooks/workout/use-workout-operations";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";
export const SimplifiedWorkoutPage = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'selector' | 'exercises' | 'sport'>('selector');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const {
    startWorkout,
    isLoading
  } = useWorkoutOperations();
  const {
    toast
  } = useToast();
  const handleMuscleGroupSelect = (muscleId: string) => {
    setSelectedMuscleGroup(muscleId);
    setCurrentView('exercises');
    debugLogger.log("SimplifiedWorkoutPage", "Groupe musculaire sélectionné:", muscleId);
  };
  const handleSportNavigate = () => {
    navigate('/sport-programs');
  };
  const handleQuickStart = () => {
    // Afficher le modal de démarrage rapide ou naviguer vers cette section
    document.getElementById('quick-start-section')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleExerciseSelectionChange = (exercises: string[]) => {
    setSelectedExercises(exercises);
    debugLogger.log("SimplifiedWorkoutPage", "Exercices sélectionnés:", exercises);
  };
  const handleStartWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: t("workouts.noExercisesFound"),
        description: t("workouts.selectExercisesToStart"),
        variant: "destructive"
      });
      return;
    }
    try {
      debugLogger.log("SimplifiedWorkoutPage", "Démarrage d'une séance avec:", selectedExercises);
      await startWorkout({
        exercises: selectedExercises,
        type: "custom"
      });
    } catch (error) {
      console.error("Erreur lors du démarrage de la séance:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreationError"),
        variant: "destructive"
      });
    }
  };
  const handleBackToSelector = () => {
    setCurrentView('selector');
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 pt-16 pb-24">
        {currentView === 'selector' ? <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {t("workouts.title")}
              </h1>
              
            </div>
            
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">{t("workouts.createSession")}</TabsTrigger>
                <TabsTrigger value="quick">{t("workouts.quickAccessSection")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-6 mt-6">
                <CombinedWorkoutSelector onSelectMuscleGroup={handleMuscleGroupSelect} onNavigateToSport={handleSportNavigate} onQuickStart={handleQuickStart} />
                
                <WorkoutGenerator />
              </TabsContent>
              
              <TabsContent value="quick" className="space-y-6 mt-6" id="quick-start-section">
                <QuickStartWorkout />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("workouts.recommendedForYou")}
                  </h3>
                  <RecommendedPrograms />
                </div>
              </TabsContent>
            </Tabs>
          </div> : currentView === 'exercises' ? <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handleBackToSelector} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("common.back")}
              </Button>
              
              {selectedExercises.length > 0 && <Button size="sm" onClick={handleStartWorkout} disabled={isLoading}>
                  <Dumbbell className="h-4 w-4 mr-2" />
                  {t("workouts.startSession")} ({selectedExercises.length})
                </Button>}
            </div>
            
            <ExerciseSelection selectedExercises={selectedExercises} onSelectionChange={handleExerciseSelectionChange} onClose={handleBackToSelector} muscleGroup={selectedMuscleGroup} />
          </div> : null}
      </div>
    </div>;
};