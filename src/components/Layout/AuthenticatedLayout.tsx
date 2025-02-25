
import { Outlet } from "react-router-dom";
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";

export const AuthenticatedLayout = () => {
  return (
    <RequireQuestionnaire>
      <Outlet />
    </RequireQuestionnaire>
  );
};
