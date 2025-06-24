import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: "利用規約",
        }}
      />
      <Text style={styles.title}>利用規約</Text>
      <Text style={styles.content}>
        マンホールの情報をアップロードした際、こちらの所有権になります、
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
