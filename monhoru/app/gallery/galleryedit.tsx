import { supabase } from "@/lib/supabase";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";

export default function GalleryEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      Alert.alert("取得失敗", error.message);
    } else {
      setPost(data);
      setTitle(data.title || "");
      setMemo(data.memo || "");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!post) return;
    const { error } = await supabase
      .from("posts")
      .update({ title, memo })
      .eq("id", post.id);
    if (error) {
      Alert.alert("更新失敗", error.message);
    } else {
      Alert.alert("更新成功");
      router.back();
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  if (!post) {
    return (
      <Text style={{ marginTop: 100, textAlign: "center" }}>
        投稿が見つかりません
      </Text>
    );
  }

  const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 0;

  return (
    <KeyboardDismissWrapper>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Stack.Screen
          options={{
            title: "投稿を編集",
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          }}
        />
        <View
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            paddingVertical: 30,
            paddingHorizontal: 24,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          {post.image_url && (
            <Image
              source={{ uri: post.image_url }}
              style={{
                width: "80%",
                aspectRatio: 1,
                backgroundColor: "#F5F5F5",
                borderRadius: 15,
                marginBottom: 30,
                borderColor: "#A9D0F5",
                borderWidth: 1,
              }}
            />
          )}
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: 16,
                color: "#222222",
                marginBottom: 12,
                fontWeight: "600",
                paddingLeft: 4,
              }}
            >
              タイトル
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="タイトルを編集"
              placeholderTextColor="#AAAAAA"
              style={{
                width: "100%",
                backgroundColor: "#F9F9F9",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 24,
                fontSize: 16,
                color: "#222222",
                height: 48,
                fontWeight: "500",
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#222222",
                marginBottom: 12,
                fontWeight: "600",
                paddingLeft: 4,
              }}
            >
              メモ
            </Text>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="メモを編集"
              placeholderTextColor="#AAAAAA"
              multiline
              style={{
                width: "100%",
                backgroundColor: "#F9F9F9",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 24,
                fontSize: 16,
                color: "#222222",
                minHeight: 96,
                textAlignVertical: "top",
                fontWeight: "500",
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleUpdate}
            style={{
              width: "40%",
              backgroundColor: "#F0E685",
              borderRadius: 25,
              paddingVertical: 14,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#333", fontSize: 16 }}>更新する</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardDismissWrapper>
  );
}
