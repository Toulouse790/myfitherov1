import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";
import { AppRoutes } from "@/routes";

function App() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/admin') && 
                       !location.pathname.startsWith('/initial-questionnaire');

  return (
    <>
      <AppRoutes />
      {showBottomNav && <BottomNav />}
      <Toaster />
    </>
  );
}

export default App;