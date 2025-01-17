import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";

interface ActiveMealPlansProps {
  shoppingList: string[];
}

export const ActiveMealPlans = ({ shoppingList }: ActiveMealPlansProps) => {
  if (!shoppingList || shoppingList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Liste de courses
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-2">
              {shoppingList.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                >
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};