import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import  ManholeMap  from "@/components/ManholeMap";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
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
