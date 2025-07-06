import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // ← アイコンを使うために追加

export default function PreviewScreen() {
  const router = useRouter();
  const { uri } = useLocalSearchParams();

  // 🔒 URIが無効な場合の保護処理
  if (!uri || typeof uri !== "string") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>画像が見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <>
      {/* デフォルトのヘッダーは非表示にする */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* 🔙 自作の戻るボタン（画面左上に配置） */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* プレビュー画像表示 */}
        <Image source={{ uri }} style={styles.image} />

        {/* 投稿画面へ遷移ボタン */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            router.push({
              pathname: "/upload/postform",
              params: { uri },
            })
          }
        >
          <Text style={styles.nextButtonText}>次へ</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50, // SafeArea考慮して余裕を持たせる
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "75%",
    resizeMode: "contain",
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: "#F0E685",
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  nextButtonText: {
    color: "#33363F",
    fontSize: 18,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
});
