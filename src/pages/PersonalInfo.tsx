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
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Informations personnelles</h1>
        </div>

        <Card className="p-6">
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
  );
};

export default PersonalInfo;