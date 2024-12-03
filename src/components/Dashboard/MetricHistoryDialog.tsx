import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

interface MetricHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: {
    label: string;
    value: string;
    color: string;
    history: {
      daily: { date: string; value: number }[];
      weekly: { date: string; value: number }[];
      monthly: { date: string; value: number }[];
    };
  };
}

export const MetricHistoryDialog = ({
  open,
  onOpenChange,
  metric,
}: MetricHistoryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historique - {metric.label}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Par séance</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>

          {["daily", "weekly", "monthly"].map((period) => (
            <TabsContent key={period} value={period} className="space-y-4">
              <Card className="p-4">
                <div className="h-[300px] w-full">
                  <BarChart
                    data={metric.history[period as keyof typeof metric.history]}
                    xField="date"
                    yField="value"
                    color={metric.color}
                  />
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};