
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { AppSettings } from "./AppSettings";
import { AccountActions } from "./AccountActions";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/Theme/useTheme";

export const SettingsSheet = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('settings.appSettings')}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <AppSettings />
          <AccountActions />
        </div>
      </SheetContent>
    </Sheet>
  );
};
