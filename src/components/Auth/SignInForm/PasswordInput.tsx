import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  password: string;
  onChange: (value: string) => void;
}

export const PasswordInput = ({ password, onChange }: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Mot de passe</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>
    </div>
  );
};