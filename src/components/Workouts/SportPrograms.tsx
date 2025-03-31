
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  footballPrograms, 
  basketballPrograms, 
  volleyballPrograms, 
  handballPrograms, 
  hockeyPrograms 
} from "@/data/teamSports";
import { 
  tennisPrograms, 
  runningPrograms, 
  swimmingPrograms, 
  cyclingPrograms 
} from "@/data/individualSports";
import { SportProgram, SportType } from "@/types/sports";

export const SportPrograms = () => {
  const [selectedType, setSelectedType] = useState<SportType>("team");

  const renderProgram = (program: SportProgram) => (
    <Card key={program.id} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{program.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{program.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.level}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.duration} semaines
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {program.sessionsPerWeek} séances/semaine
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Objectifs :</h4>
          <ul className="list-disc pl-4 space-y-1">
            {program.goals.map((goal, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Exercices :</h4>
          <div className="space-y-2">
            {program.exercises.map((exercise, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{exercise.name}</p>
                <p className="text-muted-foreground">
                  {exercise.sets} séries × {exercise.reps} répétitions
                  {exercise.notes && ` - ${exercise.notes}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="team" className="flex-1">Sports collectifs</TabsTrigger>
          <TabsTrigger value="individual" className="flex-1">Sports individuels</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ...footballPrograms, 
              ...basketballPrograms,
              ...volleyballPrograms,
              ...handballPrograms,
              ...hockeyPrograms
            ].map(renderProgram)}
          </div>
        </TabsContent>
        <TabsContent value="individual" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ...tennisPrograms, 
              ...runningPrograms,
              ...swimmingPrograms,
              ...cyclingPrograms
            ].map(renderProgram)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
