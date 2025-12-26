import { create } from 'zustand';
import { supabase } from '../config/supabaseClient';

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAsRead: () => void; // Hàm reset về 0 khi vào màn thông báo
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      // Cập nhật vào store toàn cục
      set({ unreadCount: count || 0 });
    } catch (err) {
      console.log("Lỗi đếm thông báo:", err);
    }
  },

  markAsRead: () => set({ unreadCount: 0 }),
}));