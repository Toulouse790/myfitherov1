
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RootLayout } from "./components/Layout/RootLayout";

// Pages avec chargement différé
const Home = lazy(() => import("./pages/Home"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const Workouts = lazy(() => import("./pages/Workouts"));
const SportPrograms = lazy(() => import("./pages/SportPrograms"));
const Cardio = lazy(() => import("./pages/Cardio"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Stats = lazy(() => import("./pages/Stats"));
const Sleep = lazy(() => import("./pages/Sleep"));
const TrainingPreferences = lazy(() => import("./pages/TrainingPreferences"));
const WorkoutGenerate = lazy(() => import("./pages/WorkoutGenerate"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const Suggestions = lazy(() => import("./pages/Suggestions"));

// Importation correcte des composants sans export par défaut
const UnifiedWorkoutDetail = lazy(() => 
  import("./components/Workouts/UnifiedWorkoutDetail").then(module => ({ 
    default: () => <module.UnifiedWorkoutDetail /> 
  }))
);

const NextWorkoutDetail = lazy(() => 
  import("./components/Workouts/NextWorkoutDetail").then(module => ({ 
    default: () => <module.NextWorkoutDetail /> 
  }))
);

const ExerciseLibrary = lazy(() => import("./components/Workouts/ExerciseLibrary"));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/signin" element={<Suspense fallback={<div>Chargement...</div>}><SignIn /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<div>Chargement...</div>}><SignUp /></Suspense>} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Suspense fallback={<div>Chargement...</div>}><Home /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<div>Chargement...</div>}><Profile /></Suspense>} />
              <Route path="/workouts/*" element={<Suspense fallback={<div>Chargement...</div>}><Workouts /></Suspense>} />
              <Route path="/sport-programs" element={<Suspense fallback={<div>Chargement...</div>}><SportPrograms /></Suspense>} />
              <Route path="/cardio" element={<Suspense fallback={<div>Chargement...</div>}><Cardio /></Suspense>} />
              <Route path="/nutrition" element={<Suspense fallback={<div>Chargement...</div>}><Nutrition /></Suspense>} />
              <Route path="/stats" element={<Suspense fallback={<div>Chargement...</div>}><Stats /></Suspense>} />
              <Route path="/sleep" element={<Suspense fallback={<div>Chargement...</div>}><Sleep /></Suspense>} />
              <Route path="/training-preferences" element={<Suspense fallback={<div>Chargement...</div>}><TrainingPreferences /></Suspense>} />
              <Route path="/workouts/generate" element={<Suspense fallback={<div>Chargement...</div>}><WorkoutGenerate /></Suspense>} />
              <Route path="/workouts/:sessionId" element={<Suspense fallback={<div>Chargement...</div>}><UnifiedWorkoutDetail /></Suspense>} />
              <Route path="/workouts/exercise/next-workout" element={<Suspense fallback={<div>Chargement...</div>}><NextWorkoutDetail /></Suspense>} />
              <Route path="/workouts/library" element={<Suspense fallback={<div>Chargement...</div>}><ExerciseLibrary /></Suspense>} />
              <Route path="/subscription-plans" element={<Suspense fallback={<div>Chargement...</div>}><SubscriptionPlans /></Suspense>} />
              <Route path="/suggestions" element={<Suspense fallback={<div>Chargement...</div>}><Suggestions /></Suspense>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
