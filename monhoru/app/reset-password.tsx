// /reset-password.tsx（或任意你頁面名稱）
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const url = window.location.href;
    const queryParams = new URLSearchParams(url.split("?")[1] || "");
    const hashParams = new URLSearchParams(url.split("#")[1] || "");

    const access_token =
      queryParams.get("access_token") || hashParams.get("access_token");
    const refresh_token =
      queryParams.get("refresh_token") || hashParams.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            setMessage("セッションエラー：" + error.message);
          }
        });
    } else {
      setMessage("トークン情報が見つかりませんでした。");
    }
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("失敗：" + error.message);
    } else {
      setMessage("パスワードが変更されました！");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        新しいパスワードを入力してください
      </Text>
      <TextInput
        placeholder="新しいパスワード"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        onPress={handleReset}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>変更する</Text>
      </TouchableOpacity>
      {message !== "" && (
        <Text style={{ marginTop: 10, color: "red" }}>{message}</Text>
      )}
    </View>
  );
}
