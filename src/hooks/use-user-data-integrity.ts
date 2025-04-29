
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { verifyUserDataIntegrity } from "@/utils/api/user-data-verification";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Hook pour vérifier et assurer l'intégrité des données utilisateur
 * Ce hook s'exécute à chaque connexion pour s'assurer que toutes les tables nécessaires
 * sont correctement initialisées
 */
export function useUserDataIntegrity() {
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const verifyIntegrity = async () => {
      if (!user) {
        setIntegrityVerified(false);
        return;
      }
      
      setIsVerifying(true);
      setError(null);
      
      try {
        debugLogger.log("UserDataIntegrity", "Vérification de l'intégrité des données utilisateur...");
        const result = await verifyUserDataIntegrity(user.id);
        setIntegrityVerified(result);
        
        if (result) {
          debugLogger.log("UserDataIntegrity", "Intégrité des données vérifiée avec succès");
        } else {
          debugLogger.warn("UserDataIntegrity", "Problèmes détectés lors de la vérification de l'intégrité des données");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        debugLogger.error("UserDataIntegrity", `Erreur lors de la vérification: ${error.message}`);
        setError(error);
        setIntegrityVerified(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyIntegrity();
  }, [user]);
  
  return {
    isVerifying,
    integrityVerified,
    error
  };
}
