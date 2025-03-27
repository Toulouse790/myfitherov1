
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sport {
  id: string;
  name: string;
  type: string;
}

interface Position {
  id: string;
  name: string;
  sport_id: string;
}

interface SportPositionSelectionProps {
  onSelectSportPosition: (sportId: string, positionId: string) => void;
  onBack: () => void;
}

export const SportPositionSelection = ({ onSelectSportPosition, onBack }: SportPositionSelectionProps) => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('sports')
          .select('*');

        if (error) throw error;
        setSports(data);
      } catch (error) {
        console.error('Erreur lors du chargement des sports:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les sports",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, [toast]);

  useEffect(() => {
    if (selectedSport) {
      const fetchPositions = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('sport_positions')
            .select('*')
            .eq('sport_id', selectedSport);

          if (error) throw error;
          setPositions(data);
        } catch (error) {
          console.error('Erreur lors du chargement des postes:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les postes",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchPositions();
    } else {
      setPositions([]);
    }
  }, [selectedSport, toast]);

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId);
    setSelectedPosition(null);
  };

  const handlePositionChange = (positionId: string) => {
    setSelectedPosition(positionId);
    if (selectedSport) {
      onSelectSportPosition(selectedSport, positionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">
          Sélection sport et poste
        </h2>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-md font-medium">Sélectionnez votre sport</h3>
              <Select value={selectedSport || ""} onValueChange={handleSportChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un sport" />
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

            {selectedSport && (
              <div className="space-y-2">
                <h3 className="text-md font-medium">Sélectionnez votre poste</h3>
                <Select 
                  value={selectedPosition || ""} 
                  onValueChange={handlePositionChange}
                  disabled={positions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={positions.length === 0 ? "Aucun poste disponible" : "Choisir un poste"} />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.length > 0 ? (
                      positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Aucun poste disponible pour ce sport
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedSport && selectedPosition && (
              <Button 
                className="w-full mt-4" 
                onClick={() => onSelectSportPosition(selectedSport, selectedPosition)}
              >
                Confirmer la sélection
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
