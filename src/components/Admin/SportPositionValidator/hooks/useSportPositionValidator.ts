
import { useState } from "react";
import { validateSportPositions, fixInvalidSportPositions, getSportsAndPositions, analyzeSportNameDiscrepancies, fixRugbyPositions } from "@/utils/sports-validator";
import { useToast } from "@/hooks/use-toast";

export const useSportPositionValidator = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isFixingRugby, setIsFixingRugby] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [sports, setSports] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [discrepancies, setDiscrepancies] = useState<any[]>([]);
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { sports, positions, error } = await getSportsAndPositions();
      
      if (error) {
        throw new Error(error);
      }
      
      setSports(sports || []);
      setPositions(positions || []);
      
      const { discrepancies } = await analyzeSportNameDiscrepancies();
      setDiscrepancies(discrepancies);
      
      await handleValidate();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données des sports et positions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateSportPositions();
      setValidationResult(result);
      
      if (!result.valid && sports.length > 0) {
        setSelectedSportId(sports[0].id);
      }
      
      toast({
        title: result.valid ? "Validation réussie" : "Problèmes détectés",
        description: result.message,
        variant: result.valid ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la validation",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFix = async () => {
    if (!selectedSportId) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un sport par défaut",
        variant: "destructive",
      });
      return;
    }

    setIsFixing(true);
    try {
      const result = await fixInvalidSportPositions(selectedSportId);
      
      toast({
        title: result.success ? "Correction réussie" : "Échec de la correction",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      if (result.success && result.fixedCount > 0) {
        await loadData();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la correction",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleFixRugby = async () => {
    setIsFixingRugby(true);
    try {
      const result = await fixRugbyPositions();
      
      toast({
        title: result.success ? "Correction du Rugby réussie" : "Échec de la correction du Rugby",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      if (result.success && result.fixedCount > 0) {
        await loadData();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la correction des positions de Rugby",
        variant: "destructive",
      });
    } finally {
      setIsFixingRugby(false);
    }
  };

  return {
    isValidating,
    isFixing,
    isFixingRugby,
    isLoading,
    validationResult,
    sports,
    positions,
    selectedSportId,
    setSelectedSportId,
    discrepancies,
    handleValidate,
    handleFix,
    handleFixRugby,
    loadData,
  };
};
