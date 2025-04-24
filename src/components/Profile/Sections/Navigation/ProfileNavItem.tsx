
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileNavItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  highlight?: boolean;
}

export const ProfileNavItem = ({ icon, title, description, path, highlight }: ProfileNavItemProps) => {
  return (
    <Link to={path} className="block w-full">
      <div className={cn(
        "flex items-center p-3 rounded-lg transition-colors hover:bg-accent",
        highlight && "border border-primary/20"
      )}>
        <div className="mr-3">
          {icon}
        </div>
        <div>
          <h4 className={cn(
            "font-medium",
            highlight && "text-primary font-semibold"
          )}>{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};
