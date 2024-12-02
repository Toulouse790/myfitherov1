import { Header } from "@/components/Layout/Header";
import { BarChart } from "@/components/ui/chart";

const Sleep = () => {
  const sleepData = [
    { name: 'Lun', hours: 7.5 },
    { name: 'Mar', hours: 8 },
    { name: 'Mer', hours: 6.5 },
    { name: 'Jeu', hours: 7 },
    { name: 'Ven', hours: 8.5 },
    { name: 'Sam', hours: 9 },
    { name: 'Dim', hours: 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        <h1 className="text-3xl font-bold">Sommeil</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Moyenne de sommeil</h3>
            <p className="text-4xl font-bold text-primary">7.8h</p>
            <p className="text-sm text-muted-foreground mt-2">Cette semaine</p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Qualité du sommeil</h3>
            <p className="text-4xl font-bold text-primary">85%</p>
            <p className="text-sm text-muted-foreground mt-2">Score moyen</p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Objectif</h3>
            <p className="text-4xl font-bold text-primary">8h</p>
            <p className="text-sm text-muted-foreground mt-2">Par nuit</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Historique du sommeil</h2>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="h-[300px]">
              <BarChart
                data={sleepData}
                index="name"
                categories={['hours']}
                colors={['#8B5CF6']}
                valueFormatter={(value) => `${value}h`}
                yAxisWidth={40}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sleep;