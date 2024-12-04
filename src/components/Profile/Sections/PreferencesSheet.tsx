import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MeasurementsSection } from "./MeasurementsSection";
import { UnitPreferences } from "./Preferences/UnitPreferences";
import { SocialActions } from "./Preferences/SocialActions";

export const PreferencesSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Préférences</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <UnitPreferences />

          <Separator />

          <MeasurementsSection />

          <Separator />

          <SocialActions />
        </div>
      </SheetContent>
    </Sheet>
  );
};