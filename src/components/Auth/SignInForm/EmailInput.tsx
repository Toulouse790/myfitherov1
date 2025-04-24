
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

export const EmailInput = ({ value, onChange, autoFocus = true }: EmailInputProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="email">{t("auth.email", { fallback: "Email" })}</Label>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder="name@example.com"
        autoComplete="email"
        required
      />
    </div>
  );
};
