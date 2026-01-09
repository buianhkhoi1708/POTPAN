// Nhóm 9 - IE307.Q12
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

const SUPABASE_URL = "https://vfqnjeoqxxapqqurdkoi.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcW5qZW9xeHhhcHFxdXJka29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDc2NzcsImV4cCI6MjA4MTgyMzY3N30.5bh_M9Jmd0NWrvmWxd1vtSgoUcgVoxIfqkjhcYl0lNo";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
