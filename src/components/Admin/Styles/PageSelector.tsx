import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageSelectorProps {
  selectedPage: string;
  onPageChange: (page: string) => void;
}

export const PageSelector = ({ selectedPage, onPageChange }: PageSelectorProps) => {
  const pages = [
    { id: "home", label: "Accueil" },
    { id: "profile", label: "Profil" },
    { id: "workouts", label: "Entraînements" },
    { id: "nutrition", label: "Nutrition" },
    { id: "stats", label: "Statistiques" },
    { id: "sleep", label: "Sommeil" }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Sélectionner une page</label>
      <Select value={selectedPage} onValueChange={onPageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choisir une page" />
        </SelectTrigger>
        <SelectContent>
          {pages.map((page) => (
            <SelectItem key={page.id} value={page.id}>
              {page.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};