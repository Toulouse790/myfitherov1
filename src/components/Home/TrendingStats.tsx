
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Données fictives pour la démo
const data = [
  { name: "Jan", value: 65 },
  { name: "Fev", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Avr", value: 81 },
  { name: "Mai", value: 56 },
  { name: "Juin", value: 55 },
  { name: "Juil", value: 40 },
];

export function TrendingStats() {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          {t("common.progressTrend", { fallback: "Tendance de progression" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value) => [`${value}%`, "Performance"]}
                labelFormatter={(label) => `Mois: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  fill: "hsl(var(--primary))",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
