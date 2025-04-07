
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Sport, SportPosition } from "@/utils/api/sportProgramsApi";

interface SportSelectionStepProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  updateValue: (key: string, value: any) => void;
  values: {
    sport_id?: string;
    position_id?: string;
    [key: string]: any;
  };
}

export const SportSelectionStep: React.FC<SportSelectionStepProps> = ({
  onNext,
  onBack,
  currentStep,
  totalSteps,
  updateValue,
  values,
}) => {
  const { t } = useLanguage();
  const [sports, setSports] = useState<Sport[]>([]);
  const [positions, setPositions] = useState<SportPosition[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>(values.sport_id || "");
  const [selectedPosition, setSelectedPosition] = useState<string>(values.position_id || "");
  const [isLoading, setIsLoading] = useState(true);

  // Charger les sports disponibles
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('sports')
          .select('id, name')
          .order('name');

        if (error) throw error;

        setSports(data || []);
        console.log("Sports chargés:", data?.length);
        
        if (data && data.length > 0 && !selectedSport) {
          const firstSport = data[0].id;
          setSelectedSport(firstSport);
          updateValue("sport_id", firstSport);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  // Charger les positions quand un sport est sélectionné
  useEffect(() => {
    const fetchPositions = async () => {
      if (!selectedSport) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('sport_positions')
          .select('id, name, sport_id')
          .eq('sport_id', selectedSport)
          .order('name');

        if (error) throw error;

        setPositions(data || []);
        console.log("Positions chargées:", data?.length);
        
        if (data && data.length > 0) {
          const firstPosition = data[0].id;
          setSelectedPosition(firstPosition);
          updateValue("position_id", firstPosition);
        } else {
          setSelectedPosition("");
          updateValue("position_id", "");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des positions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSport) {
      fetchPositions();
    }
  }, [selectedSport]);

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId);
    updateValue("sport_id", sportId);
    setSelectedPosition("");  // Réinitialiser la position car elle dépend du sport
  };

  const handlePositionChange = (positionId: string) => {
    setSelectedPosition(positionId);
    updateValue("position_id", positionId);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-6 text-center">
          {t("sports.selectSport")}
        </h2>
        
        <p className="text-center text-muted-foreground mb-6">
          {t("sports.selectionHelp")}
        </p>
        
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="sport-select" className="block text-sm font-medium mb-2">
              {t("sports.yourSport")}
            </label>
            <Select
              value={selectedSport}
              onValueChange={handleSportChange}
              disabled={isLoading || sports.length === 0}
            >
              <SelectTrigger id="sport-select" className="w-full">
                <SelectValue placeholder={t("sports.selectSport")} />
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

          {positions.length > 0 && (
            <div>
              <label htmlFor="position-select" className="block text-sm font-medium mb-2">
                {t("positions.yourPosition")}
              </label>
              <Select
                value={selectedPosition}
                onValueChange={handlePositionChange}
                disabled={isLoading || positions.length === 0}
              >
                <SelectTrigger id="position-select" className="w-full">
                  <SelectValue placeholder={t("positions.selectPosition")} />
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

        <div className="flex justify-between mt-8">
          <Button onClick={onBack} variant="outline">
            {t("common.back")}
          </Button>
          <Button onClick={onNext}>
            {t("common.continue")}
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          {t("questionnaire.step", { step: currentStep, total: totalSteps })}
        </div>
      </CardContent>
    </Card>
  );
};
