
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TimeRangeControlsProps {
  timeRange: 'week' | 'month';
  handleRangeChange: (range: 'week' | 'month') => void;
}

export const TimeRangeControls = ({ 
  timeRange, 
  handleRangeChange 
}: TimeRangeControlsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        className="h-8 text-white hover:bg-white/20 text-xs truncate"
        onClick={() => handleRangeChange('week')}
        disabled={timeRange === 'week'}
      >
        {t("sleep.week")}
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className="h-8 text-white hover:bg-white/20 text-xs truncate"
        onClick={() => handleRangeChange('month')}
        disabled={timeRange === 'month'}
      >
        {t("sleep.month")}
      </Button>
    </div>
  );
};
