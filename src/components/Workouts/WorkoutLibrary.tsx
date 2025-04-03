
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Filter, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { LibraryWorkoutCard } from "./components/LibraryWorkoutCard";
import { useWorkoutTemplates } from "@/hooks/use-workout-templates";

export function WorkoutLibrary() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { templates, isLoading } = useWorkoutTemplates();

  const handleSelectMuscleGroup = (group: string) => {
    if (selectedMuscleGroup === group) {
      setSelectedMuscleGroup(null);
    } else {
      setSelectedMuscleGroup(group);
    }
  };

  const handleCreateWorkout = () => {
    navigate("/workouts/generate");
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchTerm === "" || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMuscleGroup = !selectedMuscleGroup || 
      (template.exercise_data && 
        template.exercise_data.some((ex: any) => 
          ex.muscle_group === selectedMuscleGroup));
    
    return matchesSearch && matchesMuscleGroup;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("workouts.library")}</CardTitle>
              <CardDescription>
                {t("workouts.libraryDescription")}
              </CardDescription>
            </div>
            <Button onClick={handleCreateWorkout} className="hidden sm:flex">
              <Plus className="mr-2 h-4 w-4" />
              {t("workouts.createWorkout")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("workouts.searchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={isMobile ? "w-full sm:w-auto h-10" : ""}
              aria-label={t("workouts.toggleFilters")}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="truncate">{t("workouts.filters")}</span>
            </Button>
            <Button onClick={handleCreateWorkout} className="sm:hidden w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t("workouts.createWorkout")}
            </Button>
          </div>

          {showFilters && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">{t("workouts.muscleGroups")}</h3>
              <MuscleGroupGrid 
                onSelect={handleSelectMuscleGroup} 
                selectedGroup={selectedMuscleGroup}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <LibraryWorkoutCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">
                {selectedMuscleGroup 
                  ? t("workouts.noWorkoutsForMuscleGroup") 
                  : t("workouts.noWorkoutsFound")}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={handleCreateWorkout}
              >
                {t("workouts.createFirstWorkout")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
