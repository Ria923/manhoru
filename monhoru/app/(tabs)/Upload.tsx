// Upload.tsx
// ============================
// 相簿一覧 → プレビュー画面へ画面遷移する構成（expo-router使用）

import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; //  expo-router 用の画面遷移フック

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3 - 6;

// Asset型の定義（型エラー防止）
type Asset = {
  id: string;
  uri: string;
};

export default function GalleryScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  // 初回：アクセス権限と画像取得
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        await loadImages();
      } else {
        Alert.alert("写真アクセスの許可が必要です");
      }
    })();
  }, []);

  // アルバム画像の読み込み
  const loadImages = async () => {
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      first: 30,
    });
    setPhotos(assets.assets as Asset[]);
    if (assets.assets.length > 0) {
      const info = await MediaLibrary.getAssetInfoAsync(assets.assets[0].id);
      setSelectedImage(info.localUri ?? null);
    }
  };

  // カメラ起動して新規写真を追加
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("カメラの使用を許可してください");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newUri = result.assets[0].uri;
      const newAsset = await MediaLibrary.createAssetAsync(newUri);
      const info = await MediaLibrary.getAssetInfoAsync(newAsset.id);
      setPhotos((prev) => [newAsset as Asset, ...prev]);
      setSelectedImage(info.localUri ?? null);
    } else {
      Alert.alert("撮影がキャンセルされました");
    }
  };

  // ローカルURIを取得して画像表示
  const ImageWithLocalUri = ({ asset }: { asset: Asset }) => {
    const [uri, setUri] = useState<string | null>(null);
    useEffect(() => {
      if (!asset?.id) return;
      (async () => {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);
        setUri(info.localUri ?? null);
      })();
    }, [asset]);

    if (!uri) {
      return (
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "#ccc" }}
        />
      );
    }
    return <Image source={{ uri }} style={styles.image} />;
  };

  // グリッド画像表示（カメラ含む）
  const renderItem = ({ item, index }: { item: Asset; index: number }) => {
    if (index === 0 && item.id === "camera") {
      return (
        <TouchableOpacity style={styles.imageBox} onPress={openCamera}>
          <Ionicons name="camera" size={32} color="#555" />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={async () => {
          const info = await MediaLibrary.getAssetInfoAsync(item.id);
          setSelectedImage(info.localUri ?? null);
        }}
        style={styles.imageBox}
      >
        <ImageWithLocalUri asset={item} />
      </TouchableOpacity>
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>アクセス権限がありません</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 上部バー（次へボタン） */}
      {selectedImage && (
        <View style={styles.topBarWrapper}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              router.push({
                pathname: "/upload/preview",
                params: { uri: selectedImage! },
              })
            }
          >
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* プレビュー表示 */}
      {selectedImage && (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        </View>
      )}

      {/* グリッド一覧 */}
      <FlatList
        data={[{ id: "camera", uri: "" } as Asset, ...photos]}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBarWrapper: {
    width: "100%",
    height: 40,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 16,
  },
  previewWrapper: {
    width: "95%",
    height: 400,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  gridContainer: {
    padding: 8,
  },
  imageBox: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  nextButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
