import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError): string => {
  console.error("Detailed signup error:", error);
  
  if (error.message.includes("Database error saving new user")) {
    return "Erreur lors de la création du profil. Veuillez réessayer avec un autre nom d'utilisateur.";
  }
  
  if (error.message.includes("Password should be")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  if (error.message.includes("User already registered")) {
    return "Un compte existe déjà avec cet email. Veuillez vous connecter.";
  }

  // Handle specific error codes
  switch (error.status) {
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

export const handleAuthError = (error: AuthError): string => {
  console.error("Detailed auth error:", error);

  if (error.message.includes("Invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }

  if (error.message.includes("Email not confirmed")) {
    return "Veuillez confirmer votre email avant de vous connecter.";
  }

  switch (error.status) {
    case 500:
      return "Erreur serveur. Veuillez réessayer dans quelques instants.";
    case 401:
      return "Email ou mot de passe incorrect.";
    case 400:
      return "Données de connexion invalides.";
    default:
      return error.message || "Une erreur est survenue lors de la connexion.";
  }
};