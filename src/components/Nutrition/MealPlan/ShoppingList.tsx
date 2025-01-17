import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShoppingListProps {
  items: string[];
}

export const ShoppingList = ({ items }: ShoppingListProps) => {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste de courses</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};