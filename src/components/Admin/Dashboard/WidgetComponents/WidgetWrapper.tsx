import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetSettings } from "../WidgetSettings";

interface WidgetWrapperProps {
  config: any;
  isEditing: boolean;
  children: React.ReactNode;
  onUpdateConfig: (data: any) => void;
  onDeleteConfig: (id: string) => void;
}

export const WidgetWrapper = ({
  config,
  isEditing,
  children,
  onUpdateConfig,
  onDeleteConfig,
}: WidgetWrapperProps) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {!isEditing && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <WidgetSettings
            config={config}
            onUpdate={onUpdateConfig}
            onDelete={() => onDeleteConfig(config.id)}
          />
        </Dialog>
      )}
      <div className="p-4 group">
        {children}
      </div>
    </div>
  );
};