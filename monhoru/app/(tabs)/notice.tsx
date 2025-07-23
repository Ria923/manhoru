import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import articleSampleData from "../../components/NoticeData";

export default function NoticeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 右上に❌ボタンを追加 */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close-outline" size={40} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.mainTitle}>イベント | お知らせ</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {articleSampleData.map((item, idx) => (
          <Pressable
            key={idx}
            style={styles.card}
            onPress={() => router.push(`/notice/showArticle?id=${item.id}`)}
          >
            <Image
              source={item.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 50,
    textAlign: "center",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
    elevation: 2,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(60,60,60,0.35)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 12,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 10,
    backgroundColor: "#739AD1",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
