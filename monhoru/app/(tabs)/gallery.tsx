import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function NoticeScreen() {
  const router = useRouter();

  type Post = {
    id: string;
    title: string;
    image_url: string;
    created_at: string;
  };

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      console.log("👤 自己的投稿：", data);
      if (error) {
        console.error("投稿データの取得エラー:", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ThemedView style={styles.container}>
        {/* 最新の写真 */}
        <View style={styles.latestCardsRow}>
          {posts.slice(0, 3).map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.latestCard}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/gallery/detail",
                  params: { idx: idx }, // ←インデックスを渡す
                })
              }
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.latestImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{`投稿日：${item.created_at.slice(
                  0,
                  10
                )}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 一覧ボタン */}
        <TouchableOpacity
          style={styles.listButton}
          activeOpacity={0.7}
          onPress={() => router.push("/gallery/all")}
        >
          <Text style={styles.listButtonText}>すべての一覧</Text>
          <Text style={styles.listButtonArrow}>＞</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 16 }}
        >
          {posts.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.listCard}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/gallery/detail",
                  params: { idx: idx },
                })
              }
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.listImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  latestCardsRow: {
    flexDirection: "column", // 横並び→縦並び
    marginBottom: 5,
    marginTop: 60,
  },
  latestCard: {
    flexDirection: "row",
    backgroundColor: "#F8E99C",
    borderRadius: 16,
    alignItems: "center",
    padding: 12,
    marginBottom: 12, // marginRight→marginBottom
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  latestImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#555",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 24,
  },
  listButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  listButtonArrow: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 6,
    marginTop: 1,
  },
  listCard: {
    width: 120,
    height: 120,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  listImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
