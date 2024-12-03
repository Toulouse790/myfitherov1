import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutFormData, initialFormData, muscleGroups } from "./workoutConstants";

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, field: keyof WorkoutFormData) => {
    if (field === 'muscleGroups') {
      setFormData((prev) => ({
        ...prev,
        [field]: value.split(',').filter(Boolean),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.muscleGroups.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un groupe musculaire.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Séance créée",
      description: "Votre nouvelle séance a été créée avec succès.",
    });
    setOpen(false);
    setFormData(initialFormData);
  };

  const selectedColor = formData.muscleGroups.length > 0 
    ? muscleGroups.find(group => group.id === formData.muscleGroups[0])?.color || ""
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle séance
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${selectedColor} transition-colors duration-200`}>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle séance</DialogTitle>
        </DialogHeader>
        <WorkoutForm 
          formData={formData}
          onSubmit={handleSubmit}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          selectedColor={selectedColor}
        />
      </DialogContent>
    </Dialog>
  );
};