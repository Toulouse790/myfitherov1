import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export const TableHeader = ({ onSelectAll, allSelected }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Informations</TableHead>
        <TableHead>Médias</TableHead>
      </TableRow>
    </TableHeader>
  );
};