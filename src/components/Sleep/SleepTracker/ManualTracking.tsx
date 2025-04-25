
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface ManualTrackingProps {
  sleepHours: number;
  sleepMinutes: number;
  sleepQuality: number;
  isNap: boolean;
  setSleepHours: (hours: number) => void;
  setSleepMinutes: (minutes: number) => void;
  setSleepQuality: (quality: number) => void;
  setIsNap: (isNap: boolean) => void;
  addSleepSession: () => void;
}

export const ManualTracking = ({
  sleepHours,
  sleepMinutes,
  sleepQuality,
  isNap,
  setSleepHours,
  setSleepMinutes,
  setSleepQuality,
  setIsNap,
  addSleepSession
}: ManualTrackingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addSleepSession();
    } catch (error) {
      console.error('Error submitting sleep data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="sleepType">{t("sleep.sleepTypeLabel")}</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm">{isNap ? t("sleep.nap") : t("sleep.night")}</span>
          <Switch
            id="sleepType"
            checked={isNap}
            onCheckedChange={setIsNap}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>{t("sleep.duration")}</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="hours" className="text-xs text-muted-foreground">{t("sleep.hours")}</Label>
            <Input
              id="hours"
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseInt(e.target.value) || 0)}
              min={0}
              max={24}
              step={1}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="minutes" className="text-xs text-muted-foreground">{t("sleep.minutes")}</Label>
            <Input
              id="minutes"
              type="number"
              value={sleepMinutes}
              onChange={(e) => setSleepMinutes(parseInt(e.target.value) || 0)}
              min={0}
              max={59}
              step={5}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <Label htmlFor="quality">{t("sleep.sleepQualityRange")}</Label>
          <span className="text-sm font-medium">{sleepQuality}/10</span>
        </div>
        <div className="py-2">
          <Slider
            id="quality"
            value={[sleepQuality]}
            onValueChange={(values) => setSleepQuality(values[0])}
            max={10}
            min={1}
            step={1}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("sleep.poor")}</span>
          <span>{t("sleep.excellent")}</span>
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">◌</span>
            {t("common.loading")}
          </span> : 
          t("sleep.save")
        }
      </Button>
    </div>
  );
};
