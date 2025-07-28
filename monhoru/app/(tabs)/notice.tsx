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
import {
  useRouter,
  useNavigation,
  Stack,
  useLocalSearchParams,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import articleSampleData from "../../components/NoticeData";

export default function NoticeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <TouchableOpacity
          onPress={() => {
            if (params.from === "gallery") {
              router.push({ pathname: "/notice", params: { from: "gallery" } });
            } else if (params.from === "index") {
              router.push({ pathname: "/notice", params: { from: "index" } });
            } else if (router.canGoBack()) {
              router.back();
            } else {
              router.push({ pathname: "/", params: { from: "notice" } });
            }
          }}
          style={{
            position: "absolute",
            top: 40,
            left: 16,
            zIndex: 100,
          }}
        >
          <Text style={{ fontSize: 24, color: "black" }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.mainTitle}>イベント | お知らせ</Text>

        <ScrollView contentContainerStyle={styles.content}>
          {articleSampleData.map((item, idx) => (
            <Pressable
              key={idx}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: `/notice/showArticle`,
                  params: { id: item.id, from: params.from || "notice" },
                })
              }
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
    </>
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
});
