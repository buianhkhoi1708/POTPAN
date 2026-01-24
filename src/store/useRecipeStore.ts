// Nhóm 9 - IE307.Q12
import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

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
  status: "pending" | "approved" | "rejected";
  cuisine?: string;
  rating?: number;
  user?: {
    full_name: string;
    avatar_url: string;
  };
}

interface RecipeState {
  recipes: Recipe[];
  myRecipes: Recipe[];
  searchResults: Recipe[];
  isLoading: boolean;

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

  fetchAllRecipes: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, user:users(full_name, avatar_url)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ recipes: data as Recipe[] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyRecipes: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ myRecipes: data as Recipe[] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchRecipes: async (filters: any) => {
    set({ isLoading: true });
    try {
      let query = supabase
        .from("recipes")
        .select("*, user:users(full_name, avatar_url)");

      if (filters.keyword) {
        query = query.or(
          `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`
        );
      }
      if (filters.category) query = query.eq("category", filters.category);
      if (filters.difficulty)
        query = query.eq("difficulty", filters.difficulty);
      if (filters.cuisine) {
        if (filters.cuisine === "Vietnam")
          query = query.ilike("cuisine", "%Việt Nam%");
        else query = query.not("cuisine", "ilike", "%Việt Nam%");
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = data || [];
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

  createRecipe: async (payload: any) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("recipes")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;

      set((state) => ({
        myRecipes: [data, ...state.myRecipes],
      }));
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateRecipe: async (id: number, payload: any) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("recipes")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      set((state) => ({
        myRecipes: state.myRecipes.map((r) =>
          r.id === id ? { ...r, ...data } : r
        ),
        recipes: state.recipes.map((r) =>
          r.id === id ? { ...r, ...data } : r
        ),
      }));
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteRecipe: async (id: number) => {
    try {
      const { error } = await supabase.from("recipes").delete().eq("id", id);
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
