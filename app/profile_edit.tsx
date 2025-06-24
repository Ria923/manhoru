import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileEditScreen() {
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
          headerTitle: "プロフィール編集",
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={styles.content}>チョーニャンリン</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    alignItems: "center",
    transform: [{ translateY: -100 }],
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
