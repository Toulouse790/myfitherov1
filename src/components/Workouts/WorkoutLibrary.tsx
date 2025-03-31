
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { useIsMobile } from "@/hooks/use-mobile";

export const WorkoutLibrary = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("workouts.library") || "Bibliothèque d'entraînements"}</CardTitle>
          <CardDescription>
            {t("workouts.libraryDescription") || "Parcourez notre collection d'entraînements prédéfinis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("workouts.searchPlaceholder") || "Rechercher un entraînement..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={isMobile ? "w-full sm:w-auto h-10" : ""}
              aria-label={t("workouts.toggleFilters") || "Afficher/Masquer les filtres"}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="truncate">{t("workouts.filters") || "Filtres"}</span>
            </Button>
          </div>

          {showFilters && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">{t("workouts.muscleGroups") || "Groupes musculaires"}</h3>
              <MuscleGroupGrid onSelect={() => {}} />
            </div>
          )}

          <div className="text-center py-8">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground">
              {t("workouts.chooseGroup") || "Choisissez un groupe musculaire pour commencer"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
