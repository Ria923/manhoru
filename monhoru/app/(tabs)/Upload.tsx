import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Asset = {
  id: string;
  uri: string;
};

export default function GalleryScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [address, setAddress] = useState<string>("位置情報取得中...");
  const [loading, setLoading] = useState<boolean>(false);
  const [showImageOptions, setShowImageOptions] = useState<boolean>(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { status: mediaLibraryStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (mediaLibraryStatus === "granted" && cameraStatus === "granted") {
        setHasPermission(true);
      } else {
        Alert.alert("権限エラー", "写真とカメラのアクセスの許可が必要です");
        console.error("写真とカメラのアクセスの許可が必要です");
      }

      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== "granted") {
        Alert.alert(
          "エラー",
          "位置情報の許可がありません。設定から許可してください。"
        );
        setAddress("位置情報なし");
      } else {
        try {
          const location = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (geocode.length > 0) {
            const place = geocode[0];
            const fullAddress = `${place.region ?? ""}${place.city ?? ""}${
              place.street ?? ""
            }`;
            setAddress(fullAddress || "住所情報が見つかりませんでした");
          } else {
            Alert.alert("エラー", "住所情報が見つかりませんでした");
            setAddress("住所不明");
          }
        } catch (error) {
          console.log("位置取得エラー", error);
          Alert.alert("エラー", "位置情報の取得に失敗しました");
          setAddress("位置情報取得失敗");
        }
      }
      setLoading(false);
    })();

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    setCurrentDate(`${year}/${month}/${day}`);
  }, []);

  const openCamera = async () => {
    setShowImageOptions(false);
    if (!hasPermission) {
      Alert.alert("エラー", "カメラのアクセス権限がありません。");
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log("撮影がキャンセルされました");
      }
    } catch (error) {
      console.error("カメラの起動中にエラーが発生しました:", error);
      Alert.alert("エラー", "カメラの起動中に問題が発生しました。シミュレータではカメラは使用できません。");
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromLibrary = async () => {
    setShowImageOptions(false);
    if (!hasPermission) {
      Alert.alert("エラー", "写真ライブラリのアクセス権限がありません。");
      return;
    }
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log("画像の選択がキャンセルされました");
      }
    } catch (error) {
      console.error("画像ライブラリの起動中にエラーが発生しました:", error);
      Alert.alert("エラー", "画像ライブラリの起動中に問題が発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedImage = () => {
    setShowImageOptions(false);
    setSelectedImage(null);
  };

  const handleImageInputAreaPress = () => {
    setShowImageOptions(true);
  };

  const handlePost = () => {
    if (!selectedImage) {
      Alert.alert("エラー", "画像をアップロードしてください。");
      return;
    }
    router.push({
      pathname: "/upload/postform",
      params: {
        uri: selectedImage,
        title: title,
        memo: memo,
        date: currentDate,
        address: address,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>ロード中...</Text>
      </View>
    );
  }

  if (!hasPermission || address === "位置情報なし" || address === "位置情報取得失敗") {
    return (
      <View style={styles.permissionDeniedContainer}>
        <Text style={styles.permissionDeniedText}>
          写真または位置情報へのアクセスが許可されていません。スマートフォンの設定からこのアプリの権限を許可してください。
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.outerContainer} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior="position"
        style={{ flex: 1 }}
        keyboardVerticalOffset={-180} 
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.imageInputArea}
              onPress={handleImageInputAreaPress}
            >
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="add" size={48} color="#000" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.textInput, styles.groupedTextInput]}
                placeholder="タイトル"
                placeholderTextColor="#888"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.textInput, styles.memoInput, styles.groupedTextInput]}
                placeholder="メモを入力"
                placeholderTextColor="#888"
                value={memo}
                onChangeText={setMemo}
                multiline={true}
                numberOfLines={4}
              />
              <View style={[styles.dateTimeLocationContainer, styles.groupedDateTimeLocation]}>
                <Text style={styles.dateText}>{currentDate}</Text>
                <Text
                  style={styles.addressText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {address}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>次へ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showImageOptions && (
        <TouchableWithoutFeedback onPress={() => setShowImageOptions(false)}>
          <View style={styles.optionsOverlay}>
            <View style={[styles.optionsContainer, { paddingBottom: insets.bottom }]}>
              <Text style={styles.optionsTitle}>写真を選ぶ</Text>
              <View style={styles.optionButtonsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
                  <Ionicons name="camera-outline" size={40} color="#333" />
                  <Text style={styles.optionButtonText}>カメラ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={pickImageFromLibrary}>
                  <Ionicons name="image-outline" size={40} color="#333" />
                  <Text style={styles.optionButtonText}>ライブラリ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={clearSelectedImage}>
                  <Ionicons name="trash-outline" size={40} color="#333" />
                  <Text style={styles.optionButtonText}>削除</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 0,
  },
  cardContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  imageInputArea: {
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
    marginTop: 50,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 13,
  },
  inputGroup: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  groupedTextInput: {
    width: "100%",
  },
  memoInput: {
    height: 100,
    textAlignVertical: "top",
  },
  dateTimeLocationContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  groupedDateTimeLocation: {
    width: "100%",
  },
  dateText: {
    fontSize: 13,
    color: "#888",
    flex: 0,
  },
  addressText: {
    fontSize: 13,
    color: "#888",
    flex: 1,
    textAlign: "right",
  },
  postButton: {
    width: "40%",
    backgroundColor: "#F0E685",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "center",
  },
  postButtonText: {
    color: "#333",
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    color: "#333",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  permissionDeniedText: {
    color: "#FF6347",
    fontSize: 16,
    textAlign: "center",
  },
  optionsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  optionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  optionButton: {
    alignItems: "center",
    padding: 10,
  },
  optionButtonText: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
});