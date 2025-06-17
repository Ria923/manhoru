import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { ThemedView } from "./ThemedView";
import * as Location from "expo-location";

export function ManholeMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("位置情報の使用が許可されていません");
          Alert.alert("エラー", "位置情報の使用を許可してください");
          return;
        }

        // 位置情報の精度を設定
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        console.log("現在位置:", location.coords);
        setLocation(location);

        // 初期表示位置を現在地に設定
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // 位置情報の監視を開始
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            console.log("位置更新:", newLocation.coords);
            setLocation(newLocation);
          }
        );

        // クリーンアップ
        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error("位置情報の取得に失敗しました:", error);
        Alert.alert("エラー", "位置情報の取得に失敗しました");
      }
    })();
  }, []);

  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  if (!region) {
    return null; // 位置情報が取得できるまで表示しない
  }

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={true}
        showsScale={true}
      ></MapView>
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={moveToCurrentLocation}
      >
        <Image
          source={require("@/assets/images/GPSicon.png")}
          style={styles.gpsIcon}
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  currentLocationButton: {
    position: "absolute",
    right: 10,
    bottom: 100,
    padding: 15,
    zIndex: 1000,
  },
  gpsIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
