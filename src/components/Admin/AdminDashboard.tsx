import { AdminStats } from "./AdminStats";

export const AdminDashboard = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tableau de bord</h2>
      </div>

      <AdminStats />
    </>
  );
};