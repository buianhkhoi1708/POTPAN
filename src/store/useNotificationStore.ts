// Nhóm 9 - IE307.Q12
import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
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
      if (!error) set({ unreadCount: count || 0 });
    } catch (err) {
      console.log(err);
    }
  },

  markAllAsRead: async (userId: string) => {
    set({ unreadCount: 0 });

    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
    } catch (err) {
      console.log("Lỗi update trạng thái đọc:", err);
    }
  },
}));
