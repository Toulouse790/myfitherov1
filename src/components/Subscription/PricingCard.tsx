
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  priceDetails?: string;
  description: string;
  features: string[];
  limitations?: string[];
  isPro?: boolean;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onSelect: () => void;
}

export const PricingCard = ({
  title,
  price,
  priceDetails = "",
  description,
  features,
  limitations = [],
  isPro = false,
  isCurrentPlan = false,
  isLoading = false,
  onSelect
}: PricingCardProps) => {
  return (
    <Card className={cn(
      "p-6 relative h-full flex flex-col justify-between",
      isPro && "border-2 border-primary/50 bg-primary/5",
      isPro && "dark:bg-gradient-to-br dark:from-primary/10 dark:to-primary/5"
    )}>
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-medium">Premium</span>
        </div>
      )}
      
      <div>
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <div className="mb-2 flex items-center justify-center">
            <span className="text-4xl font-bold">{price}</span>
            {priceDetails && <span className="text-muted-foreground ml-1">{priceDetails}</span>}
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
          
          {limitations && limitations.length > 0 && (
            <>
              <div className="border-t border-border my-4"></div>
              {limitations.map((limitation, index) => (
                <div key={`limit-${index}`} className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Button 
        className={cn(
          "w-full",
          isPro && "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
        )}
        variant={isPro ? "default" : "outline"}
        onClick={onSelect}
        disabled={isCurrentPlan || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Traitement...
          </span>
        ) : (
          <>
            {isCurrentPlan ? "Plan actuel" : (
              <span className="flex items-center gap-2">
                {isPro && <Sparkles className="h-4 w-4" />}
                {isPro ? "Passer Premium" : "Sélectionner"}
              </span>
            )}
          </>
        )}
      </Button>
    </Card>
  );
};
