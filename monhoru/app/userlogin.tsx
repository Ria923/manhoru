import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Keyboard, // ◀ Platformは不要になったため削除
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

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
      Alert.alert(
        "入力エラー",
        "メールアドレスとパスワードを入力してください。"
      );
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
    // ▼▼▼ KeyboardAvoidingViewを削除し、TouchableWithoutFeedbackの直接の子をViewに ▼▼▼
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="white" />
        </TouchableOpacity>

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
    </TouchableWithoutFeedback>
    // ▲▲▲ 変更ここまで ▲▲▲
  );
}

const styles = StyleSheet.create({
  // keyboardAvoidingContainerは不要になったため削除
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#739AD1", // ◀ 背景色をこちらに移動
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 20,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
    
  },
  loginButton: {
    backgroundColor: "#F0E685",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 270,
  },
  loginText: {
    color: "#333",
    textAlign: "center",
  },
  character2: {
    height: 80,
    width: 100,
    bottom: 90,
    alignSelf: "center",
  },
  logingroup: {
    width: 270,
    bottom: 70,
    alignSelf: "center",
    alignItems: "center",
  },
  loginMessage: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 100,
    bottom: 20,
    alignSelf: "center",
  },
});