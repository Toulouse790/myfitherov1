
import { Header } from "@/components/Layout/Header";
import { ExerciseList } from "./ExerciseList";
import { ExerciseDetail } from "./ExerciseDetail";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutSession } from "./useWorkoutSession";
import { LoadingState } from "./LoadingState";
import { EmptySessionView } from "./EmptySessionView";
import { SessionHeader } from "./SessionHeader";
import { CurrentExerciseCard } from "./CurrentExerciseCard";
import { FinishWorkoutButton } from "./FinishWorkoutButton";
import { WorkoutSummaryDialog } from "../NextWorkoutDetail/WorkoutSummaryDialog";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";

export const WorkoutSession = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    loading,
    session,
    currentExerciseIndex,
    exerciseProgress,
    showExerciseDetail,
    sessionDuration,
    formatDuration,
    handleExerciseSelect,
    handleExerciseComplete,
    handleCompleteWorkout,
    setShowExerciseDetail,
    showSummaryDialog,
    setShowSummaryDialog,
    workoutStats,
    handleFinishWorkout
  } = useWorkoutSession();

  // Vérification et redirection pour les URL non conformes
  useEffect(() => {
    if (location.pathname.startsWith('/workout-session/')) {
      const sessionId = location.pathname.split('/workout-session/')[1];
      debugLogger.log("WorkoutSession/index", "Redirection depuis ancien format d'URL:", {
        from: location.pathname,
        to: `/workouts/session/${sessionId}`
      });
      navigate(`/workouts/session/${sessionId}`, { replace: true });
    }
  }, [location, navigate]);

  if (loading) {
    return <LoadingState />;
  }

  // Si pas d'exercices dans la session
  if (!session?.exercises || session.exercises.length === 0) {
    return <EmptySessionView />;
  }

  // Calculer la progression globale
  const completedExercises = Object.values(exerciseProgress).filter((ex: any) => ex.completed).length;
  const totalProgress = Math.round((completedExercises / session.exercises.length) * 100);
  
  // L'exercice actuel
  const currentExercise = session.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 pt-20 pb-20">
        {/* En-tête de la séance */}
        <SessionHeader
          sessionName={session.name}
          sessionDuration={sessionDuration}
          formatDuration={formatDuration}
          totalProgress={totalProgress}
          onFinishWorkout={handleCompleteWorkout}
        />
        
        {/* Afficher soit les détails de l'exercice, soit la liste des exercices */}
        {showExerciseDetail ? (
          <ExerciseDetail 
            exerciseName={currentExercise}
            onComplete={handleExerciseComplete}
            onBack={() => setShowExerciseDetail(false)}
            initialSets={exerciseProgress[currentExercise]?.totalSets || 3}
          />
        ) : (
          <>
            {/* Carte de l'exercice actuel */}
            <CurrentExerciseCard 
              currentExercise={currentExercise}
              exerciseProgress={exerciseProgress}
              onStartExercise={() => setShowExerciseDetail(true)}
            />
            
            {/* Liste des exercices */}
            <ExerciseList 
              exercises={session.exercises}
              currentExerciseIndex={currentExerciseIndex}
              exerciseProgress={exerciseProgress}
              onExerciseSelect={handleExerciseSelect}
            />
            
            {/* Bouton pour terminer la séance */}
            <FinishWorkoutButton onCompleteWorkout={handleCompleteWorkout} />
          </>
        )}

        {/* Dialog de résumé de l'entraînement */}
        <WorkoutSummaryDialog
          open={showSummaryDialog} 
          onOpenChange={setShowSummaryDialog}
          stats={workoutStats}
          onConfirm={handleFinishWorkout}
        />
      </div>
    </div>
  );
};
