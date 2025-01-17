import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddSetButtonProps {
  onClick: () => void;
}

export const AddSetButton = ({ onClick }: AddSetButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full mt-2 gap-2 hover:bg-primary/10"
      onClick={onClick}
    >
      <Plus className="h-4 w-4" />
      Ajouter une série
    </Button>
  );
};