//register.tsx
import React, { useState, useEffect } from "react";
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
import { useRouter } from "expo-router";
import { app } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firestore = getFirestore(app);

function RegisterScreen() {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert("ログインしてください");
      router.replace("/onboarding?index=3");
    } else {
      setName(auth.currentUser?.displayName || "");
    }
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri as string);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("名前を入力してください");
      return;
    }

    try {
      const user = auth.currentUser || {
        uid: "DEBUG_USER",
        displayName: "Debug太郎",
      };
      console.log("使用者資訊：", user);

      const userRef = doc(firestore, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: name || user.displayName || "",
        avatarUrl: image || "",
        createdAt: serverTimestamp(),
      });

      console.log("註冊成功，導向首頁");
      router.replace("/");
    } catch (error) {
      console.error("註冊失敗", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatar} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.plus}>＋</Text>
        )}
      </TouchableOpacity>

      <View style={styles.inputRow}>
        <Text style={styles.label}>名前</Text>
        <TextInput
          style={styles.input}
          placeholder="太郎"
          value={name}
          onChangeText={setName}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitText}>登録する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffff",
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
