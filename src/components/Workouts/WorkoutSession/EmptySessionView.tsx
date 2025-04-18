
import React from 'react';
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export const EmptySessionView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {t("workouts.sessionNotFound")}
        </h2>
        <p className="text-muted-foreground">
          {t("workouts.sessionEmptyDesc")}
        </p>
        
        <div className="flex flex-col space-y-3 w-full">
          <Button 
            onClick={() => navigate('/workouts/create')} 
            className="w-full"
          >
            {t("workouts.createWorkout")}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/workouts')} 
            className="w-full"
          >
            {t("workouts.backToWorkouts")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
