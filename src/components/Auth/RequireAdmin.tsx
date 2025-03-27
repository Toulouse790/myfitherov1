
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { debugLogger } from "@/utils/debug-logger";

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setIsAdmin(!!data && data.role === 'admin');
        debugLogger.log('Auth', 'Admin status checked', { isAdmin: !!data, userId: user.id });
      } catch (error) {
        debugLogger.error('Auth', 'Error checking admin status', error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    debugLogger.warn('Auth', 'Unauthorized access attempt to admin page', { userId: user?.id });
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};
