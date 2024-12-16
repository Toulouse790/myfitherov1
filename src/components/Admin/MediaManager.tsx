import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MuscleGroupList } from "./MuscleGroupList";
import { MediaList } from "./MediaList";
import { FilterDialog } from "./FilterDialog";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { muscleGroups } from "../Workouts/workoutConstants";
import { Download, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MediaManager = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(muscleGroups[0].id);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: exercises, isLoading, refetch } = useQuery({
    queryKey: ['exercises', selectedGroup, searchQuery],
    queryFn: async () => {
      console.log('=== MediaManager Debug ===');
      console.log('Selected muscle group:', selectedGroup);

      let query = supabase
        .from('unified_exercises')
        .select('*')
        .eq('muscle_group', selectedGroup)
        .eq('est_publié', true)
        .order('name', { ascending: true });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Raw exercises data:', data);

      const mappedExercises = data?.map(dbExercise => {
        const exercise: Exercise = {
          id: dbExercise.id,
          name: dbExercise.name,
          muscleGroup: selectedGroup,
          muscle_group: dbExercise.muscle_group,
          difficulty: Array.isArray(dbExercise.difficulty) ? dbExercise.difficulty : ['beginner'],
          equipment: "",
          location: dbExercise.location || [],
          instructions: [],
          targetMuscles: [],
          objectives: [],
          description: "",
          sets: { beginner: 0, intermediate: 0, advanced: 0 },
          reps: { beginner: 0, intermediate: 0, advanced: 0 },
          restTime: { beginner: 0, intermediate: 0, advanced: 0 },
          calories: 0,
          est_publié: dbExercise.est_publié
        };
        return exercise;
      }) || [];

      console.log('Mapped exercises:', mappedExercises);
      return mappedExercises;
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleBatchPublish = async (publish: boolean) => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('unified_exercises')
        .update({ est_publié: publish })
        .in('id', selectedExercises);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${selectedExercises.length} exercices ${publish ? 'publiés' : 'dépubliés'}`,
      });

      setSelectedExercises([]);
      refetch();
    } catch (error) {
      console.error('Error updating exercises:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    const exercisesToExport = exercises?.filter(ex => 
      selectedExercises.length === 0 || selectedExercises.includes(ex.id)
    );

    if (!exercisesToExport?.length) {
      toast({
        title: "Aucun exercice à exporter",
        description: "Veuillez sélectionner des exercices ou vérifier vos filtres",
        variant: "destructive"
      });
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Groupe Musculaire,Difficulté,Localisation\n"
      + exercisesToExport.map(ex => 
          `${ex.name},${ex.muscle_group},${ex.difficulty.join(';')},${ex.location?.join(';')}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exercices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: `${exercisesToExport.length} exercices exportés`,
    });
  };

  const filteredExercises = exercises || [];

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestion des exercices</h1>
          <div className="flex gap-4">
            <Button onClick={() => handleBatchPublish(true)} disabled={selectedExercises.length === 0}>
              Publier la sélection
            </Button>
            <Button 
              onClick={() => handleBatchPublish(false)} 
              variant="destructive"
              disabled={selectedExercises.length === 0}
            >
              Dépublier la sélection
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un exercice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
          <Button onClick={() => setShowFilters(true)} variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </div>

        <Tabs defaultValue={selectedGroup} value={selectedGroup} className="w-full">
          <div className="bg-[#2A2F3C] p-6 rounded-lg mb-8">
            <MuscleGroupList
              selectedGroup={selectedGroup}
              onGroupSelect={setSelectedGroup}
            />
          </div>
          <MediaList
            exercises={filteredExercises}
            onFileChange={handleFileChange}
            onUpload={refetch}
            selectedFile={selectedFile}
            onDifficultyChange={(difficulty) => {
              setSelectedDifficulties(prev => {
                if (prev.includes(difficulty)) {
                  return prev.filter(d => d !== difficulty);
                }
                return [...prev, difficulty];
              });
            }}
            selectedDifficulties={selectedDifficulties}
            selectedExercises={selectedExercises}
            onExerciseSelect={(id) => {
              setSelectedExercises(prev => {
                if (prev.includes(id)) {
                  return prev.filter(exId => exId !== id);
                }
                return [...prev, id];
              });
            }}
          />
        </Tabs>

        <FilterDialog 
          open={showFilters} 
          onOpenChange={setShowFilters}
          onFilterApply={(muscleGroup) => {
            setSelectedGroup(muscleGroup);
            setShowFilters(false);
          }}
        />
      </div>
    </div>
  );
};