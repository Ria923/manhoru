import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView from "react-native-maps";
import { ThemedView } from "./ThemedView";

export function ManholeMap() {
  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.6812, // 東京の緯度
          longitude: 139.7671, // 東京の経度
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
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
});
