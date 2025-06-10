import React, { useState } from "react";

import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

export default function PostFormScreen() {
  const { uri } = useLocalSearchParams(); // プレビュー画面から受け取った画像 URI
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const today = new Date();
  const todayText = `${today.getFullYear()}/${
    today.getMonth() + 1
  }/${today.getDate()}`;

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert("入力不足", "タイトルと説明を入力してください");
      return;
    }

    // ここで Firestore などに保存する処理を書く予定（未実装）

    Alert.alert("投稿完了", "投稿が完了しました！");
    router.replace("/"); // ホームに戻る or 投稿一覧に戻る
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
      <Stack.Screen
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.container}>
        <Image source={{ uri }} style={styles.image} />

        <TextInput
          style={styles.input}
          placeholder="タイトルを入力"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="説明文を入力"
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.dateText}>日付:{todayText}</Text>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>投稿する</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffff",
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
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
