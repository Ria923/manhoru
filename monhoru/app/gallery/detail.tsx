import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import sampleData from "../../components/SampleData";

export default function DetailScreen() {
  const { idx } = useLocalSearchParams();
  const index = Number(Array.isArray(idx) ? idx[0] : idx);
  const data = sampleData[index];
  const router = useRouter();

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>データが見つかりません</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "マンホール詳細",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ flex: 1, padding: 24 }}>
        <View style={{ alignItems: "center" }}>
          <Image source={data.image} style={{ width: 300, height: 300, borderRadius: 16 }} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>{data.title}</Text>
        <Text style={{ fontSize: 12, color: "#555", marginTop: 8 }}>{`投稿日：${data.date}`}</Text>
        <Text style={{ fontSize: 16, color: "#333", marginTop: 16 }}>{data.memo}</Text>
      </View>
    </>
  );
}