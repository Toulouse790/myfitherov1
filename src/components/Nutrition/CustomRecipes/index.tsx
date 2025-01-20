import { useState } from "react";
import { RecipeForm } from "./RecipeForm";
import { RecipeList } from "./RecipeList";

export const CustomRecipes = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      {isCreating ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Nouvelle recette</h2>
          <RecipeForm />
        </div>
      ) : (
        <RecipeList onCreateNew={() => setIsCreating(true)} />
      )}
    </div>
  );
};