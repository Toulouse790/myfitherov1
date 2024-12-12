import React from 'react';
import { Card } from "@/components/ui/card";

interface TableRelation {
  from: string;
  to: string;
  type: 'one-to-many' | 'many-to-one' | 'many-to-many';
}

interface Route {
  path: string;
  component: string;
  description: string;
}

const applicationRoutes: Route[] = [
  { path: '/', component: 'Index', description: 'Page d\'accueil' },
  { path: '/profile', component: 'Profile', description: 'Profil utilisateur' },
  { path: '/admin/*', component: 'Admin', description: 'Administration' },
  { path: '/workouts', component: 'Workouts', description: 'Liste des entraînements' },
  { path: '/workout/generate', component: 'WorkoutGenerate', description: 'Génération d\'entraînement' },
  { path: '/workout/:sessionId', component: 'UnifiedWorkoutDetail', description: 'Détail d\'une séance' },
  { path: '/cardio', component: 'Cardio', description: 'Entraînement cardio' },
  { path: '/nutrition', component: 'Nutrition', description: 'Suivi nutritionnel' },
  { path: '/stats', component: 'Stats', description: 'Statistiques' },
  { path: '/sleep', component: 'Sleep', description: 'Suivi du sommeil' },
  { path: '/training-preferences', component: 'TrainingPreferences', description: 'Préférences d\'entraînement' }
];

const databaseRelations: TableRelation[] = [
  { from: 'profiles', to: 'questionnaire_responses', type: 'one-to-many' },
  { from: 'profiles', to: 'user_nutrition_preferences', type: 'one-to-many' },
  { from: 'profiles', to: 'workout_templates', type: 'one-to-many' },
  { from: 'profiles', to: 'workout_sessions', type: 'one-to-many' },
  { from: 'profiles', to: 'food_journal_entries', type: 'one-to-many' },
  { from: 'profiles', to: 'user_daily_calories', type: 'one-to-many' },
  { from: 'profiles', to: 'muscle_measurements', type: 'one-to-many' },
  { from: 'profiles', to: 'training_stats', type: 'one-to-many' },
  { from: 'profiles', to: 'user_preferences', type: 'one-to-many' },
  { from: 'profiles', to: 'user_suggested_foods', type: 'one-to-many' },
  { from: 'workout_sessions', to: 'exercise_sets', type: 'one-to-many' },
  { from: 'workout_sessions', to: 'training_stats', type: 'one-to-many' },
];

export const SchemaVisualizer = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Structure de l'Application</h2>
      
      {/* Routes Visualization */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Routes de l'Application</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicationRoutes.map((route, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <div className="font-medium text-primary">{route.path}</div>
                <div className="text-sm font-medium">{route.component}</div>
                <div className="text-sm text-muted-foreground">{route.description}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Database Schema Visualization */}
      <h3 className="text-xl font-semibold mb-4">Schéma de la Base de Données</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databaseRelations.map((relation, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{relation.from}</div>
              <div className="text-sm text-muted-foreground">
                {relation.type === 'one-to-many' ? '1:N' : 
                 relation.type === 'many-to-one' ? 'N:1' : 'N:N'}
              </div>
              <div className="font-medium">{relation.to}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};