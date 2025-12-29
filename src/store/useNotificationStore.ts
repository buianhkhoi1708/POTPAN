// src/store/useNotificationStore.ts
import { create } from 'zustand';
import { supabase } from '../config/supabaseClient';

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>; // 👈 Thêm hàm này
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async (userId: string) => {
    // ... (code cũ giữ nguyên)
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

  // 👇 LOGIC MỚI: Vừa xóa UI vừa update Database
  markAllAsRead: async (userId: string) => {
    // 1. Cập nhật giao diện về 0 NGAY LẬP TỨC (Optimistic UI)
    set({ unreadCount: 0 });

    try {
      // 2. Cập nhật ngầm trong Database
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false); // Chỉ update những cái đang chưa đọc
    } catch (err) {
      console.log("Lỗi update trạng thái đọc:", err);
      // Nếu lỗi thì kệ, không cần hiện lại số để tránh trải nghiệm giật cục
    }
  },
}));