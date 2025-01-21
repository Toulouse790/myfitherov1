import { DietTypeButton } from "./DietTypeButton";

interface DietTypeGridProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export const DietTypeGrid = ({ selectedType, onTypeChange }: DietTypeGridProps) => {
  const dietTypes = [
    { type: "balanced", label: "Équilibré" },
    { type: "highProtein", label: "Riche en protéines" },
    { type: "lowCarb", label: "Pauvre en glucides" },
    { type: "vegetarian", label: "Végétarien" },
    { type: "vegan", label: "Végétalien" },
    { type: "mediterranean", label: "Méditerranéen" },
    { type: "keto", label: "Cétogène" },
    { type: "glutenFree", label: "Sans gluten" },
    { type: "high_fiber", label: "Riche en fibres" },
    { type: "seche_extreme", label: "Sèche extrême" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {dietTypes.map(({ type, label }) => (
        <DietTypeButton
          key={type}
          type={type}
          currentType={selectedType}
          label={label}
          onClick={onTypeChange}
        />
      ))}
    </div>
  );
};