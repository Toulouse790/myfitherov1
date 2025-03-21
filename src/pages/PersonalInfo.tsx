
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/Profile/Sections/ProfileForm";
import { SmartScaleSection } from "@/components/Profile/Sections/SmartScaleSection";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Modifions l'interface ProfileData pour rendre birth_date optionnel et compatible
// avec le type accepté par ProfileForm
interface ProfileData {
  birth_date: string | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
}

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('birth_date, gender, height_cm, weight_kg')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos informations personnelles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  // Adaptons la fonction handleUpdateProfile pour qu'elle soit compatible avec le type
  // que ProfileForm attend
  const handleUpdateProfile = async (values: { 
    birth_date?: string | null;
    gender?: string | null;
    height_cm?: string | null;
    weight_kg?: string | null;
  }) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          birth_date: values.birth_date,
          gender: values.gender,
          height_cm: values.height_cm ? parseFloat(values.height_cm.toString()) : null,
          weight_kg: values.weight_kg ? parseFloat(values.weight_kg.toString()) : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      // Navigate back to profile page
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4 sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Informations personnelles</h1>
        </div>

        <div className="w-full space-y-6">
          <Card className="p-4 sm:p-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
                <Skeleton className="h-10 w-40 mt-4" />
              </div>
            ) : (
              <ProfileForm
                initialData={profileData || {
                  birth_date: null,
                  gender: null,
                  height_cm: null,
                  weight_kg: null,
                }}
                onUpdate={handleUpdateProfile}
              />
            )}
          </Card>
          
          <SmartScaleSection />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
