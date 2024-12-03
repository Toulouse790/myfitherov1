import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { Target, User, Trophy, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Widget {
  id: string;
  title: string;
  enabled: boolean;
  icon: React.ReactNode;
  value: string;
  target: string;
}

export const WidgetGrid = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "1",
      title: "Objectif du jour",
      enabled: true,
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      value: "2000 calories",
      target: "2500 calories"
    },
    {
      id: "2",
      title: "Niveau actuel",
      enabled: true,
      icon: <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      value: "Niveau 5",
      target: "Niveau 6"
    },
    {
      id: "3",
      title: "Badges gagnés",
      enabled: true,
      icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      value: "3 nouveaux",
      target: "5 badges"
    },
    {
      id: "4",
      title: "Points",
      enabled: true,
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      value: "1250",
      target: "2000"
    }
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg md:text-xl">Widgets actifs</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget.id}`} className="text-xs sm:text-sm md:text-base">{widget.title}</Label>
                <Switch
                  id={`widget-${widget.id}`}
                  checked={widget.enabled}
                  onCheckedChange={() => toggleWidget(widget.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {widgets
          .filter(widget => widget.enabled)
          .map(widget => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              value={widget.value}
              target={widget.target}
              icon={widget.icon}
            />
          ))}
      </div>
    </div>
  );
};