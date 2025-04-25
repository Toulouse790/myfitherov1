
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  title?: string;
}

export const ErrorState = ({ message, onRetry, className, title }: ErrorStateProps) => {
  const { t } = useLanguage();
  
  return (
    <div className={`text-center py-8 ${className}`}>
      <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
      <h3 className="mt-4 font-medium">
        {title || t('common.error', { fallback: "Erreur" })}
      </h3>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        {message || t('common.errorOccurred', { fallback: "Une erreur s'est produite" })}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {t('common.retry', { fallback: "Réessayer" })}
        </Button>
      )}
    </div>
  );
};
