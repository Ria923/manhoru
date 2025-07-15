import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Gate() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
