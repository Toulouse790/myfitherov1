
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordInputProps {
  password: string;
  onChange: (value: string) => void;
}

export const PasswordInput = ({ password, onChange }: PasswordInputProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="password">{t("auth.password")}</Label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder="••••••••"
        autoComplete="current-password"
      />
    </div>
  );
};
