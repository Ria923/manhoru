import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import { ThemedView } from "./ThemedView";
import * as Location from "expo-location";

export function ManholeMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("位置情報の使用許可が必要です");
        Alert.alert("エラー", "位置情報の使用許可が必要です");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const centerMapOnLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location?.coords?.latitude ?? 35.6812,
          longitude: location?.coords?.longitude ?? 139.7671,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      ></MapView>
      {location && (
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={centerMapOnLocation}
        >
          <Text style={styles.myLocationButtonText}>現在地へ</Text>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  myLocationButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
