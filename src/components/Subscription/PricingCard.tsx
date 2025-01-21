import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPro?: boolean;
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  isPro = false,
  isCurrentPlan = false,
  onSelect
}: PricingCardProps) => {
  return (
    <Card className={cn(
      "p-6 relative",
      isPro && "border-2 border-primary/50 bg-primary/5"
    )}>
      {isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1">
          <Crown className="w-4 h-4" />
          <span className="text-sm font-medium">Premium</span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Gratuit" && <span className="text-muted-foreground">/mois</span>}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button 
        className="w-full" 
        variant={isPro ? "default" : "outline"}
        onClick={onSelect}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan ? "Plan actuel" : "Sélectionner"}
      </Button>
    </Card>
  );
};