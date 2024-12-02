import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

export const AdminDashboard = () => {
  const revenueData = [
    { month: "Jan", revenue: 2400 },
    { month: "Fév", revenue: 1398 },
    { month: "Mar", revenue: 9800 },
    { month: "Avr", revenue: 3908 },
    { month: "Mai", revenue: 4800 },
    { month: "Jun", revenue: 3800 },
  ];

  const userActivityData = [
    { day: "Lun", users: 500 },
    { day: "Mar", users: 300 },
    { day: "Mer", users: 600 },
    { day: "Jeu", users: 400 },
    { day: "Ven", users: 700 },
    { day: "Sam", users: 200 },
    { day: "Dim", users: 300 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Revenus mensuels</h3>
        <BarChart
          data={revenueData}
          index="month"
          categories={["revenue"]}
          colors={["#8B5CF6"]}
          valueFormatter={(value: number) => `${value}€`}
        />
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Activité utilisateurs</h3>
        <BarChart
          data={userActivityData}
          index="day"
          categories={["users"]}
          colors={["#10B981"]}
          valueFormatter={(value: number) => `${value} utilisateurs`}
        />
      </Card>
    </div>
  );
};