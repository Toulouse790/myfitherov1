
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './styles/index.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { debugLogger } from './utils/debug-logger'
import { ThemeProvider } from './components/Theme/ThemeProvider'

// Activer le mode debug pour faciliter le débogage
// On utilise maintenant la nouvelle méthode enable plutôt que enableDebugMode
debugLogger.enable(true);
debugLogger.log("Application", "Initialisation de l'application avec le routeur centralisé");

// Créer une instance de QueryClient avec une configuration optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Désactive le rafraîchissement automatique lors du focus de la fenêtre
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
