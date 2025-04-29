
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { Toaster } from './components/ui/toaster';
import { useUserDataIntegrity } from './hooks/use-user-data-integrity';
import { useAuth } from './hooks/use-auth';
import { debugLogger } from './utils/debug-logger';

export function App() {
  const { user, loading: authLoading } = useAuth();
  const { isVerifying, integrityVerified } = useUserDataIntegrity();

  // Journalisation du statut de l'intégrité des données
  React.useEffect(() => {
    if (user && !isVerifying) {
      debugLogger.log("App", `Statut de l'intégrité des données utilisateur: ${integrityVerified ? "Vérifié" : "Problème détecté"}`);
    }
    
    debugLogger.log("App", "Rendu de l'application principale", { 
      isAuthenticated: !!user,
      isLoading: authLoading
    });
  }, [user, isVerifying, integrityVerified, authLoading]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
