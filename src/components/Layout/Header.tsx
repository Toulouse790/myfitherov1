import { Dumbbell, User, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">FitTrack</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/stats" className="p-2 hover:text-primary transition-colors">
            <BarChart className="w-5 h-5" />
          </Link>
          <Link to="/profile" className="p-2 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
};