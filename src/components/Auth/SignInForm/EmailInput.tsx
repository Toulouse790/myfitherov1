
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
}

export const EmailInput = ({ email, onChange }: EmailInputProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="email">{t("auth.email")}</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder="votre@email.com"
        required
        autoComplete="email"
      />
    </div>
  );
};
