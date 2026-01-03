import { create } from 'zustand';
import { supabase } from "../config/supabaseClient"; 
import { User, Session } from '@supabase/supabase-js'; // Import thêm Session

// 1. Định nghĩa kiểu dữ liệu cho Profile (Bảng users)
interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string | null;
  avatar_url: string | null;
  email: string;
  username?: string | null; 
  bio?: string | null;      
  website?: string | null; 
  role?: string; 
}

// 2. Định nghĩa Interface cho Store
interface AuthState {
  user: User | null;
  session: Session | null; // [MỚI] Lưu session đầy đủ
  profile: UserProfile | null; 
  isLoading: boolean;
  
  // Các hàm cơ bản
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  register: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  
  // [QUAN TRỌNG] Hàm này dùng để App.tsx nạp session vào store
  setSession: (session: Session | null) => Promise<void>;
  
  checkSession: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;

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
  session: null, // Khởi tạo null
  profile: null, 
  isLoading: false,

  // --- 1. LOGIN (Email/Pass) ---
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // setSession sẽ tự động gọi fetchUserProfile
      await get().setSession(data.session);
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

      // Insert vào bảng users thủ công cho chắc ăn
      const { error: dbError } = await supabase.from('users').insert({
        id: data.user.id,
        email: email,
        full_name: name,
        phone_number: phone,
        role: 'user'
      });

      if (dbError) throw dbError;

      // Không set session ngay mà để người dùng tự login hoặc auto login sau
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },

  // --- 3. SET SESSION (CẦU NỐI VỚI GOOGLE LOGIN) ---
  setSession: async (session) => {
    if (session) {
      set({ user: session.user, session: session, isLoading: true });
      // Khi có session, lập tức lấy profile
      await get().fetchUserProfile();
    } else {
      set({ user: null, session: null, profile: null, isLoading: false });
    }
  },

  // --- 4. LOGOUT ---
  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, profile: null, isLoading: false }); 
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },

  // --- 5. CHECK SESSION (Dùng khi mở App) ---
  checkSession: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();
    // Gọi hàm setSession để tái sử dụng logic
    await get().setSession(data.session);
    set({ isLoading: false });
  },

  // --- 6. DELETE ACCOUNT ---
  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      set({ user: null, session: null, profile: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      console.error("Lỗi xóa tài khoản:", error);
      throw error;
    }
  },

  // --- 7. FETCH USER PROFILE (NÂNG CẤP) ---
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

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 là lỗi "không tìm thấy dòng nào"

      // [QUAN TRỌNG] Logic tự động tạo Profile cho Google Login lần đầu
      if (!data) {
        console.log("⚠️ Chưa có profile (lần đầu login Google), đang tạo mới...");
        
        // Lấy thông tin từ Google Metadata
        const meta = currentUser.user_metadata;
        const newProfile = {
          id: currentUser.id,
          email: currentUser.email || "",
          full_name: meta.full_name || meta.name || "Người dùng mới",
          avatar_url: meta.avatar_url || meta.picture || null,
          role: 'user',
          phone_number: null
        };

        const { error: insertError } = await supabase.from('users').insert(newProfile);
        if (insertError) throw insertError;

        set({ profile: newProfile as UserProfile, isLoading: false });
      } else {
        set({ profile: data, isLoading: false });
      }

    } catch (error) {
      console.log("❌ Lỗi lấy profile:", error);
      set({ isLoading: false });
    }
  },

  // --- 8. UPDATE PROFILE ---
  updateProfile: async (name, phone, avatar_url, username, bio, website) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ isLoading: true });
    try {
      const updates: any = {
        full_name: name,
        phone_number: phone,
        updated_at: new Date(),
      };

      if (avatar_url !== undefined) updates.avatar_url = avatar_url;
      if (username !== undefined) updates.username = username;
      if (bio !== undefined) updates.bio = bio;
      if (website !== undefined) updates.website = website;

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.id);

      if (error) throw error;

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