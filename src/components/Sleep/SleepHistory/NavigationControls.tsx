
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const NavigationControls = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t("sleep.previous")}
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        <Calendar className="h-4 w-4 mr-1" />
        {t("sleep.today")}
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        {t("sleep.next")}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};
