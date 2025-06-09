import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<{ id: string; uri: string }[]>([]);
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
      if (permission?.granted) {
        const album = await MediaLibrary.getAlbumAsync("Camera");
        const assets = await MediaLibrary.getAssetsAsync({
          album: album?.id,
          sortBy: [["creationTime", false]],
          mediaType: ["photo"],
        });
        const assetsWithUri = await Promise.all(
          assets.assets.map(async (asset) => {
            const info = await MediaLibrary.getAssetInfoAsync(asset.id);
            return { id: asset.id, uri: info.localUri || asset.uri };
          })
        );
        setPhotos(assetsWithUri);
      }
    })();
  }, [permission]);

  if (!permission) {
    return <ThemedText>ギャラリーの許可を確認中...</ThemedText>;
  }
  if (!permission.granted) {
    return <ThemedText>ギャラリーへのアクセスが許可されていません</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">ギャラリー</ThemedText>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => router.push("/Upload")}
        >
          <Ionicons name="camera-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Image
              source={{ uri: item.uri }}
              style={styles.image}
            />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cameraButton: {
    padding: 8,
  },
  image: {
    width: 110,
    height: 110,
    margin: 4,
    borderRadius: 8,
  },
});
