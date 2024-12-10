import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  publishFilter: boolean | null;
  onFilterChange: (value: boolean | null) => void;
}

export const FilterTabs = ({ publishFilter, onFilterChange }: FilterTabsProps) => {
  return (
    <Tabs 
      value={publishFilter === null ? "all" : publishFilter ? "published" : "unpublished"} 
      onValueChange={(value) => onFilterChange(value === "all" ? null : value === "published")}
    >
      <TabsList>
        <TabsTrigger value="unpublished">À publier</TabsTrigger>
        <TabsTrigger value="published">Publiés</TabsTrigger>
        <TabsTrigger value="all">Tous</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};