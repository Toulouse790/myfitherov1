
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProfileNavItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  highlight?: boolean;
}

export const ProfileNavItem = ({ 
  icon, 
  title, 
  description, 
  path, 
  highlight = false 
}: ProfileNavItemProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={cn(
        "p-4 hover:shadow-md transition-all cursor-pointer group",
        highlight && "border-2 border-primary/50 bg-primary/5"
      )}
      onClick={() => navigate(path)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};
