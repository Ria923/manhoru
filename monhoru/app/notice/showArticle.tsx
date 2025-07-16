import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router";
import articleSampleData from "../../components/NoticeData";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ShowArticleScreen() {
  const { id } = useLocalSearchParams();
  const article = articleSampleData.find(item => item.id === Number(id));
  const navigation = useNavigation();

  if (!article) {
    return (
      <View style={styles.center}>
        <Text>記事が見つかりませんでした。</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "", // You can change this title
          // headerBackTitleVisible: false, // <-- REMOVE THIS LINE
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>{article.title}</Text>
        <Image source={article.image} style={styles.image} />
        <Text style={styles.description}>{article.description}</Text>

        {article.content.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.text}>{section.text}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  image: { width: "100%", height: 180, borderRadius: 12, marginBottom: 12 },
  description: { fontSize: 16, marginBottom: 16 },
  section: { marginBottom: 20 },
  heading: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  text: { fontSize: 15, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});