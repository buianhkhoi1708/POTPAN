import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// --- ĐIỀN THÔNG TIN CỦA BẠN VÀO ĐÂY ---
// Lấy tại Dashboard Supabase -> Project Settings -> API
const SUPABASE_URL = 'https://xyz...supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient('https://vfqnjeoqxxapqqurdkoi.supabase.co', 'sb_publishable_ay3exiYoFbU1XbQxiCe9CQ_HThHqt80', {
  auth: {
    storage: AsyncStorage, // Giúp lưu phiên đăng nhập vào bộ nhớ máy
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});