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
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { ThemedView } from "./ThemedView";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";

// --- Mock Data and Types ---
const akihabaraLocations = [
  {
    id: 1,
    title: "秋葉原駅",
    description: "JRと日比谷線の駅",
    latitude: 35.69836,
    longitude: 139.77313,
    image: require("@/assets/images/sampleManholeImg/1.jpg"),
  },
  {
    id: 2,
    title: "神田明神",
    description: "歴史ある神社",
    latitude: 35.7018,
    longitude: 139.7676,
    image: require("@/assets/images/sampleManholeImg/2.jpeg"),
  },
  {
    id: 3,
    title: "ヨドバシAkiba",
    description: "大型家電量販店",
    latitude: 35.6986,
    longitude: 139.7748,
    image: require("@/assets/images/sampleManholeImg/3.jpeg"),
  },
  {
    id: 4,
    title: "秋葉原ガチャポン会館",
    description: "たくさんのガチャガチャがある",
    latitude: 35.7004,
    longitude: 139.7707,
    image: require("@/assets/images/sampleManholeImg/4.jpeg"),
  },
  {
    id: 5,
    title: "MLB 埼玉",
    description: "地元の野球選手デザインマンホール撮ってみた",
    latitude: 36.03447,
    longitude: 139.39882,
    image: require("@/assets/images/sampleManholeImg/5.jpeg"),
  },
];

type LocationData = (typeof akihabaraLocations)[0];

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
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [displayLocation, setDisplayLocation] = useState<LocationData | null>(
    null
  );
  const [isSheetOpenFully, setIsSheetOpenFully] = useState(false);

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
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
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
        Math.abs(gestureState.dy) > 5,
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
  const handleMarkerPress = (locationData: LocationData) => {
    if (selectedLocation?.id === locationData.id) {
      closeSheet();
    } else {
      setSelectedLocation(locationData);
      setDisplayLocation(locationData);
      animateSheet(PARTIAL_VIEW_HEIGHT, 1);
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
        {currentRegion &&
          currentRegion.latitudeDelta < 0.25 &&
          akihabaraLocations.map((locationItem) => (
            <Marker
              key={locationItem.id}
              coordinate={{
                latitude: locationItem.latitude,
                longitude: locationItem.longitude,
              }}
              onPress={() => handleMarkerPress(locationItem)}
              tracksViewChanges={selectedLocation?.id === locationItem.id}
              anchor={{ x: 0.5, y: 1 }}
            >
              <Image
                source={require("@/assets/images/Map_pin.png")}
                style={{ width: 45, height: 45 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
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

      {displayLocation && (
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              height: bottomSheetHeight,
              borderTopLeftRadius: animatedBorderRadius,
              borderTopRightRadius: animatedBorderRadius,
            },
          ]}
        >
          <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            <View style={styles.grabber} />
            <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <Animated.ScrollView
              style={[
                styles.contentScrollView,
                { opacity: animatedContentOpacity },
              ]}
              showsVerticalScrollIndicator={false}
              scrollEnabled={isSheetOpenFully}
            >
              <>
                <Animated.Image
                  source={displayLocation.image}
                  style={[styles.cardImage, { height: animatedImageHeight }]}
                />
                <Text style={styles.cardTitle}>{displayLocation.title}</Text>
                <Text style={styles.cardDescription}>
                  {displayLocation.description}
                </Text>
                <Text style={styles.cardDescription}>
                  ここにさらに長い説明や関連情報などを追加できます。
                </Text>
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
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
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
  cardImage: { width: "100%", resizeMode: "cover" },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  cardDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
});
