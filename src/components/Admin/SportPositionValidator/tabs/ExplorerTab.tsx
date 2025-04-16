import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";

interface ExplorerTabProps {
  isLoading: boolean;
  sports: any[];
  positions: any[];
}

export const ExplorerTab = ({ isLoading, sports, positions }: ExplorerTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSports = sports.filter((sport) =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPositions = positions.filter((position) =>
    position.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSports = filteredSports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedPositions = filteredPositions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Rechercher des sports ou des positions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="sports">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Sports ({filteredSports.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SportsList sports={paginatedSports} />
            <Pagination
              currentPage={currentPage}
              totalItems={filteredSports.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="positions">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Positions ({filteredPositions.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PositionsList positions={paginatedPositions} />
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPositions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
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
