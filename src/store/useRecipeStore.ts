import { create } from 'zustand';
import { supabase } from '../config/supabaseClient';

export interface Recipe {
  id: number;
  title: string;
  thumbnail: string;
  user_id: string;
  created_at: string;
  time: string;
  difficulty: string;
  category: string;
  description: string;
  ingredients: any[];
  steps: any[];
  status: 'pending' | 'approved' | 'rejected';
  cuisine?: string;
  rating?: number;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

interface RecipeState {
  recipes: Recipe[];        // Dữ liệu cho Home
  myRecipes: Recipe[];      // Dữ liệu cho Profile
  searchResults: Recipe[];  // Dữ liệu cho Search
  isLoading: boolean;
  
  // Actions
  fetchAllRecipes: () => Promise<void>;
  fetchMyRecipes: (userId: string) => Promise<void>;
  searchRecipes: (filters: any) => Promise<void>;
  
  createRecipe: (payload: any) => Promise<void>;
  updateRecipe: (id: number, payload: any) => Promise<void>;
  deleteRecipe: (id: number) => Promise<void>;
  
  resetSearch: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  myRecipes: [],
  searchResults: [],
  isLoading: false,

  // 1. Lấy tất cả bài viết (Home)
  fetchAllRecipes: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, user:users(full_name, avatar_url)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ recipes: data as Recipe[] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Lấy bài viết của tôi (Profile)
  fetchMyRecipes: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ myRecipes: data as Recipe[] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. Tìm kiếm
  searchRecipes: async (filters: any) => {
    set({ isLoading: true });
    try {
      let query = supabase.from("recipes").select("*, user:users(full_name, avatar_url)");

      if (filters.keyword) {
        query = query.or(`title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`);
      }
      if (filters.category) query = query.eq("category", filters.category);
      if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
      if (filters.cuisine) {
        if (filters.cuisine === "Vietnam") query = query.ilike("cuisine", "%Việt Nam%");
        else query = query.not("cuisine", "ilike", "%Việt Nam%");
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = data || [];
      // Client-side filtering cho Time
      if (filters.time) {
        result = result.filter((item) => {
          const match = String(item.time).match(/(\d+)/);
          const minutes = match ? parseInt(match[0]) : 0;
          if (filters.time === "under_30") return minutes > 0 && minutes < 30;
          if (filters.time === "30_60") return minutes >= 30 && minutes <= 60;
          if (filters.time === "over_60") return minutes > 60;
          return true;
        });
      }
      set({ searchResults: result });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 4. Tạo bài viết mới
  createRecipe: async (payload: any) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;

      // Cập nhật ngay vào list My Recipes
      set((state) => ({
        myRecipes: [data, ...state.myRecipes]
      }));
    } catch (error) {
      throw error; // Ném lỗi để UI hiển thị Alert
    } finally {
      set({ isLoading: false });
    }
  },

  // 5. Cập nhật bài viết
  updateRecipe: async (id: number, payload: any) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // Cập nhật state cục bộ để UI đổi ngay
      set((state) => ({
        myRecipes: state.myRecipes.map((r) => (r.id === id ? { ...r, ...data } : r)),
        recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...data } : r)),
      }));
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // 6. Xóa bài viết
  deleteRecipe: async (id: number) => {
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        myRecipes: state.myRecipes.filter((r) => r.id !== id),
        recipes: state.recipes.filter((r) => r.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  resetSearch: () => set({ searchResults: [] }),
}));