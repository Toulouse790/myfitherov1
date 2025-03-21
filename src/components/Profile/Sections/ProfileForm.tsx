
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const formSchema = z.object({
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  height_cm: z.string().optional().nullable(),
  weight_kg: z.string().optional().nullable(),
});

interface ProfileFormProps {
  initialData: {
    birth_date: string | null;
    gender: string | null;
    height_cm: number | null;
    weight_kg: number | null;
  };
  onUpdate: (values: z.infer<typeof formSchema>) => void;
}

export function ProfileForm({ initialData, onUpdate }: ProfileFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birth_date: initialData.birth_date || "",
      gender: initialData.gender || "",
      height_cm: initialData.height_cm?.toString() || "",
      weight_kg: initialData.weight_kg?.toString() || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate(values);
  }

  // Calculer l'IMC (Indice de Masse Corporelle) si le poids et la taille sont disponibles
  const calculateBMI = () => {
    const weight = form.watch('weight_kg');
    const height = form.watch('height_cm');
    
    if (!weight || !height) return null;
    
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height) / 100; // Convertir en mètres
    
    if (isNaN(weightValue) || isNaN(heightValue) || heightValue <= 0) return null;
    
    const bmi = weightValue / (heightValue * heightValue);
    return bmi.toFixed(1);
  };
  
  // Déterminer la catégorie d'IMC
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Insuffisance pondérale", color: "text-blue-500" };
    if (bmi < 25) return { category: "Corpulence normale", color: "text-green-500" };
    if (bmi < 30) return { category: "Surpoids", color: "text-yellow-500" };
    if (bmi < 35) return { category: "Obésité modérée", color: "text-orange-500" };
    if (bmi < 40) return { category: "Obésité sévère", color: "text-red-500" };
    return { category: "Obésité morbide", color: "text-red-700" };
  };
  
  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez votre genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height_cm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taille (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="170"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="70"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {bmi && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>IMC:</span>
                <span className="font-bold">{bmi}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>L'Indice de Masse Corporelle permet d'évaluer votre corpulence</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className={bmiInfo?.color}>{bmiInfo?.category}</span>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full sm:w-auto"
        >
          Enregistrer les modifications
        </Button>
      </form>
    </Form>
  );
}
