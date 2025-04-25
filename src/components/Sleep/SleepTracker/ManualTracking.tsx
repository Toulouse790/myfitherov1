
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
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
  const { t } = useLanguage();
  
  return (
    <div className="grid gap-4">
      <SleepTypeToggle isNap={isNap} setIsNap={setIsNap} />
      <DurationInputs 
        sleepHours={sleepHours}
        sleepMinutes={sleepMinutes}
        setSleepHours={setSleepHours}
        setSleepMinutes={setSleepMinutes}
      />
      <QualitySlider sleepQuality={sleepQuality} setSleepQuality={setSleepQuality} />
      <Button
        onClick={addSleepSession}
        className="w-full bg-blue-500 hover:bg-blue-600"
        size="lg"
      >
        {t("sleep.save")}
      </Button>
    </div>
  );
};

interface SleepTypeToggleProps {
  isNap: boolean;
  setIsNap: (isNap: boolean) => void;
}

const SleepTypeToggle = ({ isNap, setIsNap }: SleepTypeToggleProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
      <Label htmlFor="is-nap" className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-blue-500" />
        <span>{t("sleep.sleepTypeLabel")}</span>
      </Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="is-nap"
          checked={isNap}
          onCheckedChange={setIsNap}
          className="data-[state=checked]:bg-blue-500"
        />
        <span className="text-sm">{isNap ? t("sleep.nap") : t("sleep.night")}</span>
      </div>
    </div>
  );
};

interface DurationInputsProps {
  sleepHours: number;
  sleepMinutes: number;
  setSleepHours: (hours: number) => void;
  setSleepMinutes: (minutes: number) => void;
}

const DurationInputs = ({ 
  sleepHours, 
  sleepMinutes, 
  setSleepHours, 
  setSleepMinutes 
}: DurationInputsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
      <Label className="block text-sm font-medium mb-2 text-blue-700 dark:text-blue-300">
        {t("sleep.duration")}
      </Label>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center">
            <Input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              min={0}
              max={24}
              className="w-full border-blue-200 dark:border-blue-700 focus:ring-blue-500"
            />
            <span className="ml-2">{t("sleep.hours")}</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <Input
              type="number"
              value={sleepMinutes}
              onChange={(e) => setSleepMinutes(Number(e.target.value))}
              min={0}
              max={59}
              className="w-full border-blue-200 dark:border-blue-700 focus:ring-blue-500"
            />
            <span className="ml-2">{t("sleep.minutes")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QualitySliderProps {
  sleepQuality: number;
  setSleepQuality: (quality: number) => void;
}

const QualitySlider = ({ sleepQuality, setSleepQuality }: QualitySliderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
      <Label className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-300">
        <Sun className="h-4 w-4 text-amber-500" />
        <span>{t("sleep.sleepQualityRange")}</span>
      </Label>
      <input
        type="range"
        value={sleepQuality}
        onChange={(e) => setSleepQuality(Number(e.target.value))}
        min={1}
        max={10}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-1">
        <span>{t("sleep.poor")}</span>
        <span>{t("sleep.excellent")}</span>
      </div>
    </div>
  );
};
