//onboarding.tsx

import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

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
import * as AuthSession from "expo-auth-session";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";
const router = useRouter();

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);

  const redirectUri = AuthSession.makeRedirectUri();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "1041159789914-mmjs70np13ht4b8ltjqp6br2nk6ejr9c.apps.googleusercontent.com",
    androidClientId:
      "1041159789914-7kpk3ac4k0fnk8m4mm5bnvacu35vgd9v.apps.googleusercontent.com",
    webClientId:
      "1041159789914-oae2rrl0o61q3rntua7594vs8ura0da2.apps.googleusercontent.com",

    scopes: ["openid", "email", "profile"],
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken); // IDトークンから認証情報を生成

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("登入成功：", userCredential.user.displayName);
          router.replace("/register"); // 或 router.push("/register")
        })
        .catch((error) => {
          console.error("登入失敗：", error);
          Alert.alert("登入失敗", error.message);
        });
    }
  }, [response]);

  const handleGoogleLogin = () => {
    console.log("redirectUri used:", redirectUri);
    promptAsync(); // Googleログインを開始
  };
  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      showsPagination={true}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      paginationStyle={{ position: "absolute", bottom: 50, right: 240 }}
      scrollEnabled={true}
    >
      {slides.map((item) => {
        if (item.type === "login") {
          return (
            <View key={item.key} style={styles.slide}>
              {/* 雲圖 */}
              <Image
                source={require("@/assets/onboarding/cloud-big.png")}
                style={styles.cloudBig4}
              />
              <Image
                source={require("@/assets/onboarding/cloud-small.png")}
                style={styles.cloudSmall4}
              />
              <View style={styles.middleRow}>
                <Image
                  source={require("@/assets/onboarding/character.login-left.png")}
                  style={styles.character1}
                />
                <Image
                  source={require("@/assets/onboarding/character.login-center.png")}
                  style={styles.character2}
                />
                <Image
                  source={require("@/assets/onboarding/character.login-right.png")}
                  style={styles.character3}
                />
              </View>
              <View style={styles.bottom}>
                <Text style={styles.loginMessage}>
                  \ さあ、はじめましょう！ /{" "}
                </Text>
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  style={styles.googleBtn}
                >
                  <Image
                    source={require("@/assets/onboarding/googleLogo.png")}
                    style={styles.googleLogoInBtn}
                  />
                  <Text style={styles.googleText}>Googleで登録する</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }

        if (item.key === "2") {
          return (
            <View key={item.key} style={styles.slide}>
              {/* トップエリア（雲） */}
              <View style={styles.top}>
                <Image
                  source={require("@/assets/onboarding/cloud-big.png")}
                  style={styles.cloudBig2}
                  resizeMode="contain"
                />
                <Image
                  source={require("@/assets/onboarding/cloud-small.png")}
                  style={styles.cloudSmall2}
                  resizeMode="contain"
                />
                <View style={styles.cloudTextWrapper2}>
                  <Text style={styles.cloudtitle2nd}>{item.title}</Text>
                  <Text style={styles.cloudtitle2nd}>{item.title2}</Text>
                </View>
              </View>

              {/* 中央のイラストエリア */}
              <View style={styles.middle}>
                <Image
                  source={item.image}
                  style={item.imageStyle}
                  resizeMode="contain"
                />
              </View>

              {/* ボトムエリア（説明文と次へボタン） */}
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
        }

        return (
          <View key={item.key} style={styles.slide}>
            {/* Top エリア */}
            <View style={styles.top}>
              <Image
                source={require("@/assets/onboarding/cloud-big.png")}
                style={styles.cloudBig}
                resizeMode="contain"
              />
              <Image
                source={require("@/assets/onboarding/cloud-small.png")}
                style={styles.cloudSmall}
                resizeMode="contain"
              />
              <View style={styles.cloudTextWrapper}>
                <Text style={styles.cloudTextTop}>{item.cloudTextTop}</Text>
                <Text style={styles.cloudTextBottom}>
                  {item.cloudTextBottom}
                </Text>
                <Text style={styles.cloudtitle}>{item.title}</Text>
                <Text style={styles.cloudtitle2}>{item.title2}</Text>
              </View>
            </View>

            {/* Middle エリア */}
            <View style={styles.middle}>
              <Image
                source={item.image}
                style={item.imageStyle}
                resizeMode="contain"
              />
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
    backgroundColor: "#739AD1",
    overflow: "hidden",
  },
  top: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  middle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    alignItems: "center",
    paddingBottom: 20,
  },
  cloudBig: {
    position: "absolute",
    top: 50,
    left: 25,
    width: 500,
    height: 245,
  },
  cloudBig2: {
    position: "absolute",
    top: 80,
    right: 30,
    width: 500,
    height: 245,
  },
  cloudSmall: {
    position: "absolute",
    top: 280,
    left: 40,
    width: 70,
    height: 90,
    resizeMode: "contain",
  },
  cloudSmall2: {
    position: "absolute",
    top: 290,
    left: 340,
    width: 70,
    height: 90,
    resizeMode: "contain",
  },
  cloudTextWrapper: {
    position: "absolute",
    top: 160,
    left: 60,
    width: "100%",
    alignItems: "center",
  },
  cloudTextWrapper2: {
    position: "absolute",
    top: 180,
    left: 40,
    width: "100%",
    alignItems: "center",
  },
  cloudTextTop: {
    fontSize: 20,
    color: "#515151",
    fontWeight: "400",
    paddingBottom: 5,
  },
  cloudTextBottom: {
    fontSize: 35,
    fontWeight: "500",
    color: "#515151",
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  nextBtn: {
    backgroundColor: "#F0E685",
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 300,
    shadowColor: "#5B66AC",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
    elevation: 6,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  dot: {
    backgroundColor: "#ddd",
    width: 10,
    height: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#d6f4ff",
    width: 50,
    height: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  loginMessage: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
    position: "absolute",
    top: 350,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    position: "absolute",
    top: 540,
  },
  googleText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
  },
  character1: {
    position: "absolute",
    top: 400,
    left: 50,
    height: 110,
    width: 75,
    paddingBottom: 20,
    marginBottom: 60,
  },
  character2: {
    position: "absolute",
    top: 400,
    height: 90,
    width: 110,
  },
  character3: {
    position: "absolute",
    top: 400,
    right: 50,
    height: 90,
    width: 75,
  },
  cloudtitle: {
    position: "absolute",
    top: 10,
    fontSize: 30,
    color: "#515151",
  },
  cloudtitle2: {
    position: "absolute",
    top: 3,
    left: 100,
    fontSize: 24,
    color: "#515151",
    width: "55%",
    fontWeight: "500",
  },
  cloudtitle2nd: {
    position: "absolute",
    top: 10,
    left: 35,
    fontSize: 36,
    color: "#515151",
    fontWeight: 400,
  },
  cloudBig4: {
    position: "absolute",
    width: 140,
    height: 90,
    left: 300,
    top: 30,
  },
  cloudSmall4: {
    position: "absolute",
    width: 70,
    height: 36,
    left: 170,
    top: 105,
  },
  googleLogo: {
    width: 100,
    height: 32,
    resizeMode: "contain",
    marginBottom: 20,
  },
  googleLogoInBtn: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    marginRight: 10,
  },
});
