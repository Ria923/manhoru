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
import * as ImagePicker from "expo-image-picker";
import { useRouter, useNavigation } from "expo-router";
import { supabase } from "@/lib/supabase";
import KeyboardDismissWrapper from "@/components/KeyboardDismissWrapper";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<any | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const router = useRouter();

  // Hide header on this screen
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const waitForSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!data.session) {
          console.warn("Session 尚未建立，1 秒後再試");
          setTimeout(waitForSession, 1000);
        } else {
          console.log("Session ready，現在可以安全執行 getUser");
          setCurrentUser(data.session.user);
        }
      } catch (err) {
        console.error("Session 錯誤", err);
      }
    };

    waitForSession();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setAvatar(file);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("アップロード失敗", "画像のアップロードに失敗しました。");
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("名前を入力してください");
      return;
    }

    if (!currentUser) {
      Alert.alert("ユーザー情報がありません");
      return;
    }

    try {
      let avatarUrl = null;
      if (avatar) {
        const fileUri = avatar.uri;
        const fileExt = fileUri.split(".").pop() || "jpg";
        const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const arrayBuffer = decode(base64); // base64 to ArrayBuffer

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, arrayBuffer, {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(
            "画像のアップロードに失敗しました: " + uploadError.message
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrlData?.publicUrl || null;
        setAvatarUrl(avatarUrl);
        console.log("avatarUrl:", avatarUrl);
      }

      const session = await supabase.auth.getSession();
      const email = currentUser.email || "";

      console.log("insert payload", {
        id: session.data.session?.user.id,
        name,
        email,
        avatar_url: avatarUrl,
      });

      const { error: upsertError } = await supabase.from("users").upsert(
        [
          {
            id: session.data.session?.user.id,
            name,
            email,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" }
      );

      if (upsertError) {
        console.error("Supabase upsert error", upsertError);
        Alert.alert("登録失敗", upsertError.message || "未知のエラー");
        return;
      }

      console.log("登録成功");
      await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarUrl,
        },
      });
      Alert.alert("登録成功", "ようこそ！");
      setTimeout(() => {
        router.replace("/");
      }, 1000); // 1 秒後indexのページに飛ぶ
    } catch (error: any) {
      console.error("登録失敗", error);
      Alert.alert("登録失敗", error.message);
    }
  };

  return (
    <KeyboardDismissWrapper>
      <View style={styles.container}>
        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar?.uri }} style={styles.avatarImage} />
          ) : avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.plus}>＋</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputRow}>
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={[styles.input, { color: name ? "#000" : "#ccc" }]}
            placeholder="太郎"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
          <Text style={styles.submitText}>登録する</Text>
        </TouchableOpacity>
      </View>
    </KeyboardDismissWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plus: {
    fontSize: 40,
    color: "#aaa",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    fontSize: 18,
    color: "#ccc",
    minWidth: 150,
  },
  submitButton: {
    backgroundColor: "#F0E685",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  submitText: {
    fontSize: 16,
    color: "#333",
  },
});

RegisterScreen.options = {
  headerShown: false,
};

export default RegisterScreen;
