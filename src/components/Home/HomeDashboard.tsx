
import React from "react";
import { WelcomeHeader } from "@/components/Home/WelcomeHeader";
import { TodaySummary } from "@/components/Home/TodaySummary";
import { TrendingStats } from "@/components/Home/TrendingStats";

export function HomeDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <WelcomeHeader />
      
      <TodaySummary />
      <TrendingStats />
    </div>
  );
}
