import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";

export default function UserLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("ログイン失敗", error.message);
    } else {
      Alert.alert("ログイン成功", "お帰りなざい！");
      router.replace("/");
    }
  };

  return (
    <KeyboardDismissWrapper>
      <View style={styles.container}>
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
    </KeyboardDismissWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#739AD1",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
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
  },
  loginMessage: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    bottom: 20,
    alignSelf: "center",
  },
});
