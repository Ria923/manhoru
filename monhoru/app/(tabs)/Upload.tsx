import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Button, Image, TouchableOpacity, TextInput, Text, Keyboard, Dimensions, Platform, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function UploadScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "form">("select");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 画像確認画面のときだけタブバーを非表示
  useEffect(() => {
    if (selectedImage && step === "select") {
      navigation.setOptions?.({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions?.({ tabBarStyle: undefined });
    }
  }, [selectedImage, step, navigation]);

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={64}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
            {/* バツボタン（左上） */}
            <TouchableOpacity style={styles.closeButtonTopLeft} onPress={handleRetake}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {/* 入力欄 */}
            <View style={styles.formContent}>
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
            </View>

            {/* 投稿ボタン（絶対配置をやめてmarginで下寄せ） */}
            <TouchableOpacity style={styles.submitButtonFixed} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>投稿する</Text>
            </TouchableOpacity>

            {/* キーボードが表示されているときだけ矢印バーを表示 */}
            {keyboardVisible && (
              <View style={styles.keyboardBar}>
                <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                  <Ionicons name="chevron-down" size={28} color="#333" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // 画像確認画面
  if (selectedImage && step === "select") {
    return (
      <ThemedView style={[styles.container, { padding: 0 }]}>
        <TouchableOpacity style={styles.closeButtonTopLeft} onPress={handleRetake}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.fullImageWrapper}>
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
    backgroundColor: "#f5f6fa",
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
    borderRadius: 50,
    padding: 4,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 32,
    // marginBottom: 80,
  },
  fullImageWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  nextButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 70,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 22,
    color: "#333",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  previewImage: {
    width: "100%",
    aspectRatio: 1, // 正方形で表示。縦長にしたい場合は aspectRatio: 3/4 などもOK
    // borderRadius: 12,
    marginBottom: 16,
    marginTop: 48,
    backgroundColor: "#eee", // 画像がない時の背景
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  formContent: {
    width: "100%",
    alignItems: "flex-start", // "left" から "flex-start" へ修正
    paddingHorizontal: 16,
  },
  submitButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#F0E685",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonFixed: {
    marginTop: 24,
    marginBottom: 24,
    alignSelf: "center",
    backgroundColor: "#F0E685",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: "#33363F",
    fontSize: 18,
  },
  keyboardBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -70,
    backgroundColor: "#f5f6fa",
    alignItems: "flex-start", // 左揃えに変更
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
  },
});