import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Post = {
  id: string;
  title: string;
  date: string;
  memo: string;
  image_url: string;
};

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || typeof id !== "string") return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setPost(data);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "投稿詳細",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {!post ? (
          <Text style={{ textAlign: "center", marginTop: 48 }}>
            投稿が見つかりません
          </Text>
        ) : (
          <View style={{ marginBottom: 32 }}>
            <Image
              source={{ uri: post.image_url }}
              style={{ width: "100%", height: 300, borderRadius: 16 }}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
              {post.title}
            </Text>
            <Text style={{ fontSize: 12, color: "#555", marginTop: 8 }}>
              投稿日：{post.date}
            </Text>
            <Text style={{ fontSize: 16, color: "#333", marginTop: 16 }}>
              {post.memo}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
