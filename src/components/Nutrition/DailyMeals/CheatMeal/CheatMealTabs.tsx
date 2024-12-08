import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MealGrid } from "./MealGrid";

interface CheatMealTabsProps {
  meals: any[];
  selectedMeals: any[];
  onToggleMeal: (meal: any) => void;
}

export const CheatMealTabs = ({ meals, selectedMeals, onToggleMeal }: CheatMealTabsProps) => {
  return (
    <Tabs defaultValue="food" className="w-full">
      <TabsList className="w-full grid grid-cols-4 h-auto">
        <TabsTrigger value="food" className="text-xs sm:text-sm py-2">Plats</TabsTrigger>
        <TabsTrigger value="drink" className="text-xs sm:text-sm py-2">Boissons</TabsTrigger>
        <TabsTrigger value="alcohol" className="text-xs sm:text-sm py-2">Alcool</TabsTrigger>
        <TabsTrigger value="dessert" className="text-xs sm:text-sm py-2">Desserts</TabsTrigger>
      </TabsList>

      {['food', 'drink', 'alcohol', 'dessert'].map((category) => (
        <TabsContent key={category} value={category} className="mt-4">
          <ScrollArea className="h-[40vh] sm:h-[45vh]">
            <MealGrid
              meals={meals.filter(meal => meal.category === category)}
              selectedMeals={selectedMeals}
              onToggleMeal={onToggleMeal}
            />
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};