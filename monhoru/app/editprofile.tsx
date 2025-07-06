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
import { Buffer } from "buffer";
import { decode } from "base64-arraybuffer";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      setCurrentUser(user);

      if (user) {
        // 先從 user_metadata 儲存的 full_name 與 avatar_url 更新狀態
        const { full_name, avatar_url: metaAvatarUrl } =
          user.user_metadata ?? {};
        if (full_name) {
          setName(full_name);
        }
        if (metaAvatarUrl) {
          setAvatar({ uri: metaAvatarUrl });
        }

        const { data: userData } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single();

        if (userData) {
          if (!full_name) setName(userData.name);
          if (!metaAvatarUrl && userData.avatar_url) {
            setAvatar({ uri: userData.avatar_url });
          }
        }
      }

      // 確保抓到最新的 metadata
      await supabase.auth.getUser();
    };

    fetchUser();
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

  const handleUpdate = async () => {
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

      if (avatar && avatar.uri && !avatar.uri.startsWith("http")) {
        const fileExt = avatar.uri.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const fileName = `avatar_${timestamp}.${fileExt}`;
        const filePath = `${currentUser.id}/${fileName}`;
        const contentType = fileExt === "png" ? "image/png" : "image/jpeg";

        // 上傳新照片
        const base64 = await FileSystem.readAsStringAsync(avatar.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const uint8Array = decode(base64);

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, uint8Array, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(
            "画像のアップロードに失敗しました: " + uploadError.message
          );
        }

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = data?.publicUrl || null;
      } else if (avatar && avatar.uri && avatar.uri.startsWith("http")) {
        avatarUrl = avatar.uri;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({
          name,
          avatar_url: avatarUrl,
        })
        .eq("id", currentUser.id);

      if (updateError) {
        throw new Error("ユーザー情報の更新に失敗しました");
      }

      await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarUrl,
        },
      });

      // 重新讀取並設置 metadata
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser();

      if (updatedUser?.user_metadata?.full_name) {
        setName(updatedUser.user_metadata.full_name);
      }

      Alert.alert("更新成功", "プロフィールが更新されました！");
      router.back();
    } catch (error: any) {
      console.error("更新失敗", error);
      Alert.alert("更新失敗", error.message);
    }
  };

  return (
    <KeyboardDismissWrapper>
      <View style={styles.container}>
        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {avatar ? (
            <Image
              source={{ uri: avatar?.uri ?? "" }}
              style={styles.avatarImage}
            />
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

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitText}>保存する</Text>
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
