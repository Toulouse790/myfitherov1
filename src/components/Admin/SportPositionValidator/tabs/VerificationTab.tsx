import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerificationTabProps {
  isValidating: boolean;
  validationResult: any;
  sports: any[];
  selectedSportId: string;
  setSelectedSportId: (id: string) => void;
  handleFix: () => Promise<void>;
  handleFixRugby: () => Promise<void>;
}

export const VerificationTab = ({
  isValidating,
  validationResult,
  sports,
  selectedSportId,
  setSelectedSportId,
  handleFix,
  handleFixRugby
}: VerificationTabProps) => {
  if (isValidating) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-md border bg-card">
      <div className="flex items-center gap-2 mb-2">
        {validationResult.valid ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        )}
        <h3 className="font-medium">{validationResult.message}</h3>
      </div>
      
      {!validationResult.valid && validationResult.invalidPositions?.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Postes avec problèmes :</h4>
          <ul className="list-disc pl-5 space-y-1">
            {validationResult.invalidPositions.slice(0, 5).map((pos: any) => (
              <li key={pos.id} className="text-sm text-muted-foreground">
                {pos.name} (ID: {pos.id}, Sport ID: {pos.sport_id || "non défini"})
              </li>
            ))}
            {validationResult.invalidPositions.length > 5 && (
              <li className="text-sm text-muted-foreground italic">
                Et {validationResult.invalidPositions.length - 5} autres...
              </li>
            )}
          </ul>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sport pour la correction :</h4>
              <Select value={selectedSportId} onValueChange={setSelectedSportId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleFix} 
                disabled={!selectedSportId}
                className="w-full"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-0" />
                Corriger les associations
              </Button>
              
              <Button 
                onClick={handleFixRugby} 
                className="w-full"
                variant="secondary"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-0" />
                Corriger le problème Rugby/Rugby à XV
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
