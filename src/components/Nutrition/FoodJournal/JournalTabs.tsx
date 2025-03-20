
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodEntryList } from "../FoodEntryList";
import { FoodEntry } from "@/types/food";

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
    { value: "all", label: "Tous" },
    { value: "breakfast", label: "Petit déj" },
    { value: "morning_snack", label: "Collation" },
    { value: "lunch", label: "Déjeuner" },
    { value: "afternoon_snack", label: "Goûter" },
    { value: "dinner", label: "Dîner" }
  ];

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-6 mb-4 dark:bg-gray-700">
        {mealTypes.map(type => (
          <TabsTrigger 
            key={type.value}
            value={type.value} 
            className="dark:data-[state=active]:bg-gray-600 dark:text-gray-200"
          >
            {type.label}
          </TabsTrigger>
        ))}
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
