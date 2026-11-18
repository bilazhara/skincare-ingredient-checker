
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

// Environment Variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment
console.log("Supabase URL:", supabaseUrl);
console.log("API Key tersedia:", !!supabaseAnonKey);

// Validasi environment
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Environment Supabase tidak terbaca. Periksa file .env"
  );
}

// Secure Storage Adapter
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },

  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },

  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Supabase Client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      ...(Platform.OS !== "web"
        ? { storage: ExpoSecureStoreAdapter }
        : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
