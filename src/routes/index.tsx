import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RootLayout from "@/components/Layout/RootLayout";

// Lazy loading des pages
const Index = lazy(() => import("@/pages/Index"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Workouts = lazy(() => import("@/pages/Workouts"));
const WorkoutSession = lazy(() => import("@/pages/WorkoutSession"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const Profile = lazy(() => import("@/pages/Profile"));
const Stats = lazy(() => import("@/pages/Stats"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Nutrition = lazy(() => import("@/pages/Nutrition"));
const Suggestions = lazy(() => import("@/pages/Suggestions"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));

// Définition des routes principales
const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/workouts", element: <Workouts /> },
      { path: "/workouts/:id", element: <WorkoutSession /> },
      { path: "/workout-generate", element: <WorkoutGenerate /> },
      { path: "/profile", element: <Profile /> },
      { path: "/stats", element: <Stats /> },
      { path: "/sleep", element: <Sleep /> },
      { path: "/nutrition", element: <Nutrition /> },
      { path: "/suggestions", element: <Suggestions /> },
      { path: "/training-preferences", element: <TrainingPreferences /> },
    ],
  },
];

// Fonction pour synchroniser les routes avec Supabase
const syncRoutesToSupabase = async () => {
  try {
    // Vérifier d'abord si l'utilisateur est administrateur
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No user found - skipping route sync");
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      console.log("Not an admin user - skipping route sync");
      return;
    }

    // Récupérer toutes les routes à plat
    const flatRoutes = routes[0].children.map(route => ({
      path: route.path,
      component: route.element.type.name,
      description: `Route for ${route.path}`,
    }));

    // Tenter la synchronisation uniquement en mode développement
    if (process.env.NODE_ENV === 'development') {
      try {
        const { error } = await supabase
          .from('application_routes')
          .upsert(flatRoutes, {
            onConflict: 'path',
            ignoreDuplicates: false
          });

        if (error) {
          // Si l'erreur est liée aux permissions, on log simplement et on continue
          if (error.code === '42501') {
            console.log('Permission denied for route sync - continuing without sync');
            return;
          }
          console.error('Error syncing routes:', error);
        } else {
          console.log('Routes successfully synced to Supabase');
        }
      } catch (error) {
        console.log('Failed to sync routes - continuing without sync');
      }
    }
  } catch (error) {
    console.error('Error in syncRoutesToSupabase:', error);
  }
};

// Créer le router
export const router = createBrowserRouter(routes);

// Synchroniser les routes uniquement si nécessaire
if (process.env.NODE_ENV === 'development') {
  syncRoutesToSupabase();
}