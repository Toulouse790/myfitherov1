
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { debugLogger } from "@/utils/debug-logger";
import { useToast } from "@/hooks/use-toast";
import { Sport, SportPosition } from "@/types/workout-session";
import { SportRecommendationOverview } from "../SportRecommendationOverview";
import { useSportExerciseSelection } from "@/hooks/use-sport-exercise-selection";

interface SportPositionSelectionProps {
  onSelectSportPosition: (sportId: string, positionId: string) => void;
  onBack: () => void;
}

export function SportPositionSelection({ onSelectSportPosition, onBack }: SportPositionSelectionProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [positions, setPositions] = useState<SportPosition[]>([]);
  const [isLoadingSports, setIsLoadingSports] = useState(true);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const { toast } = useToast();
  
  const { scientificRecommendations } = useSportExerciseSelection(
    selectedSportId, 
    selectedPositionId
  );

  useEffect(() => {
    async function fetchSports() {
      try {
        setIsLoadingSports(true);
        const { data, error } = await supabase
          .from('sports')
          .select('id, name, type, category');
        
        if (error) throw error;
        
        debugLogger.log("SportPositionSelection", "Sports chargés:", data?.length);
        setSports(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des sports:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des sports",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSports(false);
      }
    }
    
    fetchSports();
  }, [toast]);

  useEffect(() => {
    async function fetchPositions() {
      if (!selectedSportId) {
        setPositions([]);
        return;
      }
      
      try {
        setIsLoadingPositions(true);
        const { data, error } = await supabase
          .from('sport_positions')
          .select('id, name, sport_id, performance_metrics, recommended_exercises')
          .eq('sport_id', selectedSportId);
        
        if (error) throw error;
        
        debugLogger.log("SportPositionSelection", "Positions chargées:", data?.length);
        setPositions(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des positions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les positions pour ce sport",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPositions(false);
      }
    }
    
    fetchPositions();
  }, [selectedSportId, toast]);

  const handleSportChange = (value: string) => {
    setSelectedSportId(value);
    setSelectedPositionId("");
  };

  const handlePositionChange = (value: string) => {
    setSelectedPositionId(value);
  };

  const handleContinue = () => {
    if (selectedSportId && selectedPositionId) {
      onSelectSportPosition(selectedSportId, selectedPositionId);
    } else {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un sport et un poste",
        variant: "destructive",
      });
    }
  };

  const getSelectedSportName = () => {
    return sports.find(sport => sport.id === selectedSportId)?.name || "";
  };

  const getSelectedPositionName = () => {
    return positions.find(position => position.id === selectedPositionId)?.name || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Sélection sport et poste</h2>
          <p className="text-sm text-muted-foreground">
            Personnalisez votre entraînement en fonction de votre sport et votre poste
          </p>
        </div>
      </div>

      <Card className="p-6">
        <CardContent className="p-0 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sport-select">Sport</Label>
              <Select 
                value={selectedSportId} 
                onValueChange={handleSportChange}
                disabled={isLoadingSports}
              >
                <SelectTrigger id="sport-select">
                  <SelectValue placeholder="Sélectionnez un sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSportId && (
              <div className="space-y-2">
                <Label htmlFor="position-select">Poste</Label>
                <Select 
                  value={selectedPositionId} 
                  onValueChange={handlePositionChange}
                  disabled={isLoadingPositions || positions.length === 0}
                >
                  <SelectTrigger id="position-select">
                    <SelectValue placeholder={
                      isLoadingPositions 
                        ? "Chargement..." 
                        : positions.length === 0 
                          ? "Aucun poste disponible" 
                          : "Sélectionnez un poste"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {selectedSportId && selectedPositionId && (
            <SportRecommendationOverview 
              recommendations={scientificRecommendations}
              sportName={getSelectedSportName()}
              positionName={getSelectedPositionName()}
            />
          )}

          <Button 
            onClick={handleContinue} 
            className="w-full" 
            disabled={!selectedSportId || !selectedPositionId}
          >
            Continuer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
