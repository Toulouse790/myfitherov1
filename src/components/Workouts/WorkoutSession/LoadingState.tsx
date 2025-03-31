
import { Dumbbell } from "lucide-react";
import { Header } from "@/components/Layout/Header";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 flex items-center justify-center pt-20">
        <div className="animate-spin">
          <Dumbbell className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};
