
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguageManagement } from "@/hooks/use-language-management";
import { useEffect } from "react";

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguageManagement();

  // Assurer la cohérence entre état et localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('userLanguage');
      if (savedLanguage && savedLanguage !== currentLanguage) {
        // Forcer la mise à jour si la langue stockée est différente de l'état actuel
        changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error("Error synchronizing language:", error);
    }
  }, [currentLanguage]);

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Langue" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">Français</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="de">Deutsch</SelectItem>
      </SelectContent>
    </Select>
  );
};
