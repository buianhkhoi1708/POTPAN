// Nhóm 9 - IE307.Q12
import { create } from "zustand";
import { supabase } from "../config/supabaseClient";

interface CollectionState {
  savedRecipeIds: number[];
  myCollections: any[];
  isLoading: boolean;

  fetchSavedIds: (userId: string) => Promise<void>;
  fetchMyCollections: (userId: string) => Promise<void>;
  toggleSave: (userId: string, recipeId: number) => Promise<boolean>;
  deleteCollection: (id: number) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  savedRecipeIds: [],
  myCollections: [],
  isLoading: false,

  fetchSavedIds: async (userId: string) => {
    const { data } = await supabase
      .from("saved_recipes")
      .select("recipe_id")
      .eq("user_id", userId);
    if (data) {
      set({ savedRecipeIds: data.map((i) => i.recipe_id) });
    }
  },

  fetchMyCollections: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ myCollections: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleSave: async (userId: string, recipeId: number) => {
    const { savedRecipeIds } = get();
    const isSaved = savedRecipeIds.includes(recipeId);

    if (isSaved) {
      // Bỏ lưu
      await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);
      set({ savedRecipeIds: savedRecipeIds.filter((id) => id !== recipeId) });
      return false;
    } else {
      await supabase
        .from("saved_recipes")
        .insert({ user_id: userId, recipe_id: recipeId });
      set({ savedRecipeIds: [...savedRecipeIds, recipeId] });
      return true;
    }
  },

  deleteCollection: async (id: number) => {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
    set((state) => ({
      myCollections: state.myCollections.filter((c) => c.id !== id),
    }));
  },
}));
