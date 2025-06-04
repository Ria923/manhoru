import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function PhotoSavedScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">保存した写真</ThemedText>
      {uri ? (
        <Image source={{ uri }} style={{ width: 390, height: 500, marginTop: 16 }} />
      ) : (
        <ThemedText>画像がありません</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});