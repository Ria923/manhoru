import React from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import articleSampleData from "../../components/NoticeData";

export default function NoticeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.content} style={{ backgroundColor: "#fff" }}>
        <Text style={styles.mainTitle}>イベント | お知らせ</Text>
        {articleSampleData.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.overlay}>
              {/* <Text style={styles.cardTitle}>{item.title}</Text> */}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    marginTop: 60,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee",
    elevation: 2,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(60,60,60,0.35)",
  },
  // cardTitle: {
  //   color: "rgba(255, 255, 255, 0.7)",
  //   fontSize: 26,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   // backgroundColor: "rgba(255,255,255,0.7)",
  //   paddingHorizontal: 8,
  //   borderRadius: 8,
  // },
});
