
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodEntryList } from "../FoodEntryList";
import { FoodEntry } from "@/types/food";
import { Apple, Coffee, Sandwich, Pizza, UtensilsCrossed, CalendarCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

export interface JournalTabsProps {
  entries: FoodEntry[];
  isLoading: boolean;
  onDeleteEntry: (id: string) => Promise<void>;
}

export const JournalTabs = ({ 
  entries,
  isLoading,
  onDeleteEntry
}: JournalTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useLanguage();
  
  const mealTypes = [
    { value: "all", label: t("common.all", { fallback: "Tous" }), icon: CalendarCheck },
    { value: "breakfast", label: t("nutrition.mealTypes.breakfast", { fallback: "Petit déj" }), icon: Coffee },
    { value: "morning_snack", label: t("nutrition.mealTypes.morning_snack", { fallback: "Collation" }), icon: Apple },
    { value: "lunch", label: t("nutrition.mealTypes.lunch", { fallback: "Déjeuner" }), icon: Sandwich },
    { value: "afternoon_snack", label: t("nutrition.mealTypes.afternoon_snack", { fallback: "Goûter" }), icon: Apple },
    { value: "dinner", label: t("nutrition.mealTypes.dinner", { fallback: "Dîner" }), icon: Pizza }
  ];

  // Filtrer les entrées en fonction de l'onglet actif
  const filteredEntries = activeTab === "all" 
    ? entries 
    : entries.filter(entry => entry.mealType === activeTab);

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-3 sm:mb-4 dark:bg-gray-700 rounded-xl overflow-x-auto">
        {mealTypes.map(type => {
          const Icon = type.icon;
          return (
            <TabsTrigger 
              key={type.value}
              value={type.value} 
              className="flex items-center gap-1 py-1.5 px-2 sm:py-2 sm:px-3 dark:data-[state=active]:bg-gray-600 dark:text-gray-200 rounded-lg transition-all"
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className={isMobile && type.value !== "all" ? "sr-only" : "text-xs sm:text-sm"}>
                {type.label}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {mealTypes.map(type => (
        <TabsContent key={type.value} value={type.value}>
          <FoodEntryList 
            entries={filteredEntries}
            onDelete={onDeleteEntry}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
