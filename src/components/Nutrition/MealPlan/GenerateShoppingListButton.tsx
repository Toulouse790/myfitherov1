import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag } from "lucide-react";

interface GenerateShoppingListButtonProps {
  onClick: () => void;
  shoppingList?: string[];
}

export const GenerateShoppingListButton = ({ onClick, shoppingList }: GenerateShoppingListButtonProps) => {
  return (
    <div className="space-y-4">
      <Button 
        className="w-full"
        variant="outline"
        onClick={onClick}
      >
        Générer ta liste de courses
      </Button>

      {shoppingList && shoppingList.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Liste de courses</h3>
          </div>
          <ScrollArea className="h-[300px] w-full pr-4">
            <ul className="space-y-2">
              {shoppingList.map((item, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors text-sm sm:text-base"
                >
                  {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};