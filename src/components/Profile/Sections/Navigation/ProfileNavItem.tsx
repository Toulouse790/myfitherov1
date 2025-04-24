
import { Link } from "react-router-dom";
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
        <div className="mr-3 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={cn(
            "font-medium text-foreground",
            highlight && "text-primary font-semibold"
          )}>{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
};
