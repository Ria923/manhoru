import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import articleSampleData from "../../components/NoticeData";

export default function RelatedArticlesScreen() {
  const { id } = useLocalSearchParams();
  const numericId = Number(id);
  const router = useRouter();

  const currentArticle = articleSampleData.find((item) => item.id === numericId);
  if (!currentArticle) {
    return <Text style={styles.message}>記事が見つかりません</Text>;
  }

  const relatedArticles = articleSampleData.filter((item) => item.id !== numericId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        「{currentArticle.title}」に関連する記事
      </Text>

      {relatedArticles.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(`/notice/detail?id=${item.id}`)}
          style={styles.card}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.category} | {item.author}</Text>
        </Pressable>
      ))}

      {relatedArticles.length === 0 && (
        <Text style={styles.message}>関連する記事が見つかりませんでした。</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  message: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});