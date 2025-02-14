
import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError): string => {
  console.error("Detailed signup error:", error);
  
  if (error.message.includes("profiles_username_key")) {
    return "Ce pseudo est déjà utilisé. Veuillez en choisir un autre.";
  }
  
  if (error.message.includes("Database error saving new user")) {
    return "Erreur lors de la création du profil. Veuillez réessayer avec un autre nom d'utilisateur.";
  }
  
  if (error.message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  if (error.message.includes("User already registered")) {
    return "Un compte existe déjà avec cet email. Veuillez vous connecter.";
  }

  switch (error.status) {
    case 409:
      return "Ce pseudo ou cet email est déjà utilisé. Veuillez en choisir un autre.";
    case 500:
      return "Erreur serveur. Veuillez réessayer dans quelques instants.";
    case 422:
      if (error.message.includes("already registered")) {
        return "Un compte existe déjà avec cet email.";
      }
      return "Email invalide ou mot de passe trop court.";
    case 400:
      return "Données d'inscription invalides.";
    default:
      return error.message || "Une erreur est survenue lors de l'inscription.";
  }
};
