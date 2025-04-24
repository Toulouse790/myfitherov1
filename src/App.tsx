
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { debugLogger } from "./utils/debug-logger";

// Ce fichier n'est plus utilisé pour le routage
// Le routage est maintenant centralisé dans src/routes/index.tsx
// Voir le fichier main.tsx pour l'utilisation du routeur

export default function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('./utils/translation-validator').then(({ checkTranslations }) => {
        checkTranslations();
      });
    }
  }, []);

  debugLogger.log("App", "Composant App rendu, mais n'est plus utilisé pour le routage");
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Chargement...</div>}>
        <div className="flex items-center justify-center h-screen p-4 text-center">
          <p>Cette application utilise désormais le routeur dans src/routes/index.tsx</p>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
