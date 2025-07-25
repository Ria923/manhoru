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
import { useState, useCallback } from "react";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const windowWidth = Dimensions.get("window").width;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [user, setUser] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUser = async () => {
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setEmail(data.user.email ?? "");
        setName(data.user.user_metadata.full_name ?? "");
        setAvatarUrl(data.user.user_metadata.avatar_url ?? "");
        setUser(data.user);
        // fetch post count
        fetchCount(data.user.id);
      }
    };

    const fetchCount = async (userId: string) => {
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (!error && typeof count === "number") {
        setPostCount(count);
      }
    };

    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  // プロフィールを同期する関数
  const updateMyMetadata = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        avatar_url: avatarUrl,
      },
    });
    if (error) {
      console.error("補寫失敗", error);
      alert("補寫失敗！");
    } else {
      alert("プロフィール已同步！");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウト失敗", error);
      alert("ログアウトに失敗しました");
    } else {
      router.replace("/onboarding"); // ← 這行要加！
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: `${avatarUrl}?t=${Date.now()}` }}
              style={styles.profileImage}
            />
            <View style={styles.profileTextContainer}>
              <ThemedText type="title">{name}</ThemedText>
              <Text style={styles.emailText}>{email}</Text>
              <TouchableOpacity onPress={() => router.push("/editprofile")}>
                <Text style={styles.editProfileText}>プロフィール編集</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>集めたマンホール</Text>
              <Text style={styles.statValue}>{postCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>初めてのプレイ日</Text>
              <Text style={styles.statDate}>
                {new Date(user?.created_at ?? "").toLocaleDateString("ja-JP")}
              </Text>
            </View>
          </View>
          <Image
            source={require("@/assets/onboarding/char1.png")}
            style={styles.decorativeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={styles.footerLinkText1}>利用規約</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
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
    paddingTop: 60,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
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
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  editProfileText: {
    fontSize: 14,
    color: "#666",
    paddingTop: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  statBox: {
    width: Dimensions.get("window").width * 0.4,
    height: 150,
    borderWidth: 2,
    borderColor: "#A9D0F5",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  statDate: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  footerLinks: {
    alignItems: "center",
    marginBottom: 75,
  },
  footerLinkText1: {
    fontSize: 16,
    color: "#545353ff",
    marginBottom: 15,
  },
  footerLinkText: {
    fontSize: 16,
    color: "#cdcdcdff",
    marginBottom: 30,
  },
  decorativeImage: {
    width: "100%",
    height: 180,
    marginTop: 70,
    right: 120,
  },
});
