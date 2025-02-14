
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ProfileNavItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}

export const ProfileNavItem = ({ icon, title, description, path }: ProfileNavItemProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(path)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
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
