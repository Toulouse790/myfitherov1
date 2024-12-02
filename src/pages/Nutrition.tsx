import { Header } from "@/components/Layout/Header";

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Calories journalières</h3>
            <p className="text-4xl font-bold text-primary">2000</p>
            <p className="text-sm text-muted-foreground mt-2">Objectif quotidien</p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Protéines</h3>
            <p className="text-4xl font-bold text-primary">150g</p>
            <p className="text-sm text-muted-foreground mt-2">Objectif quotidien</p>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Eau</h3>
            <p className="text-4xl font-bold text-primary">2.5L</p>
            <p className="text-sm text-muted-foreground mt-2">Objectif quotidien</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Journal alimentaire</h2>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <p className="text-muted-foreground">
                Le journal alimentaire sera bientôt disponible...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Nutrition;