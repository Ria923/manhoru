import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://qpfdlezduddnkoktkvdu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwZmRsZXpkdWRkbmtva3RrdmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzYwODksImV4cCI6MjA2NjY1MjA4OX0.Jlmtbd0ImljdDETvJeyRi7lYd6Q3cTv3dVWHh0kCUX4";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
