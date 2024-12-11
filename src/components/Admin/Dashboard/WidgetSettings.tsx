import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WidgetSettingsProps {
  config: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}

export const WidgetSettings = ({ config, onUpdate, onDelete }: WidgetSettingsProps) => {
  const [title, setTitle] = useState(config.title);

  const handleSave = () => {
    onUpdate({ ...config, title });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Paramètres du widget</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Titre</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du widget"
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};