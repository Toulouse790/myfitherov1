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
}

export const WidgetGrid = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "1",
      title: "Objectif du jour",
      enabled: true,
      icon: <Target className="w-6 h-6" />,
      value: "2000 calories"
    },
    {
      id: "2",
      title: "Niveau actuel",
      enabled: true,
      icon: <User className="w-6 h-6" />,
      value: "Niveau 5"
    },
    {
      id: "3",
      title: "Badges gagnés",
      enabled: true,
      icon: <Trophy className="w-6 h-6" />,
      value: "3 nouveaux"
    },
    {
      id: "4",
      title: "Points",
      enabled: true,
      icon: <Star className="w-6 h-6" />,
      value: "1250"
    }
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Widgets actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget.id}`}>{widget.title}</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {widgets
          .filter(widget => widget.enabled)
          .map(widget => (
            <DashboardCard
              key={widget.id}
              title={widget.title}
              value={widget.value}
              icon={widget.icon}
            />
          ))}
      </div>
    </div>
  );
};