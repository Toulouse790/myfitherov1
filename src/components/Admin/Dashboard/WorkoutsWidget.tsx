import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const WorkoutsWidget = ({ data, title = "Séances d'entraînement" }: { data: any[] | undefined, title?: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = async (session: any) => {
    setSelectedSession(session);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedSession) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          status: selectedSession.status,
          exercises: selectedSession.exercises
        })
        .eq('id', selectedSession.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La séance a été mise à jour avec succès",
      });

      setIsEditing(false);
      setSelectedSession(null);
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 relative">
      <h3 className="font-semibold mb-4">{title}</h3>
      {data && (
        <>
          <BarChart
            data={data}
            index="day"
            categories={["workouts"]}
            colors={["#10B981"]}
            valueFormatter={(value: number) => `${value} séances`}
          />
          <div className="mt-4">
            {isEditing && selectedSession ? (
              <div className="space-y-4">
                <Input
                  value={selectedSession.status}
                  onChange={(e) => setSelectedSession({
                    ...selectedSession,
                    status: e.target.value
                  })}
                  placeholder="Statut"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Sauvegarder</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedSession(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {data.map((session: any) => (
                  <div key={session.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{session.day}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(session)}
                    >
                      Modifier
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};