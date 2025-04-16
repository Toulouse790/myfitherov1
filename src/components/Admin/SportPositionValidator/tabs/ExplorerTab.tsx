import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

interface ExplorerTabProps {
  isLoading: boolean;
  sports: any[];
  positions: any[];
}

export const ExplorerTab = ({ isLoading, sports, positions }: ExplorerTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPositions = positions.filter(position =>
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

  const totalPages = Math.ceil(
    Math.max(filteredSports.length, filteredPositions.length) / itemsPerPage
  );

  const checkForDuplicates = (items: any[], key: string) => {
    const seen = new Set();
    const duplicates = new Set();
    items.forEach(item => {
      if (seen.has(item[key])) {
        duplicates.add(item[key]);
      } else {
        seen.add(item[key]);
      }
    });
    return duplicates;
  };

  const duplicateSportNames = checkForDuplicates(sports, "name");
  const duplicatePositionNames = checkForDuplicates(positions, "name");

  const checkForMissingData = (items: any[], keys: string[]) => {
    return items.filter(item => keys.some(key => !item[key]));
  };

  const missingSportData = checkForMissingData(sports, ["name", "type", "category"]);
  const missingPositionData = checkForMissingData(positions, ["name", "sport_id"]);

  const validateConsistency = (items: any[], key: string) => {
    const inconsistencies = new Set();
    items.forEach(item => {
      if (item[key] && item[key].toLowerCase() !== item[key]) {
        inconsistencies.add(item[key]);
      }
    });
    return inconsistencies;
  };

  const inconsistentSportTypes = validateConsistency(sports, "type");
  const inconsistentSportCategories = validateConsistency(sports, "category");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        type="text"
        placeholder="Rechercher des sports ou des positions"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="sports">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Sports ({filteredSports.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SportsList sports={paginatedSports} />
            <Pagination>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
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
            <Pagination>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div>
        <h4>Validation des données</h4>
        <ul>
          <li>Sports avec noms en double: {Array.from(duplicateSportNames).join(", ") || "Aucun"}</li>
          <li>Positions avec noms en double: {Array.from(duplicatePositionNames).join(", ") || "Aucun"}</li>
          <li>Sports avec données manquantes: {missingSportData.length}</li>
          <li>Positions avec données manquantes: {missingPositionData.length}</li>
          <li>Types de sports inconsistants: {Array.from(inconsistentSportTypes).join(", ") || "Aucun"}</li>
          <li>Catégories de sports inconsistantes: {Array.from(inconsistentSportCategories).join(", ") || "Aucun"}</li>
        </ul>
      </div>
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
