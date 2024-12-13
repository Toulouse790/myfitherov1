import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/Layout/BottomNav";
import { router } from "@/routes";
import { RouterProvider } from "react-router-dom";

function App() {
  const location = useLocation();
  const showBottomNav = !location.pathname.startsWith('/admin') && 
                       !location.pathname.startsWith('/initial-questionnaire');

  return (
    <>
      <RouterProvider router={router} />
      {showBottomNav && <BottomNav />}
      <Toaster />
    </>
  );
}

export default App;