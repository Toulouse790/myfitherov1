import { Card } from "@/components/ui/card";
import { AppSettings as AppSettingsComponent } from "@/components/Profile/Sections/AppSettings";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppSettings = () => {
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
          <h1 className="text-2xl font-bold">Paramètres de l'application</h1>
        </div>

        <Card className="p-6">
          <AppSettingsComponent language="Français" />
        </Card>
      </div>
    </div>
  );
};

export default AppSettings;