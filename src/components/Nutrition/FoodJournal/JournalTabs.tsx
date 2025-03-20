
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodEntryList } from "../FoodEntryList";
import { FoodEntry } from "@/types/food";
import { Apple, Coffee, Sandwich, Pizza, UtensilsCrossed, CalendarCheck } from "lucide-react";

interface JournalTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredEntries: FoodEntry[];
  handleDeleteEntry: (id: string) => Promise<void>;
}

export const JournalTabs = ({ 
  activeTab, 
  setActiveTab, 
  filteredEntries, 
  handleDeleteEntry 
}: JournalTabsProps) => {
  const mealTypes = [
    { value: "all", label: "Tous", icon: CalendarCheck },
    { value: "breakfast", label: "Petit déj", icon: Coffee },
    { value: "morning_snack", label: "Collation", icon: Apple },
    { value: "lunch", label: "Déjeuner", icon: Sandwich },
    { value: "afternoon_snack", label: "Goûter", icon: Apple },
    { value: "dinner", label: "Dîner", icon: Pizza }
  ];

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-6 mb-4 dark:bg-gray-700 rounded-xl">
        {mealTypes.map(type => {
          const Icon = type.icon;
          return (
            <TabsTrigger 
              key={type.value}
              value={type.value} 
              className="flex items-center gap-1.5 py-2 px-3 dark:data-[state=active]:bg-gray-600 dark:text-gray-200 rounded-lg transition-all"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {mealTypes.map(type => (
        <TabsContent key={type.value} value={type.value}>
          <FoodEntryList 
            entries={filteredEntries}
            onDelete={handleDeleteEntry}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
