
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "@/components/Dashboard/WorkoutSuggestions/WorkoutCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debugLogger } from "@/utils/debug-logger";
import { Sport, SportPosition, SportProgram, fetchSports, fetchPositions, fetchPrograms, createWorkoutFromProgram } from "@/utils/api/sportProgramsApi";

export const SportProgramsList = () => {
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
        
        debugLogger.log("SportProgramsList", "Sports chargés: " + (data?.length || 0));
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
        
        debugLogger.log("SportProgramsList", "Positions chargées pour le sport " + selectedSport + ": " + (data?.length || 0));
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
        
        debugLogger.log("SportProgramsList", "Programmes chargés: " + (data?.length || 0));
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
  
  // Affichage pendant le chargement
  if (isLoading && sports.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }
  
  // Si pas de sport disponibles
  if (sports.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{t("sports.noSportsAvailable")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélecteurs de sport et position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("sports.selectSport")}</label>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger>
              <SelectValue placeholder={t("sports.selectSport")} />
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
        
        <div>
          <label className="block text-sm font-medium mb-1">{t("positions.selectPosition")}</label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition} disabled={positions.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={positions.length === 0 ? t("positions.noPositionsAvailable") : t("positions.selectPosition")} />
            </SelectTrigger>
            <SelectContent>
              {positions.map(position => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {positions.length === 0 && selectedSport && !isLoading && (
            <p className="text-xs text-muted-foreground mt-1">
              {t("positions.noPositionsAvailable")}
            </p>
          )}
        </div>
      </div>
      
      {/* Liste des programmes */}
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="all">{t("programs.all")}</TabsTrigger>
          <TabsTrigger value="recommended">{t("programs.recommended")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.length > 0 ? (
              programs.map(program => (
                <WorkoutCard
                  key={program.id}
                  title={program.name}
                  description={program.description}
                  programId={program.id}
                  duration={program.duration}
                  difficulty={program.difficulty}
                  onSelect={() => handleProgramSelect(program)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">{t("programs.noProgramsAvailable")}</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recommended" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.filter(p => p.difficulty === 'moderate').length > 0 ? (
              programs
                .filter(p => p.difficulty === 'moderate')
                .map(program => (
                  <WorkoutCard
                    key={program.id}
                    title={program.name}
                    description={program.description}
                    programId={program.id}
                    duration={program.duration}
                    difficulty={program.difficulty}
                    onSelect={() => handleProgramSelect(program)}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">{t("programs.noRecommendedPrograms")}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
