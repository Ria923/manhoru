import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Button, Alert, Image } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function UploadScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();

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

  const takePicture = async () => {
    // @ts-ignore
    if (cameraRef.current && cameraRef.current.takePictureAsync) {
      // @ts-ignore
      const result = await cameraRef.current.takePictureAsync();
      Alert.alert("写真を撮影しました", result.uri, [
        {
          text: "ギャラリーで確認",
          onPress: () => router.push({ pathname: "/photoSaved", params: { uri: result.uri } }),
        },
        { text: "OK" },
      ]);
    } else {
      Alert.alert("カメラが初期化されていません");
    }
  };

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
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  camera: {
    height: 500, // 高さを固定
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
});
