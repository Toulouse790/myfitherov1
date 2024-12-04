import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { AppSettings } from "./AppSettings";
import { AccountActions } from "./AccountActions";

export const SettingsSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Paramètres</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <AppSettings language="Français" />
          <AccountActions />
        </div>
      </SheetContent>
    </Sheet>
  );
};