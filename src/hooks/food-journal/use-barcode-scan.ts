
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";

export const useBarcodeScan = () => {
  const handleBarcodeScan = async (barcode: string): Promise<FoodEntry | null> => {
    try {
      console.log("Scanning barcode:", barcode);
      
      // Simuler une recherche dans une base de données d'aliments
      // Dans une implémentation réelle, cela ferait une requête à une API de produits alimentaires
      const isProductFound = Math.random() > 0.3; // 70% de chance de trouver le produit
      
      if (isProductFound) {
        // Produit trouvé, on crée une entrée avec des valeurs simulées
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return null;
        }
        
        // Créer des données simulées basées sur le code-barres
        const productName = `Produit ${barcode.substring(0, 4)}`;
        const randomCalories = Math.floor(Math.random() * 500) + 100;
        const randomProteins = Math.floor(Math.random() * 30);
        const randomCarbs = Math.floor(Math.random() * 50);
        const randomFats = Math.floor(Math.random() * 20);
        
        // Ajouter l'entrée à la base de données
        const { data, error } = await supabase
          .from('food_journal_entries')
          .insert({
            user_id: user.id,
            name: productName,
            calories: randomCalories,
            proteins: randomProteins,
            carbs: randomCarbs,
            fats: randomFats,
            meal_type: "snack", // Par défaut
            notes: `Scanné via code-barres: ${barcode}`
          })
          .select()
          .single();
          
        if (error) {
          console.error("Error adding scanned product:", error);
          return null;
        }
        
        return {
          id: data.id,
          name: productName,
          calories: randomCalories,
          proteins: randomProteins,
          carbs: randomCarbs,
          fats: randomFats,
          mealType: "snack",
          notes: `Scanné via code-barres: ${barcode}`,
          created_at: new Date().toISOString()
        };
      }
      
      return null; // Produit non trouvé
    } catch (error) {
      console.error("Error scanning barcode:", error);
      return null;
    }
  };

  return { handleBarcodeScan };
};
