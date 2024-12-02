import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminStats } from "@/components/Admin/AdminStats";

const Admin = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminHeader />
      <AdminStats />
      <AdminDashboard />
    </div>
  );
};

export default Admin;