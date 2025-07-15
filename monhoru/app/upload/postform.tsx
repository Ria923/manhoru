import React from "react";
import { supabase } from "@/lib/supabase";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const { width } = Dimensions.get("window");

export default function PostFormScreen() {
  const { uri, title, memo, date, address } = useLocalSearchParams();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert("入力不足", "タイトルを入力してください");
      return;
    }

    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
      Alert.alert("ログインエラー", "ユーザー情報を取得できませんでした");
      return;
    }

    const fileExt = (uri as string).split(".").pop() || "jpg";
    const userId = user?.id?.toString?.(); // 防止 undefined 錯誤
    if (!userId) {
      Alert.alert("エラー", "ユーザーIDが見つかりませんでした");
      return;
    }
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    console.log(" user.id:", userId);
    console.log(" uploading to:", fileName);

    try {
      // base64 → arrayBuffer → upload

      const base64 = await FileSystem.readAsStringAsync(uri as string, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        console.error("画像アップロードエラー:", uploadError);
        Alert.alert("画像アップロード失敗", uploadError.message);
        return;
      }

      // 拿到 public URL
      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("posts").insert([
        {
          user_id: user.id,
          title: title,
          memo: memo,
          image_url: publicUrlData.publicUrl,
          date: date,
          address: address,
        },
      ]);

      if (insertError) {
        console.error("投稿エラー:", insertError);
        Alert.alert("投稿失敗", insertError.message);
        return;
      }

      Alert.alert("投稿完了", "投稿が完了しました！");
      router.replace("/");
    } catch (error) {
      console.error("投稿処理中の例外:", error);
      Alert.alert("エラー", "投稿中に問題が発生しました");
    }
  };

  if (!uri || typeof uri !== "string") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>画像が見つかりませんでした</Text>
      </View>
    );
  }

  return (
    <>
      {/* Stack.Screen でヘッダーをカスタマイズ */}
      <Stack.Screen
        options={{
          headerShown: true, // ヘッダーを表示
          headerTitle: "詳細の確認", // 適切なタイトルを設定
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff", // ヘッダーの背景色を設定 (任意)
          },
          headerTitleStyle: {
            fontWeight: "bold", // ヘッダータイトルのスタイル (任意)
          },
        }}
      />
      <KeyboardDismissWrapper>
        {/* SafeAreaView はコンテンツの安全領域を確保するために残します */}
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* 古いbackButtonは削除またはコメントアウト */}
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity> */}

          <View style={styles.container}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: uri as string }} style={styles.image} />
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.addText}>{title || "タイトル未入力"}</Text>
              <Text style={styles.bodyText}>{memo || "メモ未入力"}</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  width: "100%",
                }}
              >
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.dateText}>{address}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>投稿する</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardDismissWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    // ヘッダーが表示されるため、marginTopを調整または削除
    marginTop: 0, // ヘッダーがある場合は通常0でOK
  },
  // Stack.Screenでヘッダーを制御するため、このスタイルは不要
  // backButton: {
  //   position: "absolute",
  //   top: 70,
  //   left: 20,
  //   zIndex: 10,
  //   padding: 8,
  // },
  imageWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#A9D0F5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#a8a8a8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#F0E685",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 12,
  },
  buttonText: {
    color: "#33363F",
    fontSize: 18,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 60,
  },
  dateText: {
    textAlign: "left",
    fontSize: 13,
    color: "#888",
  },
  addText: {
    textAlign: "left",
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    width: "100%",
  },
  label: { fontSize: 16, marginBottom: 10 },
  bodyText: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 18,
    color: "#333",
    alignSelf: "flex-start",
    lineHeight: 22,
    width: "100%",
  },
  infoGroup: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
