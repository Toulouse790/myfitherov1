
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotificationManager } from "@/hooks/use-notification-manager";
import { PaginationItem } from "@/components/ui/pagination";

interface ExplorerTabProps {
  isLoading: boolean;
  sports: any[];
  positions: any[];
}

export const ExplorerTab = ({ isLoading, sports, positions }: ExplorerTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { notify } = useNotificationManager();

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

  const totalPages = Math.ceil(
    Math.max(filteredSports.length, filteredPositions.length) / itemsPerPage
  );

  const handleCopySportId = (id: string) => {
    navigator.clipboard.writeText(id);
    notify("ID copié", "L'identifiant du sport a été copié dans le presse-papier", "success", { duration: 1500 });
  };

  const handleCopyPositionId = (id: string) => {
    navigator.clipboard.writeText(id);
    notify("ID copié", "L'identifiant de la position a été copié dans le presse-papier", "success", { duration: 1500 });
  };

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
            <SportsList sports={paginatedSports} onCopyId={handleCopySportId} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
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
            <PositionsList positions={paginatedPositions} onCopyId={handleCopyPositionId} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const SportsList = ({ sports, onCopyId }: { sports: any[], onCopyId: (id: string) => void }) => (
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
          <TableCell className="font-mono text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-mono p-0 h-auto text-xs"
              onClick={() => onCopyId(sport.id)}
            >
              {sport.id}
            </Button>
          </TableCell>
          <TableCell>{sport.name}</TableCell>
          <TableCell>{sport.type}</TableCell>
          <TableCell>{sport.category}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PositionsList = ({ positions, onCopyId }: { positions: any[], onCopyId: (id: string) => void }) => (
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
          <TableCell className="font-mono text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-mono p-0 h-auto text-xs"
              onClick={() => onCopyId(position.id)}
            >
              {position.id}
            </Button>
          </TableCell>
          <TableCell>{position.name}</TableCell>
          <TableCell>
            {position.sports?.name || (
              <Badge variant="destructive">Sport non trouvé</Badge>
            )}
          </TableCell>
          <TableCell className="font-mono text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-mono p-0 h-auto text-xs"
              onClick={() => onCopyId(position.sport_id || "")}
            >
              {position.sport_id}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4 space-x-1">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2"
      >
        Précédent
      </Button>
      
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <Button 
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"} 
            size="sm"
            onClick={() => goToPage(pageNum)}
            className="w-8 h-8 p-0"
          >
            {pageNum}
          </Button>
        );
      })}
      
      {totalPages > 5 && (
        <>
          <span className="px-1">...</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => goToPage(totalPages)}
            className="w-8 h-8 p-0"
          >
            {totalPages}
          </Button>
        </>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2"
      >
        Suivant
      </Button>
    </div>
  );
};

