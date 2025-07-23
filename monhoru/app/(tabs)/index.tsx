import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ManholeMap from "@/components/ManholeMap";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  useEffect(() => {
    const checkAndCreateProfile = async () => {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.session?.user;

      if (!user) return;

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert([
          {
            id: user.id,
            display_name: user.user_metadata?.full_name || "匿名さん",
          },
        ]);
      }
    };

    checkAndCreateProfile();
  }, []);
  return (
    <ThemedView style={styles.container}>
      <ManholeMap />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
