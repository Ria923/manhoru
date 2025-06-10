import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router"; // Stack を追加

export default function PreviewScreen() {
  const router = useRouter();
  const { uri } = useLocalSearchParams(); // 前の画面から渡された画像URIを受け取る

  // URIが無効な場合の保護
  if (!uri || typeof uri !== "string") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>画像が見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <>
      {/* ヘッダー非表示設定 */}
      <Stack.Screen
        name="upload/postform"
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.container}>
        {/* プレビュー画像表示 */}
        <Image source={{ uri }} style={styles.image} />

        {/* 投稿画面へ遷移 */}
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
