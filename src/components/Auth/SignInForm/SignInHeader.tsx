import { Link } from "react-router-dom";

export const SignInHeader = () => {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Connexion
      </h1>
      <p className="text-sm text-muted-foreground">
        Entrez vos identifiants pour accéder à votre compte
      </p>
      <p className="text-sm">
        Pas encore de compte ?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
};