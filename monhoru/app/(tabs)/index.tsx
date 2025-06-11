import { Image } from "expo-image";
import { Platform, StyleSheet, Dimensions } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ManholeMap } from "@/components/ManholeMap";
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
