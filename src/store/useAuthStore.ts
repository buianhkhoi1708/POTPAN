// Nhóm 9 - IE307.Q12
import { create } from "zustand";
import { supabase } from "../config/supabaseClient";
import { User, Session } from "@supabase/supabase-js";

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

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;

  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  register: (
    email: string,
    pass: string,
    name: string,
    phone: string
  ) => Promise<void>;

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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      await get().setSession(data.session);
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },

  register: async (email, password, name, phone) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { 
            full_name: name, 
            phone: phone 
          } 
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Đăng ký thất bại");
      
      set({ isLoading: false });
      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },

  setSession: async (session) => {
    if (session) {
      set({ user: session.user, session: session, isLoading: true });
      await get().fetchUserProfile();
    } else {
      set({ user: null, session: null, profile: null, isLoading: false });
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();
    await get().setSession(data.session);
    set({ isLoading: false });
  },

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


  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;
      set({ user: null, session: null, profile: null, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      console.error("Lỗi xóa tài khoản:", error);
      throw error;
    }
  },

  fetchUserProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;
      
      set({ profile: data, isLoading: false });

    } catch (error) {
      console.log("❌ Lỗi lấy profile:", error);
      set({ isLoading: false });
    }
  },

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
        .from("users")
        .update(updates)
        .eq("id", currentUser.id);

      if (error) throw error;

      set((state) => ({
        isLoading: false,
        profile: state.profile ? { ...state.profile, ...updates } : null,
      }));

      return Promise.resolve();
    } catch (error: any) {
      set({ isLoading: false });
      return Promise.reject(error);
    }
  },
}));