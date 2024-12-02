import { Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";

export const ThemeSelector = () => {
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    toast({
      title: "Thème modifié",
      description: `Le thème a été changé pour ${theme}`,
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("light")}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("dark")}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("system")}
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};