
import { UserProfile } from "@/components/Profile/UserProfile";
import { Header } from "@/components/Layout/Header";

const Profile = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        <UserProfile />
      </div>
    </>
  );
};

export default Profile;
