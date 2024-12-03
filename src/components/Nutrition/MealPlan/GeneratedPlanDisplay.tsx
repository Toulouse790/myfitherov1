import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayMeals } from "./DayMeals";
import { defaultMeals } from "@/data/meals";

interface GeneratedPlanDisplayProps {
  generatedPlan: any;
  durationDays: string;
}

export const GeneratedPlanDisplay = ({ 
  generatedPlan,
  durationDays,
}: GeneratedPlanDisplayProps) => {
  if (!generatedPlan) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre plan alimentaire</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="w-full flex-wrap h-auto">
            {Array.from({ length: parseInt(durationDays) }, (_, i) => (
              <TabsTrigger key={i + 1} value={(i + 1).toString()} className="flex-1">
                Jour {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {generatedPlan.map((day: any, index: number) => (
            <TabsContent key={index} value={(index + 1).toString()}>
              <DayMeals meals={day.meals} mealTitles={defaultMeals} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};