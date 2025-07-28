import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { supabase } from "../../lib/supabase";
import Char1 from "@/assets/onboarding/char2.png";

type Post = {
  id: string;
  title: string;
  date: string;
  memo: string;
  image_url: string;
};

export default function DetailScreen() {
  const router = useRouter();
  const { id, refreshed } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);

  useFocusEffect(
    useCallback(() => {
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
    }, [id, refreshed])
  );

  const handleDelete = async () => {
    if (!post) return;
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      console.error("削除失敗:", error.message);
    } else {
      Alert.alert("削除完了", "投稿を削除しました");
      router.replace("/gallery");
    }
  };

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
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{ padding: 24 }}
      >
        {!post ? (
          <Text style={{ textAlign: "center", marginTop: 48 }}>
            投稿が見つかりません
          </Text>
        ) : (
          <View style={{ marginBottom: 32 }}>
            <Image
              source={{ uri: post.image_url }}
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 16,
                borderColor: "#A9D0F5",
                borderWidth: 2,
              }}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() =>
                  router.push({
                    pathname: "/gallery/galleryedit" as any,
                    params: { id: post.id },
                  })
                }
              >
                <Ionicons name="create-outline" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Image
          source={Char1}
          style={{
            width: 180,
            height: 180,
            alignSelf: "center",
            marginTop: 24,
            marginBottom: 40,
            left: 110,
          }}
          resizeMode="contain"
        />
      </ScrollView>
    </>
  );
}
