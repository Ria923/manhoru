import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";

export default function PostFormScreen() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("エラー", "位置情報の許可がありません");
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode.length > 0) {
          const place = geocode[0];
          const fullAddress = `${place.region ?? ""}${place.city ?? ""}`;
          setAddress(fullAddress);
        } else {
          Alert.alert("エラー", "住所情報が見つかりませんでした");
        }
      } catch (error) {
        console.log("位置取得エラー", error);
        Alert.alert("エラー", "位置情報の取得に失敗しました");
      }
    })();
  }, []);

  const today = new Date();
  const todayText = `${today.getFullYear()}/${
    today.getMonth() + 1
  }/${today.getDate()}`;

  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert("入力不足", "説明を入力してください");
      return;
    }

    Alert.alert("投稿完了", "投稿が完了しました！");
    router.replace("/");
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
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardDismissWrapper>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.container}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
            </View>

            <Text style={styles.addText}>{address || "取得中..."}</Text>

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="説明文を入力"
              placeholderTextColor="#888"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.dateText}>日付: {todayText}</Text>

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
    marginTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  imageWrapper: {
    width: "85%",
    height: 358,
    marginBottom: 20,
    borderRadius: 15,
    borderColor: "#F0E685",
    borderWidth: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
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
    fontSize: 16,
    alignSelf: "flex-start",
  },
  addText: {
    textAlign: "left",
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
});
