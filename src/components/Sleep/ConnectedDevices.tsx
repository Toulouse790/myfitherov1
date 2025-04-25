
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { Watch, Trash2, BatteryFull, RefreshCw, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const ConnectedDevices = () => {
  const { connectedDevices, connectDevice, disconnectDevice, syncDevice } = useSleepTracking();
  const { t } = useLanguage();

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return t("common.never", { fallback: "Jamais" });
    
    const date = new Date(dateString);
    return date.toLocaleString(t("common.locale", { fallback: 'fr-FR' }), {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-600/90 to-blue-400/90 text-white p-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Watch className="w-5 h-5" />
          {t("sleep.connectedDevices")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {connectedDevices && connectedDevices.length > 0 ? (
            <div className="space-y-3">
              {connectedDevices.map((device, index) => (
                <motion.div 
                  key={device.id}
                  variants={itemVariants}
                  className="flex items-center justify-between p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-700/30 p-2 rounded-full">
                      <Watch className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-700 dark:text-blue-300 text-sm truncate">{device.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {t("common.lastSync", { fallback: "Dernière synchronisation" })}: {formatLastSync(device.lastSync)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title={t("common.sync", { fallback: "Synchroniser" })}
                      onClick={() => syncDevice(device.id)}
                      className="h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-300"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title={t("common.battery", { fallback: "Batterie" })}
                      className="h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-300"
                    >
                      <BatteryFull className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title={t("common.delete", { fallback: "Supprimer" })}
                      onClick={() => disconnectDevice(device.id)}
                      className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-lg border border-dashed border-blue-200 dark:border-blue-800/30">
              <Watch className="w-12 h-12 mx-auto mb-3 text-blue-300" />
              <p className="text-sm text-muted-foreground mb-4">
                {t("common.noConnectedDevices", { fallback: "Aucun appareil connecté" })}
              </p>
            </div>
          )}

          <Button
            onClick={connectDevice}
            variant={connectedDevices.length > 0 ? "outline" : "default"}
            className={`w-full text-xs sm:text-sm ${connectedDevices.length > 0 ? 'border-blue-300 text-blue-600 hover:bg-blue-50' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            <span className="truncate">
              {connectedDevices.length > 0 
                ? t("common.connectAnotherDevice", { fallback: "Connecter un autre appareil" })
                : t("common.connectDevice", { fallback: "Connecter un appareil" })}
            </span>
          </Button>
          
          {connectedDevices.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t("common.deviceSyncInfo", { fallback: "Les données de vos appareils seront automatiquement synchronisées" })}
            </p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};
