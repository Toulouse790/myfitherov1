import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MeasurementFormData {
  chest_cm: string;
  biceps_left_cm: string;
  biceps_right_cm: string;
  forearm_left_cm: string;
  forearm_right_cm: string;
  waist_cm: string;
  hips_cm: string;
  thigh_left_cm: string;
  thigh_right_cm: string;
  calf_left_cm: string;
  calf_right_cm: string;
}

interface MeasurementHistory {
  measurement_date: string;
  [key: string]: any;
}

export const MeasurementsDialog = () => {
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementFormData>({
    chest_cm: "",
    biceps_left_cm: "",
    biceps_right_cm: "",
    forearm_left_cm: "",
    forearm_right_cm: "",
    waist_cm: "",
    hips_cm: "",
    thigh_left_cm: "",
    thigh_right_cm: "",
    calf_left_cm: "",
    calf_right_cm: "",
  });
  const [history, setHistory] = useState<MeasurementHistory[]>([]);
  const [selectedMeasure, setSelectedMeasure] = useState("chest_cm");
  const { toast } = useToast();

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('muscle_measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measurement_date', { ascending: true });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des mesures",
        variant: "destructive",
      });
      return;
    }

    setHistory(data || []);
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const measurementsData = Object.entries(measurements).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = parseFloat(value);
      }
      return acc;
    }, {} as Record<string, number>);

    const { error } = await supabase
      .from('muscle_measurements')
      .insert({
        user_id: user.id,
        ...measurementsData,
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les mesures",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Vos mesures ont été enregistrées",
    });

    fetchHistory();
    setOpen(false);
  };

  const measurementLabels: Record<string, string> = {
    chest_cm: "Poitrine",
    biceps_left_cm: "Biceps gauche",
    biceps_right_cm: "Biceps droit",
    forearm_left_cm: "Avant-bras gauche",
    forearm_right_cm: "Avant-bras droit",
    waist_cm: "Tour de taille",
    hips_cm: "Hanches",
    thigh_left_cm: "Cuisse gauche",
    thigh_right_cm: "Cuisse droite",
    calf_left_cm: "Mollet gauche",
    calf_right_cm: "Mollet droit",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => {
            fetchHistory();
          }}
        >
          Ajouter mes mensurations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mes mensurations</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.entries(measurementLabels).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                step="0.1"
                value={measurements[key as keyof MeasurementFormData]}
                onChange={(e) => setMeasurements(prev => ({
                  ...prev,
                  [key]: e.target.value
                }))}
                placeholder="0.0"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Évolution</Label>
            <select 
              value={selectedMeasure}
              onChange={(e) => setSelectedMeasure(e.target.value)}
              className="p-2 border rounded-md"
            >
              {Object.entries(measurementLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="measurement_date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [`${value} cm`, measurementLabels[selectedMeasure]]}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMeasure} 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};