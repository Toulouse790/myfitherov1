
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { 
  Sport, 
  SportPosition, 
  SportProgram, 
  fetchSports, 
  fetchPositions, 
  fetchPrograms, 
  createWorkoutFromProgram 
} from "@/utils/api/sportProgramsApi";

export const useSportPrograms = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [positions, setPositions] = useState<SportPosition[]>([]);
  const [programs, setPrograms] = useState<SportProgram[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Charger les sports
  useEffect(() => {
    const loadSports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchSports();
        
        if (error) throw error;
        
        setSports(data || []);
        if (data && data.length > 0) {
          setSelectedSport(data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sports:", error);
        toast({
          title: t("common.error"),
          description: t("sports.loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSports();
  }, [toast, t]);
  
  // Charger les positions quand un sport est sélectionné
  useEffect(() => {
    const loadPositions = async () => {
      if (!selectedSport) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await fetchPositions(selectedSport);
        
        if (error) throw error;
        
        setPositions(data || []);
        setSelectedPosition(data && data.length > 0 ? data[0].id : "");
      } catch (error) {
        console.error("Erreur lors du chargement des positions:", error);
        toast({
          title: t("common.error"),
          description: t("positions.loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (selectedSport) {
      loadPositions();
    }
  }, [selectedSport, toast, t]);
  
  // Charger les programmes quand un sport et une position sont sélectionnés
  useEffect(() => {
    const loadPrograms = async () => {
      if (!selectedSport) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await fetchPrograms(selectedSport, selectedPosition);
        
        if (error) throw error;
        
        setPrograms(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des programmes:", error);
        toast({
          title: t("common.error"),
          description: t("programs.loadError"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (selectedSport) {
      loadPrograms();
    }
  }, [selectedSport, selectedPosition, toast, t]);
  
  // Gérer la sélection d'un programme
  const handleProgramSelect = async (program: SportProgram) => {
    try {
      const { data: session, error } = await createWorkoutFromProgram(program);
        
      if (error) throw error;
      
      if (session) {
        // Naviguer vers la session d'entraînement
        navigate(`/workouts/exercise/next-workout?session=${session.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionCreationFailed"),
        variant: "destructive",
      });
    }
  };

  return {
    sports,
    positions,
    programs,
    selectedSport,
    selectedPosition,
    isLoading,
    setSelectedSport,
    setSelectedPosition,
    handleProgramSelect
  };
};
