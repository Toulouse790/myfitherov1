import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RootLayout } from "./components/Layout/RootLayout";

// Pages avec chargement différé
const Home = lazy(() => import("./pages/Home"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const Questionnaire = lazy(() => import("./pages/Questionnaire"));
const Workouts = lazy(() => import("./pages/Workouts"));
const SportPrograms = lazy(() => import("./pages/SportPrograms"));
const Cardio = lazy(() => import("./pages/Cardio"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const Stats = lazy(() => import("./pages/Stats"));
const Sleep = lazy(() => import("./pages/Sleep"));
const TrainingPreferences = lazy(() => import("./pages/TrainingPreferences"));
const WorkoutGenerate = lazy(() => import("./pages/WorkoutGenerate"));
const UnifiedWorkoutDetail = lazy(() => import("./components/Workouts/UnifiedWorkoutDetail"));
const NextWorkoutDetail = lazy(() => import("./components/Workouts/NextWorkoutDetail"));
const ExerciseLibrary = lazy(() => import("./components/Workouts/ExerciseLibrary"));
const SportSpecificExercises = lazy(() => import("./pages/SportSpecificExercises"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Suggestions = lazy(() => import("./pages/Suggestions"));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/signin" element={<Suspense fallback={<div>Chargement...</div>}><SignIn /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={<div>Chargement...</div>}><SignUp /></Suspense>} />
          
          {/* Routes protégées */}
          <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
            <Route path="/" element={<Suspense fallback={<div>Chargement...</div>}><Home /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<div>Chargement...</div>}><Profile /></Suspense>} />
            <Route path="/questionnaire" element={<Suspense fallback={<div>Chargement...</div>}><Questionnaire /></Suspense>} />
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
            <Route path="/sport-specific-exercises/:sportId/:positionId" element={<Suspense fallback={<div>Chargement...</div>}><SportSpecificExercises /></Suspense>} />
            <Route path="/subscription-plans" element={<Suspense fallback={<div>Chargement...</div>}><SubscriptionPlans /></Suspense>} />
            <Route path="/admin/*" element={<Suspense fallback={<div>Chargement...</div>}><AdminPanel /></Suspense>} />
            <Route path="/suggestions" element={<Suspense fallback={<div>Chargement...</div>}><Suggestions /></Suspense>} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
