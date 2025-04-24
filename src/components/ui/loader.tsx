
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-b-2 border-primary",
        className
      )}
      {...props}
    />
  );
}
