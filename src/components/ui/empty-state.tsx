
import React from "react";
import { cn } from "@/lib/utils";
import { Dumbbell } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  icon,
  className,
  ...props
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed",
        className
      )}
      {...props}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {icon || <Dumbbell className="h-10 w-10 text-muted-foreground" />}
      </div>
      {title && <h3 className="mt-6 text-xl font-semibold">{title}</h3>}
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
};
