import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import articleSampleData from "../../components/NoticeData";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);
  const article = articleSampleData.find((item) => item.id === numericId);

  if (!article) {
    return <Text style={styles.message}>記事が見つかりませんでした。</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.meta}>{article.category} | {article.author}</Text>

      {article.content.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.heading}</Text>
          <Text style={styles.sectionText}>{section.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  meta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: "#333",
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});