import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWidgetConfigs } from "@/hooks/admin/use-widget-configs";

interface AddWidgetSheetProps {
  availableWidgets: any[];
}

export const AddWidgetSheet = ({ availableWidgets }: AddWidgetSheetProps) => {
  const { user } = useAuth();
  const { widgetConfigs, addConfig, deleteConfig } = useWidgetConfigs();

  const handleToggleWidget = async (widget: any) => {
    const existingConfig = widgetConfigs?.find(w => w.widget_id === widget.id);
    
    if (existingConfig) {
      await deleteConfig.mutate(existingConfig.id);
    } else {
      await addConfig.mutate({
        widget_id: widget.id,
        title: widget.name,
        description: widget.description,
        is_active: true,
        config: {},
        position: widgetConfigs?.length || 0,
        user_id: user?.id || ''
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un widget
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Widgets disponibles</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-4">
            {availableWidgets?.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{widget.name}</Label>
                  <p className="text-sm text-muted-foreground">{widget.description}</p>
                </div>
                <Switch
                  checked={widgetConfigs?.some(w => w.widget_id === widget.id)}
                  onCheckedChange={() => handleToggleWidget(widget)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};