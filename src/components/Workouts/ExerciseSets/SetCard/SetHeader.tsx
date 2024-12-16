import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronUp } from "lucide-react";

interface SetHeaderProps {
  setId: number;
  personalRecord: number | null;
  lastUsedWeight: number | null;
}

export const SetHeader = ({ setId, personalRecord, lastUsedWeight }: SetHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <span className="font-medium">Série {setId}</span>
      <div className="flex flex-wrap gap-2">
        {personalRecord && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {personalRecord}kg
          </Badge>
        )}
        {lastUsedWeight && (
          <Badge variant="outline" className="flex items-center gap-1">
            <ChevronUp className="w-3 h-3" />
            {lastUsedWeight}kg
          </Badge>
        )}
      </div>
    </div>
  );
};