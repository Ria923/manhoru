import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  Alert,
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

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        setLocation(location);

        // 取得した現在地を初期位置に設定
        if (location) {
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );

        return () => {
          subscription.remove();
        };
      } catch (error) {
        console.error("位置情報の取得に失敗しました:", error);
        Alert.alert("エラー", "位置情報の取得に失敗しました");
      }
    })();
  }, []);

  const moveToCurrentLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // stateも更新しておく
      setRegion(newRegion);
      // animateToRegionでスムーズに移動
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.error("現在地の取得に失敗:", error);
      Alert.alert("エラー", "現在地の取得に失敗しました");
    }
  };

  const akihabaraLocations = [
    {
      id: 1,
      title: "秋葉原駅",
      description: "JRと日比谷線の駅",
      latitude: 35.69836,
      longitude: 139.77313,
    },
    {
      id: 2,
      title: "神田明神",
      description: "歴史ある神社",
      latitude: 35.7018,
      longitude: 139.7676,
    },
    {
      id: 3,
      title: "ヨドバシAkiba",
      description: "大型家電量販店",
      latitude: 35.6986,
      longitude: 139.7748,
    },
    {
      id: 4,
      title: "秋葉原ガチャポン会館",
      description: "たくさんのガチャガチャがある",
      latitude: 35.7004,
      longitude: 139.7707,
    },
  ];

  // regionがセットされるまでローディング表示などにしても良い
  if (!region) {
    // 例: <ActivityIndicator size="large" />
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region} // 初期表示はinitialRegionを使うのがおすすめ
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={true}
        showsScale={true}
      >
        {akihabaraLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            description={location.description}
          />
        ))}
      </MapView>
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