import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import sampleData from "../../components/SampleData";

const numColumns = 3;
const horizontalPadding = 16;
const cardMargin = 8;
const totalSpacing = horizontalPadding * 2 + cardMargin * (numColumns - 1);
const size = (Dimensions.get("window").width - totalSpacing) / numColumns;

export default function GalleryAllScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "すべての画像",
          headerBackTitle: "戻る",
        }}
      />

      <FlatList
        data={sampleData}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={numColumns}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: "/gallery/detail", params: { idx: index } })}
          >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    width: size,
    height: size,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginRight: cardMargin,
    marginBottom: cardMargin,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});