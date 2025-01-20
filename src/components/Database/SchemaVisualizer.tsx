import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TableRelation {
  from: string;
  to: string;
  type: 'one-to-many' | 'many-to-one' | 'many-to-many';
}

interface Route {
  path: string;
  component: string;
  description: string;
  isProtected?: boolean;
}

const applicationRoutes: Route[] = [
  { path: '/', component: 'Index', description: 'Page d\'accueil', isProtected: true },
  { path: '/signin', component: 'SignIn', description: 'Connexion' },
  { path: '/signup', component: 'SignUp', description: 'Inscription' },
  { path: '/profile', component: 'Profile', description: 'Profil utilisateur', isProtected: true },
  { path: '/initial-questionnaire', component: 'InitialQuestionnaire', description: 'Questionnaire initial', isProtected: true },
  { path: '/admin/*', component: 'Admin', description: 'Administration', isProtected: true },
  { path: '/workouts', component: 'Workouts', description: 'Liste des entraînements', isProtected: true },
  { path: '/workout/generate', component: 'WorkoutGenerate', description: 'Génération d\'entraînement', isProtected: true },
  { path: '/workout/:sessionId', component: 'UnifiedWorkoutDetail', description: 'Détail d\'une séance', isProtected: true },
  { path: '/cardio', component: 'Cardio', description: 'Entraînement cardio', isProtected: true },
  { path: '/nutrition', component: 'Nutrition', description: 'Suivi nutritionnel', isProtected: true },
  { path: '/stats', component: 'Stats', description: 'Statistiques', isProtected: true },
  { path: '/sleep', component: 'Sleep', description: 'Suivi du sommeil', isProtected: true },
  { path: '/training-preferences', component: 'TrainingPreferences', description: 'Préférences d\'entraînement', isProtected: true }
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
  { from: 'workout_sessions', to: 'exercise_sets', type: 'one-to-many' },
  { from: 'workout_sessions', to: 'training_stats', type: 'one-to-many' },
];

const mainFeatures = {
  workout: [
    "Création et suivi des séances d'entraînement",
    "Bibliothèque d'exercices personnalisables",
    "Suivi de la progression et des records",
    "Génération de programmes adaptés",
    "Gestion du cardio"
  ],
  nutrition: [
    "Journal alimentaire quotidien",
    "Planification des repas",
    "Calcul des macronutriments",
    "Suggestions de repas personnalisés",
    "Suivi des objectifs caloriques"
  ],
  sleep: [
    "Enregistrement des cycles de sommeil",
    "Analyse de la qualité du sommeil",
    "Recommandations personnalisées",
    "Historique du sommeil"
  ],
  gamification: [
    "Système de points et niveaux",
    "Badges et récompenses",
    "Objectifs personnalisés",
    "Suivi des achievements"
  ]
};

export const SchemaVisualizer = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="routes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="auth">Authentification</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Routes de l'Application</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applicationRoutes.map((route, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <div className="font-medium text-primary">{route.path}</div>
                  <div className="text-sm font-medium">{route.component}</div>
                  <div className="text-sm text-muted-foreground">{route.description}</div>
                  {route.isProtected && (
                    <div className="text-xs text-yellow-600">Authentification requise</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Relations de la Base de Données</h3>
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
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Fonctionnalités Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Object.entries(mainFeatures).map(([domain, features]) => (
              <Card key={domain} className="p-4">
                <h4 className="text-lg font-semibold capitalize mb-3">{domain}</h4>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="auth" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Flux d'Authentification</h3>
          <div className="grid grid-cols-1 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-2">Points d'Entrée</h4>
              <ul className="space-y-2 text-sm">
                <li>1. Inscription (/signup)</li>
                <li>2. Connexion (/signin)</li>
                <li>3. Questionnaire Initial (/initial-questionnaire)</li>
                <li>4. Redirection vers l'accueil (/)</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium mb-2">Sécurité</h4>
              <ul className="space-y-2 text-sm">
                <li>• Authentification gérée par Supabase</li>
                <li>• Routes protégées avec ProtectedRoute</li>
                <li>• Politiques RLS sur les tables</li>
                <li>• Gestion des sessions utilisateur</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};