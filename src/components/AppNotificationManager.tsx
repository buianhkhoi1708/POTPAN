// Nhóm 9 - IE307.Q12
import { useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";

const NotificationManager = () => {
  const { user } = useAuthStore();
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (!user?.id) return;
    fetchUnreadCount(user.id);
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`, 
        },
        () => {

          console.log("🔔 Có thông báo mới! Đang cập nhật badge...");
          fetchUnreadCount(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); 

  return null; 
};

export default NotificationManager;