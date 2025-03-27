
import Admin from "@/pages/Admin";
import { RequireAdmin } from "@/components/Auth/RequireAdmin";

export const adminRoutes = [
  {
    path: "admin",
    element: <RequireAdmin><Admin /></RequireAdmin>,
  },
];
