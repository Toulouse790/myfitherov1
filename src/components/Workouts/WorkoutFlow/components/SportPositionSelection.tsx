
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Football, Basketball, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Sport {
  id: string;
  name: string;
  type: string;
  icon: JSX.Element;
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
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
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

        // Associer des icônes aux sports
        const sportsWithIcons = data.map(sport => ({
          ...sport,
          icon: getSportIcon(sport.name)
        }));

        setSports(sportsWithIcons);
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
            .eq('sport_id', selectedSport.id);

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
    }
  }, [selectedSport, toast]);

  const getSportIcon = (sportName: string): JSX.Element => {
    const normalizedName = sportName.toLowerCase();
    
    if (normalizedName.includes('foot')) return <Football className="h-6 w-6" />;
    if (normalizedName.includes('basket')) return <Basketball className="h-6 w-6" />;
    
    return <Activity className="h-6 w-6" />;
  };

  const handleSelectPosition = (position: Position) => {
    setSelectedPosition(position);
    if (selectedSport) {
      onSelectSportPosition(selectedSport.id, position.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <div>
          <h3 className="text-lg font-medium mb-4">Sélectionnez votre sport</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sports.map(sport => (
              <Card
                key={sport.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedSport?.id === sport.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedSport(sport)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {sport.icon}
                  </div>
                  <span className="font-medium">{sport.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedSport && (
          <div>
            <h3 className="text-lg font-medium mb-4">Sélectionnez votre poste</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {positions.length > 0 ? (
                positions.map(position => (
                  <Card
                    key={position.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedPosition?.id === position.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectPosition(position)}
                  >
                    <div className="text-center">
                      <span className="font-medium">{position.name}</span>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Aucun poste trouvé pour ce sport
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
