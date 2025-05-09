import { Scale, Ruler } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const UnitPreferences = () => {
  const { toast } = useToast();

  const handleUnitChange = (value: string) => {
    toast({
      title: "Unités mises à jour",
      description: "Vos préférences d'unités ont été enregistrées",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Unités de mesure
        </h3>
        <Select onValueChange={handleUnitChange} defaultValue="metric">
          <SelectTrigger>
            <SelectValue placeholder="Choisir le système" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Métrique (kilogrammes, centimètres)</SelectItem>
            <SelectItem value="imperial">Impérial (livres, pouces)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Unités de distance
        </h3>
        <Select onValueChange={handleUnitChange} defaultValue="cm">
          <SelectTrigger>
            <SelectValue placeholder="Choisir l'unité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">Centimètres</SelectItem>
            <SelectItem value="in">Pouces</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};