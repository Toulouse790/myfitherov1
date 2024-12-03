import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface WorkoutExerciseDetailProps {
  onBack?: () => void;
}

export const WorkoutExerciseDetail: React.FC<WorkoutExerciseDetailProps> = ({ onBack }) => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/workouts');
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'exercice</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ID de l'exercice : {exerciseId}</p>
          {/* Ajoutez ici les détails de l'exercice */}
        </CardContent>
      </Card>
    </div>
  );
};
