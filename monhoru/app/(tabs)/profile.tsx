import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.profileSection}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <ThemedText type="title">チョーニャンリン</ThemedText>
            <Text style={styles.emailText}>メール: 24aw0113@gmail.com</Text>
            <TouchableOpacity>
              <Text style={styles.editProfileText}>プロフィール編集</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>集めたマンホールの数</Text>
            <Text style={styles.statValue}>13</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>初めてのプレイ日</Text>
            <Text style={styles.statValue}>2025/6/1</Text>
          </View>
        </View>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={styles.footerLinkText}>利用規約</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLinkText}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileTextContainer: {
    justifyContent: "center",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  editProfileText: {
    fontSize: 14,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  statBox: {
    width: Dimensions.get("window").width * 0.4,
    height: 120,
    backgroundColor: "#FFFFA0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  footerLinks: {
    alignItems: "center",
  },
  footerLinkText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
});
