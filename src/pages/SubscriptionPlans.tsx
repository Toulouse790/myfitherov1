
import { SubscriptionPlans } from "@/components/Subscription/SubscriptionPlans";
import { FeatureComparison } from "@/components/Subscription/FeatureComparison";
import { Header } from "@/components/Layout/Header";

const SubscriptionPlansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 pt-16 pb-20">
        <SubscriptionPlans />
        <div className="mt-12">
          <FeatureComparison />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
