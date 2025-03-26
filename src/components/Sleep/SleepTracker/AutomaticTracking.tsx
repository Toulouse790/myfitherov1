
import { useLanguage } from "@/contexts/LanguageContext";
import { ConnectedDevices } from "../ConnectedDevices";

export const AutomaticTracking = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <ConnectedDevices />
      
      <div className="text-center text-muted-foreground bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg">
        <p>{t("sleep.connectDevice")}</p>
      </div>
    </>
  );
};
