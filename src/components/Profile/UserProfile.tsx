import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogOut, User, Bell, Moon, Sun, Languages } from "lucide-react";
import { UserProfile as UserProfileType } from "@/types/user";
import { ProfileHeader } from "./ProfileHeader";
import { ThemeSelector } from "@/components/Theme/ThemeSelector";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockUserProfile: UserProfileType = {
  id: "1",
  username: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg",
  goals: {
    primary: "muscle_gain",
    weeklyWorkouts: 4,
    dailyCalories: 2500,
    sleepHours: 8
  },
  preferences: {
    theme: "system",
    language: "fr",
    notifications: true,
    useTutorial: true,
    equipment: ["haltères", "tapis"]
  },
  stats: {
    workoutsCompleted: 48,
    totalWorkoutMinutes: 1440,
    streakDays: 7,
    points: 1250,
    level: 5
  },
  achievements: [],
  isPremium: false
};

export const UserProfile = () => {
  const [profile] = useState<UserProfileType>(mockUserProfile);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("Français");
  const [questionnaire, setQuestionnaire] = useState<{
    objective: string;
    training_frequency: string;
    experience_level: string;
    available_equipment: string;
  } | null>(null);

  useEffect(() => {
    fetchQuestionnaireResponses();
  }, []);

  const fetchQuestionnaireResponses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences d'entraînement",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setQuestionnaire(data);
    }
  };

  const updateQuestionnaireResponse = async (field: string, value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('questionnaire_responses')
      .update({ [field]: value })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive",
      });
      return;
    }

    setQuestionnaire(prev => prev ? { ...prev, [field]: value } : null);
    toast({
      title: "Succès",
      description: "Vos préférences ont été mises à jour",
    });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
      return;
    }
    navigate("/signin");
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    toast({
      title: "Préférence mise à jour",
      description: `${preference} a été ${value ? 'activé' : 'désactivé'}`,
    });
  };

  const getObjectiveLabel = (objective: string) => {
    const objectives = {
      weight_loss: "Perte de poids",
      muscle_gain: "Prise de masse musculaire",
      maintenance: "Maintien de la forme"
    };
    return objectives[objective as keyof typeof objectives] || objective;
  };

  const getExperienceLevelLabel = (level: string) => {
    const levels = {
      sedentary: "Sédentaire",
      lightly_active: "Légèrement actif",
      moderately_active: "Modérément actif",
      very_active: "Très actif",
      extra_active: "Extrêmement actif"
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getEquipmentLabel = (equipment: string) => {
    const equipments = {
      home: "À la maison",
      gym: "En salle de sport",
      outdoor: "En extérieur"
    };
    return equipments[equipment as keyof typeof equipments] || equipment;
  };

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <Card>
        <CardContent className="pt-6">
          <ProfileHeader profile={profile} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Préférences d'entraînement</h2>
            <div className="space-y-4">
              {questionnaire && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Objectif principal</label>
                    <Select
                      value={questionnaire.objective}
                      onValueChange={(value) => updateQuestionnaireResponse("objective", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre objectif" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Perte de poids</SelectItem>
                        <SelectItem value="muscle_gain">Prise de masse musculaire</SelectItem>
                        <SelectItem value="maintenance">Maintien de la forme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fréquence d'entraînement</label>
                    <Select
                      value={questionnaire.training_frequency}
                      onValueChange={(value) => updateQuestionnaireResponse("training_frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6].map((days) => (
                          <SelectItem key={days} value={days.toString()}>
                            {days} jours par semaine
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Niveau d'activité</label>
                    <Select
                      value={questionnaire.experience_level}
                      onValueChange={(value) => updateQuestionnaireResponse("experience_level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sédentaire</SelectItem>
                        <SelectItem value="lightly_active">Légèrement actif</SelectItem>
                        <SelectItem value="moderately_active">Modérément actif</SelectItem>
                        <SelectItem value="very_active">Très actif</SelectItem>
                        <SelectItem value="extra_active">Extrêmement actif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Équipement disponible</label>
                    <Select
                      value={questionnaire.available_equipment}
                      onValueChange={(value) => updateQuestionnaireResponse("available_equipment", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre équipement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">À la maison</SelectItem>
                        <SelectItem value="gym">En salle de sport</SelectItem>
                        <SelectItem value="outdoor">En extérieur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Rappels d'entraînement</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(checked) => {
                    setNotifications(checked);
                    handlePreferenceChange("Notifications", checked);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de l'application</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">Mode sombre</p>
                    <p className="text-sm text-muted-foreground">Changer l'apparence</p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                    setDarkMode(checked);
                    handlePreferenceChange("Mode sombre", checked);
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Langue</p>
                    <p className="text-sm text-muted-foreground">{language}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thème</p>
                  <p className="text-sm text-muted-foreground">Personnaliser les couleurs</p>
                </div>
                <ThemeSelector />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => {
              toast({
                title: "Attention",
                description: "Cette action est irréversible. Contactez le support pour supprimer votre compte.",
                variant: "destructive",
              });
            }}
          >
            Supprimer le compte
          </Button>
        </div>
      </div>
    </div>
  );
};