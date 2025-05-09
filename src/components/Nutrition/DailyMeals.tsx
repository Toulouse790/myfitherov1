
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pizza, Plus } from "lucide-react";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { CheatMealDialog } from "./DailyMeals/CheatMealDialog";
import { FoodEntryForm } from "./FoodEntry/FoodEntryForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { addFoodEntry, checkDuplicateEntry } from "@/hooks/food-journal/database";
import { useQueryClient } from "@tanstack/react-query";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<string>("");
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType, refetchEntries, isLoading } = useFoodEntries();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkMealValidations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: preferences } = await supabase
        .from('user_nutrition_preferences')
        .select('meal_validation_times, meal_validation_notifications')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!preferences?.meal_validation_notifications) return;

      const validationTimes = preferences.meal_validation_times || {};
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();

      Object.entries(validationTimes).forEach(([mealType, timeStr]) => {
        const [hours, minutes] = (timeStr as string).split(':').map(Number);
        const mealEntries = entriesByMealType[mealType] || [];
        const mealInfo = mealPlan[mealType];

        if (mealInfo && mealEntries.length === 0) {
          if (currentHour === hours && currentMinutes === 0) {
            toast({
              title: t("nutrition.mealReminder", { fallback: "Rappel de repas" }),
              description: t("nutrition.dontForgetMeal", { fallback: `N'oubliez pas de valider votre ${t(`nutrition.mealTypes.${mealType}`)} !` }),
              duration: 10000,
            });
          }
        }
      });
    };

    const interval = setInterval(checkMealValidations, 60000);
    checkMealValidations();

    return () => clearInterval(interval);
  }, [mealPlan, entriesByMealType, toast, t]);

  const handleCheatMealDialogChange = (open: boolean) => {
    console.log("CheatMeal dialog state changed:", open);
    setIsCheatMealOpen(open);
    if (!open) {
      refetchEntries();
    }
  };
  
  const openAddFoodDialog = (mealType: string) => {
    setCurrentMealType(mealType);
    setIsAddMealOpen(true);
  };

  const handleAddEntry = async (mealType: string, isComposite?: boolean, ingredients?: Array<{ name: string; portion: string }>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Vérifier les doublons
      const isDuplicate = await checkDuplicateEntry(newFood, mealType);
      if (isDuplicate) {
        toast({
          title: t("nutrition.attention", { fallback: "Attention" }),
          description: t("nutrition.foodAlreadyAdded", { fallback: `${newFood} a déjà été ajouté à ${t(`nutrition.mealTypes.${mealType}`)} aujourd'hui` }),
          variant: "default",
        });

        // L'utilisateur peut quand même l'ajouter s'il le souhaite
        if (!confirm(t("nutrition.addAnyway", { fallback: "Voulez-vous quand même ajouter cet aliment ?" }))) {
          return;
        }
      }

      await addFoodEntry({
        name: newFood,
        calories: parseInt(calories),
        proteins: parseInt(proteins),
        carbs: parseInt(carbs || '0'),
        fats: parseInt(fats || '0'),
        mealType: mealType || currentMealType,
        notes: notes,
        components: ingredients || []
      });

      // Mise à jour optimiste de l'interface
      await queryClient.invalidateQueries({ queryKey: ['food-journal-today'] });

      toast({
        title: t("nutrition.mealAdded"),
        description: t("nutrition.mealAddedSuccess"),
      });

      setIsAddMealOpen(false);
      
      // Reset form
      setNewFood("");
      setCalories("");
      setProteins("");
      setCarbs("");
      setFats("");
      setWeight("");
      setNotes("");
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        title: t("common.error"),
        description: t("nutrition.errorAddingMeal"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base">{t("nutrition.todaysMeals")}</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setIsAddMealOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("nutrition.addMeal")}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => setIsCheatMealOpen(true)}
          >
            <Pizza className="w-4 h-4" />
            <span className="hidden sm:inline">{t("nutrition.cheatMeal")}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {Object.entries(mealTypes).map(([type, label]) => (
            <MealSection
              key={type}
              type={type}
              label={t(`nutrition.mealTypes.${type}`)}
              mealEntries={entriesByMealType[type] || []}
              generatedMeal={mealPlan[type] ? {
                name: mealPlan[type].name || t("nutrition.suggestedMeal"),
                calories: mealPlan[type].calories,
                proteins: mealPlan[type].proteins,
              } : undefined}
              isExpanded={expandedMeal === type}
              onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
              onAddFood={() => openAddFoodDialog(type)}
            />
          ))}
        </div>
      </CardContent>

      <CheatMealDialog 
        isOpen={isCheatMealOpen}
        onOpenChange={handleCheatMealDialogChange}
      />

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMealType ? 
                t("nutrition.addFoodTo", { mealType: t(`nutrition.mealTypes.${currentMealType}`), fallback: `Ajouter un aliment à ${t(`nutrition.mealTypes.${currentMealType}`)}` }) : 
                t("nutrition.addMeal")}
            </DialogTitle>
          </DialogHeader>
          <FoodEntryForm
            newFood={newFood}
            calories={calories}
            proteins={proteins}
            carbs={carbs}
            fats={fats}
            weight={weight}
            notes={notes}
            baseCalories={0}
            selectedCategory=""
            onFoodChange={setNewFood}
            onCaloriesChange={setCalories}
            onProteinsChange={setProteins}
            onCarbsChange={setCarbs}
            onFatsChange={setFats}
            onWeightChange={setWeight}
            onNotesChange={setNotes}
            onAddEntry={(mealType, isComposite, ingredients) => 
              handleAddEntry(mealType || currentMealType, isComposite, ingredients)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
