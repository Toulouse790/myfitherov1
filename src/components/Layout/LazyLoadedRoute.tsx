
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

interface LazyLoadedRouteProps {
  children: React.ReactNode;
}

export const LazyLoadedRoute = ({ children }: LazyLoadedRouteProps) => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
