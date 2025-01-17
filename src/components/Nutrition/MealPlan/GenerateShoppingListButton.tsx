import { Button } from "@/components/ui/button";

interface GenerateShoppingListButtonProps {
  onClick: () => void;
}

export const GenerateShoppingListButton = ({ onClick }: GenerateShoppingListButtonProps) => {
  return (
    <Button 
      className="w-full"
      variant="outline"
      onClick={onClick}
    >
      Générer ta liste de courses
    </Button>
  );
};