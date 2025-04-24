
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguageManagement } from "@/hooks/use-language-management";
import { Badge } from "@/components/ui/badge";

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, translate } = useLanguageManagement();

  const languages = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch'
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {translate('settings.language', { fallback: 'Langue' })}
        </label>
        <Badge variant="outline" className="text-xs font-normal">
          {languages[currentLanguage]}
        </Badge>
      </div>
      
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={translate('settings.selectLanguage', { fallback: 'Sélectionner une langue' })} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([code, name]) => (
            <SelectItem key={code} value={code}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        {translate('settings.languageDescription', { fallback: "Choisissez la langue de l'interface" })}
      </p>
    </div>
  );
};
