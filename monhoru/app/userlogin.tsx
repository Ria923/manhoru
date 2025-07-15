import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons"; // ◀◀◀ Ioniconsをインポート

export default function UserLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/");
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("入力エラー", "メールアドレスとパスワードを入力してください。");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("ログイン失敗", error.message);
    } else {
      Alert.alert("ログイン成功", "お帰りなさい！");
      router.replace("/");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.container}>
          {/* ▼▼▼ Ioniconsを使った戻るボタンに変更 ▼▼▼ */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          {/* ▲▲▲ 変更ここまで ▲▲▲ */}

          <View>
            <Text style={styles.loginMessage}>\ お帰りなさい！ / </Text>
          </View>
          <Image
            source={require("@/assets/onboarding/character.login-center.png")}
            style={styles.character2}
          />
          <View style={styles.logingroup}>
            <TextInput
              placeholder="メールアドレス"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="パスワード"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>ログイン</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#739AD1",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
  },
  // backButtonTextスタイルは不要になったため削除
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#F0E685",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  loginText: {
    color: "#333",
    textAlign: "center",
  },
  character2: {
    height: 80,
    width: 100,
    bottom: 20,
    alignSelf: "center",
  },
  logingroup: {
    width: 250,
    bottom: 10,
    alignSelf: "center",
    alignItems: "center",
  },
  loginMessage: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    bottom: 20,
    alignSelf: "center",
  },
});