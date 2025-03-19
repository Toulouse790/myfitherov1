
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step) => {
        const StepIcon = step.icon;
        return (
          <div
            key={step.id}
            className={`flex flex-col items-center space-y-2 ${
              currentStep >= step.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <StepIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden sm:block">{step.title}</span>
          </div>
        );
      })}
    </div>
  );
};
