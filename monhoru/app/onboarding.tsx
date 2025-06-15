console.log("onboarding loaded");

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import { slides } from "@/data/slidesData";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User,
} from "firebase/auth";
const { width } = Dimensions.get("window");

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "613318080473-bhanbml5946h27o8hma8vjt530vbg64f.apps.googleusercontent.com",
    iosClientId:
      "613318080473-3j18jo5n892kjvb7mhnmr95oufefka0e.apps.googleusercontent.com",
    androidClientId:
      "613318080473-f7b617dml07a5a6slj4gbfaavdam43v3.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken); // IDトークンから認証情報を生成

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("登入成功：", userCredential.user.displayName);
        })
        .catch((error) => {
          console.error("登入失敗：", error);
          Alert.alert("登入失敗", error.message);
        });
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync(); // ✅ Googleログインを開始
  };
  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      showsPagination={true}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      {slides.map((item) => {
        if (item.type === "login") {
          return (
            <View key={item.key} style={styles.slide}>
              <View style={styles.middleRow}>
                <Image
                  source={require("@/assets/onboarding/character.login-left.png")}
                  style={styles.character}
                />
                <Image
                  source={require("@/assets/onboarding/character.login-center.png")}
                  style={styles.character}
                />
                <Image
                  source={require("@/assets/onboarding/character.login-right.png")}
                  style={styles.character}
                />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.loginMessage}>さあ、はじめましょう！</Text>
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  style={styles.googleBtn}
                >
                  <Text style={styles.googleText}>Googleで登録する</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        return (
          <View key={item.key} style={styles.slide}>
            {/* Top エリア */}
            <View style={styles.top}>
              <Image
                source={require("@/assets/onboarding/cloud-big.png")}
                style={styles.cloudBig}
              />
              <Image
                source={require("@/assets/onboarding/cloud-small.png")}
                style={styles.cloudSmall}
              />
              <View style={styles.cloudTextWrapper}>
                <Text style={styles.cloudTextTop}>{item.cloudTextTop}</Text>
                <Text style={styles.cloudTextBottom}>
                  {item.cloudTextBottom}
                </Text>
              </View>
            </View>

            {/* Middle エリア */}
            <View style={styles.middle}>
              <Image source={item.image} style={styles.character} />
            </View>

            {/* Bottom エリア */}
            <View style={styles.bottom}>
              <Text style={styles.description}>{item.description}</Text>
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => swiperRef.current?.scrollBy(1)}
              >
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: "#8cbcf2",
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  middle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  middleRow: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  cloudBig: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 250,
    height: 130,
    resizeMode: "contain",
  },
  cloudSmall: {
    position: "absolute",
    top: 60,
    right: 10,
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
  cloudTextWrapper: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  cloudTextTop: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  cloudTextBottom: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  character: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: "contain",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  nextBtn: {
    backgroundColor: "#F2D230",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  loginMessage: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  googleText: {
    fontSize: 16,
    color: "#333",
  },
});
