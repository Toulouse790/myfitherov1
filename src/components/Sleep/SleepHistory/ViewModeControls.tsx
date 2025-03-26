
import { Button } from "@/components/ui/button";
import { BarChart2, LineChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ViewModeControlsProps {
  viewMode: 'bar' | 'area';
  setViewMode: (mode: 'bar' | 'area') => void;
}

export const ViewModeControls = ({ 
  viewMode, 
  setViewMode 
}: ViewModeControlsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={viewMode === 'bar' ? "default" : "outline"} 
        size="sm" 
        className="h-8"
        onClick={() => setViewMode('bar')}
      >
        <BarChart2 className="h-4 w-4 mr-1" />
        {t("sleep.bars")}
      </Button>
      <Button 
        variant={viewMode === 'area' ? "default" : "outline"} 
        size="sm" 
        className="h-8"
        onClick={() => setViewMode('area')}
      >
        <LineChart className="h-4 w-4 mr-1" />
        {t("sleep.areas")}
      </Button>
    </div>
  );
};
