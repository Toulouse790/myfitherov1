
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { TimeRangeControls } from "./TimeRangeControls";
import { NavigationControls } from "./NavigationControls";
import { ViewModeControls } from "./ViewModeControls";
import { SleepChart } from "./SleepChart";
import { generateSleepData } from "./utils";

export const SleepHistory = () => {
  const [viewMode, setViewMode] = useState<'bar' | 'area'>('bar');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [data, setData] = useState(generateSleepData(7));
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const handleRangeChange = (range: 'week' | 'month') => {
    setTimeRange(range);
    setData(generateSleepData(range === 'week' ? 7 : 30));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-blue-950/20 dark:to-blue-900/10 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
          <CardTitle>{t("sleep.sleepHistory")}</CardTitle>
          <TimeRangeControls 
            timeRange={timeRange} 
            handleRangeChange={handleRangeChange} 
          />
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <NavigationControls />
            <ViewModeControls 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />
          </div>

          <div className="h-[300px] md:h-[400px] mt-6">
            <SleepChart 
              data={data} 
              viewMode={viewMode} 
              isMobile={isMobile} 
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SleepHistory;
