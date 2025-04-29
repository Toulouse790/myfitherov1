
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/Theme/ThemeProvider'; 
import { LanguageProvider } from './contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserDataIntegrity } from './hooks/use-user-data-integrity';
import { useAuth } from './hooks/use-auth';
import { debugLogger } from './utils/debug-logger';

// Création du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { isVerifying, integrityVerified } = useUserDataIntegrity();

  // Journalisation du statut de l'intégrité des données
  useEffect(() => {
    if (user && !isVerifying) {
      debugLogger.log("App", `Statut de l'intégrité des données utilisateur: ${integrityVerified ? "Vérifié" : "Problème détecté"}`);
    }
  }, [user, isVerifying, integrityVerified]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
