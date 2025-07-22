import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const numColumns = 3;
const horizontalPadding = 16;
const cardMargin = 8;
const totalSpacing = horizontalPadding * 2 + cardMargin * (numColumns - 1);
const size = (Dimensions.get("window").width - totalSpacing) / numColumns;

type Post = {
  id: string;
  image_url: string;
};

export default function GalleryAllScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("posts")
        .select("id, image_url")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "すべての画像",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/gallery/detail",
                params: { id: item.id },
              })
            }
          >
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    width: size,
    height: size,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: cardMargin,
    marginBottom: cardMargin,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
