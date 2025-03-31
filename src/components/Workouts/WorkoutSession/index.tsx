
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

export const WorkoutSession = () => {
  const { t } = useLanguage();
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
    setShowExerciseDetail
  } = useWorkoutSession();

  if (loading) {
    return <LoadingState />;
  }

  // Si pas d'exercices dans la session
  if (!session?.exercises || session.exercises.length === 0) {
    return <EmptySessionView />;
  }

  // Calculer la progression globale
  const completedExercises = Object.values(exerciseProgress).filter(ex => ex.completed).length;
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
        />
        
        {/* Afficher soit les détails de l'exercice, soit la liste des exercices */}
        {showExerciseDetail ? (
          <ExerciseDetail 
            exerciseName={currentExercise}
            onComplete={handleExerciseComplete}
            onBack={() => setShowExerciseDetail(false)}
            initialSets={exerciseProgress[currentExercise]?.totalSets}
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
          </>
        )}
        
        {/* Bouton pour terminer la séance */}
        <FinishWorkoutButton onCompleteWorkout={handleCompleteWorkout} />
      </div>
    </div>
  );
};
