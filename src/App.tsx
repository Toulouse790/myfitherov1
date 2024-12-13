import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";

function App() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/admin') && 
                       !location.pathname.startsWith('/initial-questionnaire');

  return (
    <>
      <div>
        {/* Le contenu sera injecté ici par le router */}
      </div>
      {showBottomNav && <BottomNav />}
      <Toaster />
    </>
  );
}

export default App;