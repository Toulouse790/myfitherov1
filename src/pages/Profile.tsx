
import { Header } from "@/components/Layout/Header";
import { motion } from "framer-motion";
import { UserProfile } from "@/components/Profile";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-6 pb-24"
      >
        <h1 className="text-2xl font-bold mb-6">
          {t("profile.title", { fallback: "Mon Profil" })}
        </h1>
        <UserProfile />
      </motion.div>
    </>
  );
};

export default Profile;
