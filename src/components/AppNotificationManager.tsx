import { useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";

const NotificationManager = () => {
  const { user } = useAuthStore();
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (!user?.id) return;

    // 1. Lấy số lượng ban đầu khi component được mount (khi login xong)
    fetchUnreadCount(user.id);

    // 2. Lắng nghe Realtime: Khi có thông báo mới -> gọi lại hàm đếm
    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT", // Chỉ cần nghe khi có dòng mới
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`, // Chỉ nghe của user này
        },
        () => {
          // Có thay đổi -> Gọi lại API đếm số
          console.log("🔔 Có thông báo mới! Đang cập nhật badge...");
          fetchUnreadCount(user.id);
        }
      )
      .subscribe();

    // Cleanup khi logout hoặc unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Chạy lại nếu user thay đổi

  return null; // Component này vô hình
};

export default NotificationManager;