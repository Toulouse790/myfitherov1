
import { Header } from "@/components/Layout/Header";
import { SportProgramsList } from "@/components/Workouts/SportPrograms/SportProgramsList";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function SportPrograms() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header>
        <div className="container max-w-4xl mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-20 sm:pb-24 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {t("programs.sportSpecificPrograms")}
            </h1>
            <p className="text-muted-foreground">
              {t("programs.sportSpecificDescription")}
            </p>
          </motion.div>
          
          <SportProgramsList />
        </div>
      </Header>
    </div>
  );
}
