
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { debugLogger } from '@/utils/debug-logger';
import { useExerciseTranslation } from '@/hooks/use-exercise-translation';

interface WorkoutCardProps {
  id?: string;
  title: string;
  description?: string;
  duration?: number;
  muscleGroups?: string[];
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  difficulty?: string;
  sessionId?: string;
  exercises?: string[];
  onClick?: () => void;
  onStartWorkout?: () => Promise<void>;
  onSelect?: () => void;
  className?: string;
  isLoading?: boolean;
}

export const WorkoutCard = ({
  id,
  title,
  description,
  duration = 30,
  muscleGroups = [],
  level = 'intermédiaire',
  difficulty,
  sessionId,
  exercises = [],
  onClick,
  onStartWorkout,
  onSelect,
  className,
  isLoading = false
}: WorkoutCardProps) => {
  const { t } = useLanguage();
  const { translateMuscleGroups } = useExerciseTranslation();
  const navigate = useNavigate();
  const [showExercises, setShowExercises] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const translatedMuscleGroups = translateMuscleGroups(muscleGroups);

  const handleCardClick = () => {
    setShowExercises(!showExercises);
    if (onClick) {
      onClick();
    }
  };

  const handleStartWorkout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onStartWorkout) {
      try {
        setIsStarting(true);
        debugLogger.log("WorkoutCard", "Démarrage de l'entraînement", { title, id });
        await onStartWorkout();
      } catch (error) {
        debugLogger.error("WorkoutCard", "Erreur lors du démarrage de l'entraînement", error);
      } finally {
        setIsStarting(false);
      }
    } else if (sessionId) {
      debugLogger.log("WorkoutCard", "Navigation vers session avec ID:", sessionId);
      // Utiliser strictement le format /workouts/session/{id} pour toutes les navigations
      navigate(`/workouts/session/${sessionId}`);
    } else if (onSelect) {
      onSelect();
    }
  };

  // Traduire la difficulté si elle existe
  const getTranslatedDifficulty = (difficultyKey?: string) => {
    if (!difficultyKey) return level;
    
    // Utiliser la clé de traduction "difficulty.[key]"
    return t(`difficulty.${difficultyKey.toLowerCase()}`);
  };

  const displayLevel = difficulty ? getTranslatedDifficulty(difficulty) : getTranslatedDifficulty(level);

  return (
    <Card 
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">
              {title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              className="transition-transform duration-300"
              style={{ transform: showExercises ? 'rotate(90deg)' : 'rotate(0)' }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration} {t('common.min')}</span>
              </div>
            )}
            
            {displayLevel && (
              <Badge variant="outline" className="font-normal">
                {displayLevel}
              </Badge>
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {translatedMuscleGroups && translatedMuscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {translatedMuscleGroups.map((group, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="font-normal text-xs"
                >
                  {group}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div 
          className={`bg-muted/40 divide-y transition-all duration-300 ${
            showExercises ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          {exercises.length > 0 ? (
            exercises.map((exercise, i) => (
              <div key={i} className="p-3 flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-1">
                  <Dumbbell className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{exercise}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              {t('workouts.noExercisesAvailable')}
            </div>
          )}
        </div>

        <div className="p-4 bg-background border-t">
          <Button 
            className="w-full"
            disabled={isStarting || isLoading} 
            onClick={handleStartWorkout}
          >
            {isStarting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
                {t('workouts.startingSession')}
              </>
            ) : (
              <>
                <Dumbbell className="mr-2 h-4 w-4" />
                {t('workouts.startSession')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
