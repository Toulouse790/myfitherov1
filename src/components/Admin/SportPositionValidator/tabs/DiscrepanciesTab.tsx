
import { Info, Loader2, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DiscrepanciesTabProps {
  isLoading: boolean;
  discrepancies: any[];
}

export const DiscrepanciesTab = ({ isLoading, discrepancies }: DiscrepanciesTabProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-950/50 rounded-md border border-amber-200 dark:border-amber-800">
        <Info className="h-5 w-5 text-amber-500" />
        <p className="text-sm">
          Cette section détecte les sports qui pourraient avoir des noms différents 
          dans l'interface et la base de données, causant des problèmes d'association.
        </p>
      </div>

      {discrepancies.length === 0 ? (
        <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-md border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm">Aucune divergence de noms détectée.</p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Forme de base</TableHead>
              <TableHead>Variations trouvées</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discrepancies.map((discrepancy, index) => (
              <TableRow key={index}>
                <TableCell>{discrepancy.baseForm}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {discrepancy.variations.map((variation: string, i: number) => (
                      <Badge key={i} variant="outline">{variation}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Conseils de résolution:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Assurez-vous d'utiliser exactement le même nom de sport dans le code et la base de données</li>
          <li>Si le nom diffère entre l'interface ("Rugby à XV") et la base ("Rugby"), mettez à jour la base</li>
          <li>Utilisez l'onglet Explorer pour voir les noms exacts des sports et positions dans la base</li>
        </ul>
      </div>
    </div>
  );
};
