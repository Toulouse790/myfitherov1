import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface WidgetSettingsProps {
  config: any;
  onUpdate: (data: any) => void;
  onDelete: (id: string) => void;
}

export const WidgetSettings = ({
  config,
  onUpdate,
  onDelete,
}: WidgetSettingsProps) => {
  const [title, setTitle] = useState(config.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...config, title });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Widget Settings</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Widget Title"
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onDelete(config.id)}
          >
            Delete
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};