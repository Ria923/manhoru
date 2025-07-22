import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
  Animated,
  PanResponder,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { ThemedView } from "./ThemedView";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";
type Post = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  image_url: string;
  created_at: string;
  user_name: string;
  comment: string;
};

type MergedLocation = {
  latitude: number;
  longitude: number;
  posts: Post[];
};

// --- Constants ---
const windowHeight = Dimensions.get("window").height;
const PARTIAL_VIEW_HEIGHT = 220;
const FULL_VIEW_HEIGHT = windowHeight * 0.85;

export default function ManholeMap() {
  // --- State ---
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Post | null>(null);
  const [displayLocation, setDisplayLocation] = useState<MergedLocation | null>(
    null
  );
  const [isSheetOpenFully, setIsSheetOpenFully] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mergedLocations, setMergedLocations] = useState<MergedLocation[]>([]);
  // --- Supabase fetch ---
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error("投稿取得失敗:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setPosts(data);
        // --- フィルタ: 緯度経度がnullでないデータのみ ---
        const validData = data.filter(
          (post) => post.latitude !== null && post.longitude !== null
        );
        const invalidCount = data.length - validData.length;
        if (invalidCount > 0) {
          console.warn(`${invalidCount} 件投稿缺少經緯度，已排除`);
        }
        // --- mergedLocations logic ---
        const mergeByLocation = (data: Post[]) => {
          const merged: MergedLocation[] = [];

          // 閾値: 約40m相当の緯度経度差
          const LOCATION_THRESHOLD = 0.0004;
          const isNearby = (
            a: { latitude: number; longitude: number },
            b: { latitude: number; longitude: number }
          ) => {
            const latDiff = Math.abs(a.latitude - b.latitude);
            const lngDiff = Math.abs(a.longitude - b.longitude);
            return latDiff < LOCATION_THRESHOLD && lngDiff < LOCATION_THRESHOLD;
          };

          data.forEach((post) => {
            const existing = merged.find((loc) =>
              loc.posts.some((p) => isNearby(p, post))
            );
            if (existing) {
              existing.posts.push(post);
            } else {
              merged.push({
                latitude: post.latitude,
                longitude: post.longitude,
                posts: [post],
              });
            }
          });

          return merged;
        };

        const merged = mergeByLocation(validData);
        setMergedLocations(merged);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  // --- Refs and Animations ---
  const mapRef = useRef<MapView>(null);
  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const animatedContentOpacity = useRef(new Animated.Value(0)).current;

  // --- Effects ---
  useFocusEffect(
    useCallback(() => {
      // Cleanup when the screen loses focus
      return () => {
        bottomSheetHeight.setValue(0);
        animatedContentOpacity.setValue(0);
        setSelectedLocation(null);
        setDisplayLocation(null);
        setIsSheetOpenFully(false);
      };
    }, [])
  );

  useEffect(() => {
    // Initialize location services on component mount
    let isMounted = true;
    let locationSubscription: Location.LocationSubscription | null = null;
    const initializeLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted)
            setErrorMsg("Permission to access location was denied");
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(currentLocation);
          const initialRegion = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          };
          setRegion(initialRegion);
          setCurrentRegion(initialRegion);
        }
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            if (isMounted) setLocation(newLocation);
          }
        );
      } catch (error) {
        console.error(error);
        if (isMounted) setErrorMsg("Failed to fetch location.");
      }
    };
    initializeLocation();
    return () => {
      isMounted = false;
      locationSubscription?.remove();
    };
  }, []);

  // --- Animations and Gestures ---
  const animateSheet = (
    height: number,
    opacity: number,
    onComplete?: () => void
  ) => {
    const isOpeningFully = height >= FULL_VIEW_HEIGHT;
    Animated.parallel([
      Animated.spring(bottomSheetHeight, {
        toValue: height,
        friction: 9,
        useNativeDriver: false,
      }),
      Animated.timing(animatedContentOpacity, {
        toValue: opacity,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsSheetOpenFully(isOpeningFully);
      onComplete?.();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => bottomSheetHeight.extractOffset(),
      onPanResponderMove: (e, gestureState) =>
        bottomSheetHeight.setValue(-gestureState.dy),
      onPanResponderRelease: (e, gestureState) => {
        bottomSheetHeight.flattenOffset();
        const finalHeight = (bottomSheetHeight as any)._value;

        if (gestureState.vy > 0.5 || finalHeight < PARTIAL_VIEW_HEIGHT * 0.5) {
          closeSheet();
        } else if (
          gestureState.vy < -0.5 ||
          finalHeight > PARTIAL_VIEW_HEIGHT * 1.5
        ) {
          animateSheet(FULL_VIEW_HEIGHT, 1);
        } else {
          animateSheet(PARTIAL_VIEW_HEIGHT, 1);
        }
      },
    })
  ).current;

  // --- Handlers ---
  const handleMarkerPress = (locationData: MergedLocation) => {
    // locationData is a MergedLocation (with posts array)
    const firstPost = locationData.posts[0];
    if (selectedLocation?.id === firstPost.id) {
      closeSheet();
    } else {
      setSelectedLocation(firstPost);
      setDisplayLocation(locationData);
      animateSheet(FULL_VIEW_HEIGHT, 1);
    }
  };

  const openMapApp = async (latitude: number, longitude: number) => {
    try {
      if (Platform.OS === "ios") {
        // iOSの場合、まずGoogleマップが入っているかチェック
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        const appleMapsUrl = `http://maps.apple.com/?daddr=${latitude},${longitude}`;

        const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);

        if (canOpenGoogleMaps) {
          // Googleマップが利用可能な場合
          Alert.alert("マップアプリを選択", "どのマップアプリで開きますか？", [
            {
              text: "Googleマップ",
              onPress: () => Linking.openURL(googleMapsUrl),
            },
            {
              text: "Appleマップ",
              onPress: () => Linking.openURL(appleMapsUrl),
            },
            {
              text: "キャンセル",
              style: "cancel",
            },
          ]);
        } else {
          // Googleマップが利用できない場合、Appleマップを開く
          await Linking.openURL(appleMapsUrl);
        }
      } else if (Platform.OS === "android") {
        // Androidの場合はGoogleマップを開く
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      console.error("マップアプリの起動に失敗しました:", error);
      Alert.alert("エラー", "マップアプリを起動できませんでした。");
    }
  };

  const closeSheet = () => {
    // Deselect the pin immediately so the map can update
    setSelectedLocation(null);

    // Use a synchronized TIMING animation just for closing
    Animated.parallel([
      Animated.timing(bottomSheetHeight, {
        toValue: 0,
        duration: 300, // A consistent duration
        useNativeDriver: false,
      }),
      Animated.timing(animatedContentOpacity, {
        toValue: 0,
        duration: 300, // The SAME duration
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Only clear the displayed content *after* the animation is complete
      setDisplayLocation(null);
    });
  };

  // --- Interpolations for Animated Styles ---
  const animatedImageHeight = bottomSheetHeight.interpolate({
    inputRange: [PARTIAL_VIEW_HEIGHT, FULL_VIEW_HEIGHT],
    outputRange: [100, windowHeight * 0.4],
    extrapolate: "clamp",
  });

  const animatedBorderRadius = bottomSheetHeight.interpolate({
    inputRange: [PARTIAL_VIEW_HEIGHT, FULL_VIEW_HEIGHT],
    outputRange: [18, 0],
    extrapolate: "clamp",
  });

  // --- Render ---
  if (!region) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <Text>{errorMsg || "Getting location..."}</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={(region) => {
          setCurrentRegion(region);
        }}
      >
        {/* ズームレベルが適切な場合のみピンを表示 */}
        {((currentRegion && currentRegion.latitudeDelta < 0.25) ||
          (!currentRegion && region && region.latitudeDelta < 0.25)) &&
          mergedLocations.map((locationItem, index) => {
            const firstPost = locationItem.posts[0]; // 最早投稿當代表
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: locationItem.latitude,
                  longitude: locationItem.longitude,
                }}
                onPress={() => handleMarkerPress(locationItem)}
                tracksViewChanges={selectedLocation?.id === firstPost.id}
                anchor={{ x: 0.5, y: 1 }}
              >
                <Image
                  source={require("@/assets/images/Map_pin.png")}
                  style={{ width: 45, height: 45 }}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
      </MapView>

      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={async () => {
          try {
            // 現在地ボタンを押した時に、最新の位置情報を取得
            const currentLocation = await Location.getCurrentPositionAsync({});
            mapRef.current?.animateToRegion(
              {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000
            );
          } catch (error) {
            console.error("現在地の取得に失敗しました:", error);
            // フォールバックとして、既存のlocationを使用
            if (location) {
              mapRef.current?.animateToRegion(
                {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                1000
              );
            }
          }
        }}
      >
        <Image
          source={require("@/assets/images/GPSicon.png")}
          style={styles.gpsIcon}
        />
      </TouchableOpacity>

      {displayLocation?.posts?.[0] && (
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              height: FULL_VIEW_HEIGHT,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              transform: [
                {
                  translateY: bottomSheetHeight.interpolate({
                    inputRange: [0, FULL_VIEW_HEIGHT],
                    outputRange: [FULL_VIEW_HEIGHT, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.grabberArea} {...panResponder.panHandlers}>
              <View style={styles.grabber} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.goToLocationButton}
              onPress={() =>
                openMapApp(displayLocation.latitude, displayLocation.longitude)
              }
            >
              <Text style={styles.goToLocationText}>ここへ行く</Text>
            </TouchableOpacity>
            <Animated.ScrollView
              style={[
                styles.contentScrollView,
                {
                  opacity: animatedContentOpacity,
                  height: FULL_VIEW_HEIGHT - 100,
                },
              ]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
            >
              <>
                {/* 投稿情報セクション */}
                <View style={styles.firstDiscovererSection}>
                  <Text style={styles.sectionTitle}>
                    {displayLocation.posts[0]?.title}
                  </Text>
                  <View style={styles.discovererInfo}>
                    <Text style={styles.discovererName}>
                      {displayLocation.posts[0]?.user_name}
                    </Text>
                    <Text style={styles.discovererDate}>
                      {displayLocation.posts[0]?.created_at?.split("T")[0]}
                    </Text>
                  </View>
                  <Text style={styles.discovererDescription}>
                    {displayLocation.posts[0]?.comment}
                  </Text>
                </View>
                {/* メイン画像 */}
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      displayLocation.posts[0]?.image_url
                        ? { uri: displayLocation.posts[0].image_url }
                        : require("@/assets/images/sampleManholeImg/1.jpg")
                    }
                    style={[styles.mainImage, { height: 250 }]}
                  />
                </View>
                {/* 他の投稿者 */}
                {displayLocation.posts.length > 1 && (
                  <View style={styles.otherUsersSection}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 8,
                      }}
                    >
                      他の投稿者
                    </Text>
                    {displayLocation.posts.slice(1).map((post, idx) => (
                      <View key={post.id} style={styles.userComment}>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{post.user_name}</Text>
                          <Text style={styles.userDate}>
                            {post.created_at?.split("T")[0]}
                          </Text>
                        </View>
                        <Text style={styles.userCommentText}>
                          {post.comment}
                        </Text>
                        <View style={styles.userImageContainer}>
                          <Image
                            source={
                              post.image_url
                                ? { uri: post.image_url }
                                : require("@/assets/images/sampleManholeImg/1.jpg")
                            }
                            style={styles.userManholeImage}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            </Animated.ScrollView>
          </View>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { width: "100%", height: "100%" },
  currentLocationButton: {
    position: "absolute",
    right: 15,
    bottom: Platform.OS === "ios" ? 100 : 40,
    zIndex: 10,

    borderRadius: 30,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gpsIcon: { width: 56, height: 56, resizeMode: "contain" },
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
    overflow: "hidden",
    zIndex: 20,
  },
  grabberArea: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 12,
    zIndex: 30,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#333",
    lineHeight: 28,
  },
  contentScrollView: { flex: 1 },
  // 第一発見者セクション
  firstDiscovererSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  discovererInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  discovererName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 16,
  },
  discovererDate: {
    fontSize: 14,
    color: "#666",
  },
  discovererDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // 画像セクション
  imageContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  mainImage: {
    width: 250,
    resizeMode: "cover",
  },
  // 他のユーザーセクション
  otherUsersSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userComment: {
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 12,
  },
  userDate: {
    fontSize: 12,
    color: "#666",
  },
  userCommentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 8,
  },
  userImageContainer: {
    alignItems: "center",
  },
  userManholeImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  // ここへ行くボタン
  goToLocationButton: {
    position: "absolute",
    top: 50,
    right: 12,
    backgroundColor: "#F0E685",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 30,
  },
  goToLocationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
