import { create } from 'zustand';
import { supabase } from "../config/supabaseClient"; 
import { User } from '@supabase/supabase-js';

// 1. Định nghĩa kiểu dữ liệu cho Profile (Bảng users)
// Đã thêm username, bio, website khớp với SQL mới
interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  avatar_url: string | null;
  email: string;
  username?: string | null; // Biệt danh
  bio?: string | null;      // Giới thiệu
  website?: string | null; 
  role?: string; // Liên kết
}

// 2. Định nghĩa Interface cho Store
interface AuthState {
  user: User | null;           
  profile: UserProfile | null; 
  isLoading: boolean;
  
  // Các hàm cơ bản
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  register: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  checkSession: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;

  // --- HÀM UPDATE ĐƯỢC NÂNG CẤP (Nhận đủ 6 tham số) ---
  updateProfile: (
    name: string, 
    phone: string, 
    avatar_url?: string | null, 
    username?: string, 
    bio?: string, 
    website?: string
  ) => Promise<void>;
}

// 3. Thực thi Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null, 
  isLoading: false,

  // --- 1. LOGIN ---
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      set({ user: data.user });
      await get().fetchUserProfile(); 
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },

  // --- 2. REGISTER ---
  register: async (email, password, name, phone) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, phone: phone } }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Đăng ký thất bại");

      // Insert vào bảng users
      const { error: dbError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        full_name: name,
        phone_number: phone,
        role: 'user'
      });

      if (dbError) throw dbError;

      set({ user: data.user });
      await get().fetchUserProfile();
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },

  // --- 3. LOGOUT ---
  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null, isLoading: false }); 
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  // --- 4. CHECK SESSION ---
  checkSession: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        set({ user: data.session.user });
        await get().fetchUserProfile();
    } else {
        set({ isLoading: false });
    }
  },

  // --- 5. DELETE ACCOUNT ---
  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      set({ user: null, profile: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      console.error("Lỗi xóa tài khoản:", error);
      throw error;
    }
  },

  // --- 6. FETCH USER PROFILE ---
  fetchUserProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) {
        set({ isLoading: false });
        return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;
      set({ profile: data, isLoading: false });
    } catch (error) {
      console.log("Lỗi lấy profile:", error);
      set({ isLoading: false });
    }
  },

  // --- 7. UPDATE PROFILE (FULL OPTION) ---
  updateProfile: async (name, phone, avatar_url, username, bio, website) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ isLoading: true });
    try {
      // Tạo object chứa dữ liệu cần update
      const updates: any = {
        full_name: name,
        phone_number: phone,
        updated_at: new Date(),
      };

      // Chỉ update những trường có giá trị (tránh ghi đè null nếu không cần thiết)
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      if (username !== undefined) updates.username = username;
      if (bio !== undefined) updates.bio = bio;
      if (website !== undefined) updates.website = website;

      // Gửi lên Supabase
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) throw error;

      // Cập nhật Optimistic (Update ngay trên App để UI mượt)
      set((state) => ({
        isLoading: false,
        profile: state.profile ? { ...state.profile, ...updates } : null
      }));
      
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  }
}));