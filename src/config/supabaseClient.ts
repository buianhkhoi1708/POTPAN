import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// 1. Điền URL Supabase của bạn (Đã đúng)
const SUPABASE_URL = 'https://vfqnjeoqxxapqqurdkoi.supabase.co';

// 2. Điền Key Anon vào đây (PHẢI LÀ KEY BẮT ĐẦU BẰNG "eyJ...")

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcW5qZW9xeHhhcHFxdXJka29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDc2NzcsImV4cCI6MjA4MTgyMzY3N30.5bh_M9Jmd0NWrvmWxd1vtSgoUcgVoxIfqkjhcYl0lNo';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native cần tắt cái này để tự xử lý Deep Link
  },
});

// 3. Tự động refresh token khi App từ background quay lại active
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});