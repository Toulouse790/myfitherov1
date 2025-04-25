
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToastWithTranslation } from "@/hooks/use-toast-with-translation";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const AccountActions = () => {
  const { toastFromKey } = useToastWithTranslation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Le toast sera géré par l'événement onAuthStateChange
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toastFromKey('auth.logoutError', 'auth.logoutErrorMessage', { variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Utilisateur non connecté");

      // D'abord supprimer les données de l'utilisateur dans la base de données
      // Ceci devrait être adapté selon votre structure de données
      const { error: dbError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
        
      if (dbError) {
        console.error('Erreur lors de la suppression des données:', dbError);
        // Continuer quand même avec la suppression du compte
      }

      // Supprimer le compte utilisateur
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      // Déconnecter l'utilisateur
      await supabase.auth.signOut();
      
      toastFromKey('auth.accountDeleted', 'auth.accountDeletedMessage');
      
      // Rediriger vers la page d'accueil
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toastFromKey('auth.deleteError', 'auth.deleteErrorMessage', { variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full flex justify-center items-center gap-2" 
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>{t('auth.signOut')}</span>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="w-full"
          >
            {t('common.deleteAccount')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('auth.deleteAccountTitle', { fallback: 'Supprimer votre compte?' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('auth.deleteAccountWarning', { fallback: 'Cette action est irréversible. Toutes vos données seront définitivement supprimées.' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting 
                ? t('auth.deleting', { fallback: 'Suppression...' })
                : t('auth.confirmDelete', { fallback: 'Confirmer la suppression' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
