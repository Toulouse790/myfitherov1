
import { SportPositionValidator } from "@/components/Admin/SportPositionValidator";

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SportPositionValidator />
      </div>
    </div>
  );
};
