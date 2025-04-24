
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@/hooks/use-signin";
import { SignInHeader } from "./SignInForm/SignInHeader";
import { EmailInput } from "@/components/Auth/SignInForm/EmailInput";
import { PasswordInput } from "@/components/Auth/SignInForm/PasswordInput";
import { RememberMeCheckbox } from "@/components/Auth/SignInForm/RememberMeCheckbox";
import { NavigationLinks } from "@/components/Auth/SignInForm/NavigationLinks";
import { SubmitButton } from "@/components/Auth/SignInForm/SubmitButton";
import { useNavigate, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const { handleSignIn, isLoading } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  const from = (location.state as any)?.from || "/";
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    debugLogger.log("SignIn", "Tentative de connexion", { email });
    
    const success = await handleSignIn(email, password);
    
    if (success) {
      debugLogger.log("SignIn", "Connexion réussie, redirection vers", from);
      navigate(from);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted/40">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <SignInHeader />
          
          <form onSubmit={onSubmit} className="space-y-4 mt-6">
            <EmailInput 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            
            <PasswordInput 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            <div className="flex items-center justify-between">
              <RememberMeCheckbox 
                checked={rememberMe} 
                onCheckedChange={setRememberMe} 
              />
              <NavigationLinks />
            </div>
            
            <SubmitButton isLoading={isLoading} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
