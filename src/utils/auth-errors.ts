import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError): string => {
  console.error("Detailed signup error:", error);
  
  if (error.message.includes("Database error saving new user")) {
    return "Erreur lors de la création du profil. Veuillez réessayer avec un autre nom d'utilisateur.";
  }
  
  if (error.message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  // Handle specific error codes
  switch (error.status) {
    case 500:
      return "Erreur serveur. Veuillez réessayer dans quelques instants.";
    case 422:
      return "Email invalide ou mot de passe trop court.";
    case 400:
      if (error.message.includes("already registered")) {
        return "Un compte existe déjà avec cet email.";
      }
      return "Données d'inscription invalides.";
    default:
      return error.message || "Une erreur est survenue lors de l'inscription.";
  }
};