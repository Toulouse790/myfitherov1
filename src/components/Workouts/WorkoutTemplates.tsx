import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkoutTemplates } from "@/hooks/use-workout-templates";
import { Dumbbell, Plus } from "lucide-react";

export const WorkoutTemplates = () => {
  const { templates, isLoading } = useWorkoutTemplates();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mes Templates</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates?.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  {template.exercise_data.length} exercices
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};