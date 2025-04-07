
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sport, 
  SportPosition, 
  SportProgram, 
  fetchSports, 
  fetchPositions, 
  fetchPrograms, 
  createWorkoutFromProgram,
  fetchActivePrograms
} from "@/utils/api/sportProgramsApi";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/contexts/AuthContext";

export const useSportPrograms = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [positions, setPositions] = useState<SportPosition[]>([]);
  const [programs, setPrograms] = useState<SportProgram[]>([]);
  const [activePrograms, setActivePrograms] = useState<SportProgram[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le rechargement
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fonction pour forcer le rechargement des données
  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Récupérer les préférences de l'utilisateur depuis le questionnaire
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('sport_id, position_id')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Erreur lors de la récupération des préférences sportives:", error);
          return;
        }
        
        if (data) {
          if (data.sport_id) {
            setSelectedSport(data.sport_id);
            debugLogger.log("useSportPrograms", "Sport préféré de l'utilisateur chargé:", data.sport_id);
          }
          
          if (data.position_id) {
            setSelectedPosition(data.position_id);
            debugLogger.log("useSportPrograms", "Position préférée de l'utilisateur chargée:", data.position_id);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des préférences:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserPreferences();
  }, [user, refreshKey]);

  // Charger les programmes actifs de l'utilisateur
  useEffect(() => {
    const loadActivePrograms = async () => {
      try {
        const { data, error } = await fetchActivePrograms();
        
        if (error) throw error;
        
        setActivePrograms(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des programmes actifs:", error);
      }
    };
    
    loadActivePrograms();
  }, [refreshKey]);

  // Charger les sports
  useEffect(() => {
    const loadSports = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchSports();
        
        if (error) throw error;
        
        setSports(data || []);
        console.log("Sports chargés:", data?.length, data?.map(s => s.name).join(', '));
        
        if (data && data.length > 0 && !selectedSport) {
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
  }, [toast, t, refreshKey, selectedSport]); // Ajout de refreshKey comme dépendance
  
  // Charger les positions quand un sport est sélectionné
  useEffect(() => {
    const loadPositions = async () => {
      if (!selectedSport) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await fetchPositions(selectedSport);
        
        if (error) throw error;
        
        setPositions(data || []);
        console.log("Positions chargées pour", selectedSport, ":", data?.length, data?.map(p => p.name).join(', '));
        
        // Ne définir la position par défaut que si aucune position n'est déjà sélectionnée
        // ou si la position sélectionnée n'est pas compatible avec le sport sélectionné
        if ((!selectedPosition || !data?.some(p => p.id === selectedPosition)) && data && data.length > 0) {
          setSelectedPosition(data[0].id);
        }
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
  }, [selectedSport, toast, t, selectedPosition]);
  
  // Charger les programmes quand un sport et une position sont sélectionnés
  useEffect(() => {
    const loadPrograms = async () => {
      if (!selectedSport) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await fetchPrograms(selectedSport, selectedPosition);
        
        if (error) throw error;
        
        setPrograms(data || []);
        console.log("Programmes chargés:", data?.length);
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
      debugLogger.log("useSportPrograms", "Sélection du programme:", program.name);
      setIsLoading(true);
      
      const { data: session, error } = await createWorkoutFromProgram(program);
      
      if (error) {
        debugLogger.error("useSportPrograms", "Erreur lors de la création de la session:", error);
        throw error;
      }
      
      if (session) {
        // Mettre à jour les programmes actifs
        setActivePrograms(prev => [...prev, program]);
        
        // Afficher une notification de succès
        toast({
          title: t("programs.programStarted") || "Programme démarré",
          description: t("programs.programStartedDescription", { name: program.name }) || 
                       `Le programme ${program.name} a été démarré avec succès`,
        });
        
        // Naviguer vers la page d'entraînement
        debugLogger.log("useSportPrograms", "Redirection vers la session d'entraînement:", session.id);
        navigate(`/workouts/session/${session.id}`);
      } else {
        throw new Error("Session non créée");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionCreationFailed") || 
                     "Impossible de créer la session d'entraînement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sports,
    positions,
    programs,
    selectedSport,
    selectedPosition,
    isLoading,
    activePrograms,
    setSelectedSport,
    setSelectedPosition,
    handleProgramSelect,
    refreshData
  };
};
