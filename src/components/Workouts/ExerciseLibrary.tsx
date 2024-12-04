import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import { exercises } from "./exerciseLibrary";
import { muscleGroups } from "./workoutConstants";

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto space-y-4 p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Chercher"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredMuscleGroups.map((muscle) => (
          <button
            key={muscle.id}
            onClick={() => navigate(`/workout-exercise/${muscle.id}`)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={muscle.image}
                  alt={muscle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">{muscle.name}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};