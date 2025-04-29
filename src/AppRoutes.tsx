
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import Index from './pages/Index';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import Stats from './pages/Stats';
import Nutrition from './pages/Nutrition';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import DashboardOverview from './pages/Dashboard/Overview';
import SubscriptionPlans from './pages/SubscriptionPlans';
import RootLayout from './components/Layout/RootLayout';
import { AuthenticatedLayout } from './components/Layout/AuthenticatedLayout';
import Sleep from './pages/Sleep';

export const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  // Si l'authentification est en cours de chargement, on affiche un loader
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Page d'accueil qui gère la redirection selon l'état d'authentification */}
        <Route path="/" element={<Index />} />
        
        {/* Pages d'authentification accessibles uniquement quand NON connecté */}
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp />}
        />
        
        {/* Routes protégées accessibles uniquement quand connecté */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workouts/*" element={<Workouts />} />
            <Route path="/stats/*" element={<Stats />} />
            <Route path="/dashboard/*" element={<DashboardOverview />} />
            <Route path="/nutrition/*" element={<Nutrition />} />
            <Route path="/sleep/*" element={<Sleep />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          </Route>
        </Route>
      </Route>
      
      {/* Route par défaut (404) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
