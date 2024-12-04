import { ChevronRight } from "lucide-react";
import { MeasurementsDialog } from "./Measurements/MeasurementsDialog";

export const MeasurementsSection = () => {
  return (
    <div className="p-6 hover:bg-accent/10 rounded-lg transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Mensurations</h2>
          <p className="text-sm text-muted-foreground">
            Suivez l'évolution de vos mensurations
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <MeasurementsDialog />
    </div>
  );
};