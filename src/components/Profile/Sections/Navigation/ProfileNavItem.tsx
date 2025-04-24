
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isPremium?: boolean;
}

export const ProfileNavItem = ({ href, icon, label, isPremium }: ProfileNavItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isPremium && "text-yellow-500 hover:text-yellow-600"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};
