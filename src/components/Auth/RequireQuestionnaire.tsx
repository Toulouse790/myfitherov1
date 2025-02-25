
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireQuestionnaireProps {
  children: React.ReactNode;
}

export const RequireQuestionnaire: React.FC<RequireQuestionnaireProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Vérifier si l'utilisateur a complété le questionnaire
  // Si non, rediriger vers /initial-questionnaire
  if (user && !user.hasCompletedQuestionnaire) {
    navigate("/initial-questionnaire");
    return null;
  }

  return <>{children}</>;
};
