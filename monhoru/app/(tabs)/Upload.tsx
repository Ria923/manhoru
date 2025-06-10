import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Button, Image, TouchableOpacity, TextInput, Text } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

export default function UploadScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "form">("select");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <ThemedText>カメラの許可を確認中...</ThemedText>;
  }
  if (!permission.granted) {
    return <ThemedText>カメラの許可がありません</ThemedText>;
  }

  // カメラで写真を撮る
  const takePicture = async () => {
    // @ts-ignore
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      // @ts-ignore
      const result = await cameraRef.current.takePictureAsync();
      setSelectedImage(result.uri);
    }
  };

  // ギャラリーから写真を選ぶ
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 再撮影・再選択
  const handleRetake = () => {
    setSelectedImage(null);
    setStep("select");
    setTitle("");
    setMemo("");
  };

  // 「この写真で進む」→ 投稿フォームへ
  const handleProceed = () => {
    setStep("form");
  };

  // 投稿処理（ここでAPI送信や保存など）
  const handleSubmit = () => {
    // ここでtitle, memo, selectedImageを使って投稿処理
    alert(`タイトル: ${title}\nメモ: ${memo}\n画像: ${selectedImage}`);
    // 初期化
    setSelectedImage(null);
    setStep("select");
    setTitle("");
    setMemo("");
  };

  // 投稿フォーム画面
  if (selectedImage && step === "form") {
    return (
      <ThemedView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleRetake}>
          <Ionicons name="close" size={32} color="#333" />
        </TouchableOpacity>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <TextInput
          style={styles.input}
          placeholder="タイトル"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="メモ"
          value={memo}
          onChangeText={setMemo}
          multiline
        />
        <Button title="投稿する" onPress={handleSubmit} />
      </ThemedView>
    );
  }

  // 画像確認画面
  if (selectedImage && step === "select") {
    return (
      <ThemedView style={[styles.container, { backgroundColor: "#f5f6fa" }]}>
        <TouchableOpacity style={styles.closeButtonTopLeft} onPress={handleRetake}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleProceed}>
          <Text style={styles.nextButtonText}>次へ</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // 通常のカメラ・ギャラリー選択画面
  return (
    <ThemedView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={type}
        ref={cameraRef}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="カメラ切替"
          onPress={() => setType(type === "back" ? "front" : "back")}
        />
        <Button
          title="写真を撮る"
          onPress={takePicture}
        />
        <Button
          title="ギャラリーから選ぶ"
          onPress={pickImage}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  camera: {
    height: 500,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
    width: "100%",
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  closeButton: {
    position: "absolute",
    top: 32,
    right: 24,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
  },
  closeButtonTopLeft: {
    position: "absolute",
    top: 32,
    left: 24,
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    padding: 4,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 80,
  },
  fullImage: {
    width: "90%",
    height: "100%",
    borderRadius: 20,
  },
  nextButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1, // 正方形で表示。縦長にしたい場合は aspectRatio: 3/4 などもOK
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 48,
    backgroundColor: "#eee", // 画像がない時の背景
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});