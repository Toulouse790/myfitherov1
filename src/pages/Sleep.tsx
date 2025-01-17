import { SleepTracker } from "@/components/Sleep/SleepTracker";
import { ConnectedDevices } from "@/components/Sleep/ConnectedDevices";
import { BottomNav } from "@/components/Layout/BottomNav";

const Sleep = () => {
  return (
    <div className="container mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Sommeil</h1>
      <div className="space-y-6">
        <SleepTracker />
      </div>
      <BottomNav />
    </div>
  );
};

export default Sleep;