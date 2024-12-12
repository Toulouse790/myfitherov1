import { UsersWidget } from "../UsersWidget";
import { WorkoutsWidget } from "../WorkoutsWidget";
import { ExercisesWidget } from "../ExercisesWidget";
import { NutritionWidget } from "../NutritionWidget";
import { SleepWidget } from "../SleepWidget";
import { PerformanceWidget } from "../PerformanceWidget";
import { AchievementsWidget } from "../AchievementsWidget";
import { MuscleGroupsWidget } from "../MuscleGroupsWidget";

const widgetComponents = {
  users: UsersWidget,
  workouts: WorkoutsWidget,
  exercises: ExercisesWidget,
  nutrition: NutritionWidget,
  sleep: SleepWidget,
  performance: PerformanceWidget,
  achievements: AchievementsWidget,
  muscle_groups: MuscleGroupsWidget,
};

interface WidgetRendererProps {
  config: any;
  data: any;
  title: string;
}

export const WidgetRenderer = ({ config, data, title }: WidgetRendererProps) => {
  const WidgetComponent = widgetComponents[config.widget_id as keyof typeof widgetComponents];

  if (!WidgetComponent) return null;

  return <WidgetComponent data={data} title={title} />;
};