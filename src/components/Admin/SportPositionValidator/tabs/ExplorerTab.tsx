
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExplorerTabProps {
  isLoading: boolean;
  sports: any[];
  positions: any[];
}

export const ExplorerTab = ({ isLoading, sports, positions }: ExplorerTabProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible>
        <AccordionItem value="sports">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Sports ({sports.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SportsList sports={sports} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="positions">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Positions ({positions.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PositionsList positions={positions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const SportsList = ({ sports }: { sports: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Catégorie</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sports.map((sport) => (
        <TableRow key={sport.id}>
          <TableCell className="font-mono text-xs">{sport.id}</TableCell>
          <TableCell>{sport.name}</TableCell>
          <TableCell>{sport.type}</TableCell>
          <TableCell>{sport.category}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PositionsList = ({ positions }: { positions: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Nom</TableHead>
        <TableHead>Sport</TableHead>
        <TableHead>Sport ID</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {positions.map((position) => (
        <TableRow key={position.id}>
          <TableCell className="font-mono text-xs">{position.id}</TableCell>
          <TableCell>{position.name}</TableCell>
          <TableCell>
            {position.sports?.name || (
              <Badge variant="destructive">Sport non trouvé</Badge>
            )}
          </TableCell>
          <TableCell className="font-mono text-xs">{position.sport_id}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
