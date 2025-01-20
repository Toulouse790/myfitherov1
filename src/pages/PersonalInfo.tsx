import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/Profile/Sections/ProfileForm";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center gap-4 sticky top-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Informations personnelles</h1>
        </div>

        {/* Contenu principal */}
        <div className="w-full space-y-6">
          <Card className="p-4 sm:p-6">
            <ProfileForm
              initialData={{
                birth_date: null,
                gender: null,
                height_cm: null,
                weight_kg: null,
              }}
              onUpdate={() => {}}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;