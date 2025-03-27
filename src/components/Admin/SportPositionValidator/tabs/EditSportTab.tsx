
import { useState } from "react";
import { Loader2, Save, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { updateSportName } from "@/utils/sports/updaters";
import { useToast } from "@/hooks/use-toast";

// Schéma de validation pour le formulaire d'édition de sport
const sportFormSchema = z.object({
  sportId: z.string({
    required_error: "Veuillez sélectionner un sport",
  }),
  newName: z.string({
    required_error: "Le nom du sport est requis",
  }).min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }).max(50, {
    message: "Le nom ne doit pas dépasser 50 caractères",
  }),
  sportType: z.string({
    required_error: "Veuillez sélectionner un type de sport",
  }),
});

type SportFormValues = z.infer<typeof sportFormSchema>;

interface EditSportTabProps {
  isLoading: boolean;
  sports: any[];
  onSportUpdated: () => void;
}

export const EditSportTab = ({ isLoading, sports, onSportUpdated }: EditSportTabProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSport, setSelectedSport] = useState<any | null>(null);
  const { toast } = useToast();

  const form = useForm<SportFormValues>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      sportId: "",
      newName: "",
      sportType: ""
    },
  });

  const handleSportSelection = (sportId: string) => {
    const sport = sports.find(s => s.id === sportId);
    if (sport) {
      setSelectedSport(sport);
      form.setValue("sportId", sport.id);
      form.setValue("newName", sport.name);
      form.setValue("sportType", sport.type || "team");
    }
  };

  const onSubmit = async (data: SportFormValues) => {
    if (data.newName === selectedSport?.name && data.sportType === selectedSport?.type) {
      toast({
        title: "Aucun changement détecté",
        description: "Veuillez modifier le nom ou le type du sport avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateSportName(data.sportId, data.newName, data.sportType);
      
      if (result.success) {
        toast({
          title: "Sport mis à jour",
          description: `Le sport a été renommé avec succès de "${selectedSport?.name}" à "${data.newName}"`,
        });
        onSportUpdated();
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Une erreur est survenue lors de la mise à jour du sport",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du sport:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle>Modification des sports</AlertTitle>
        <AlertDescription>
          Cette section vous permet de mettre à jour les noms des sports dans la base de données.
          Sélectionnez un sport, modifiez son nom et enregistrez les changements.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Modifier un sport</CardTitle>
          <CardDescription>
            Sélectionnez un sport dans la liste et modifiez ses informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport à modifier</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleSportSelection(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name} ({sport.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedSport && (
                <>
                  <FormField
                    control={form.control}
                    name="newName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du sport" {...field} />
                        </FormControl>
                        <FormDescription>
                          Le nom actuel est "{selectedSport.name}"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de sport</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="team">Collectif</SelectItem>
                            <SelectItem value="individual">Individuel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Le type actuel est "{selectedSport.type === 'team' ? 'Collectif' : 'Individuel'}"
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour en cours...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
