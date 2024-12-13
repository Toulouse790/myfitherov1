import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import { Workouts } from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Stats from "@/pages/Stats";
import Sleep from "@/pages/Sleep";
import TrainingPreferences from "@/pages/TrainingPreferences";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import Cardio from "@/pages/Cardio";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/*" element={<Admin />} />
      <Route 
        path="/workouts" 
        element={
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workout/generate" 
        element={
          <ProtectedRoute>
            <WorkoutGenerate />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/workout/:sessionId" 
        element={
          <ProtectedRoute>
            <UnifiedWorkoutDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cardio" 
        element={
          <ProtectedRoute>
            <Cardio />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/nutrition" 
        element={
          <ProtectedRoute>
            <Nutrition />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stats" 
        element={
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sleep" 
        element={
          <ProtectedRoute>
            <Sleep />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/training-preferences" 
        element={
          <ProtectedRoute>
            <TrainingPreferences />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/initial-questionnaire" 
        element={
          <ProtectedRoute>
            <InitialQuestionnaire />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/signin" 
        element={
          user ? <Navigate to="/" replace /> : <SignIn />
        } 
      />
      <Route 
        path="/signup" 
        element={
          user ? <Navigate to="/" replace /> : <SignUp />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};