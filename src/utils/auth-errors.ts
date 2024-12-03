import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError): string => {
  if (error.message.includes("Database error")) {
    return "Erreur lors de la création du profil. Veuillez réessayer.";
  }
  
  if (error.message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  return error.message;
};