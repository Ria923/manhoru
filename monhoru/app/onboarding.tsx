import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import Swiper from "react-native-swiper";
import { slides } from "@/data/slidesData";

import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
const router = useRouter();

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              </View>
              <View style={{ alignItems: "center", marginTop: 440 }}>
                <TextInput
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 10,
                    marginVertical: 5,
                    width: 250,
                    marginBottom: 10,
                  }}
                  placeholder="メールアドレス"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    width: 250,
                  }}
                  placeholder="パスワード"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F0E685",
                    borderRadius: 8,
                    padding: 12,
                    width: 250,
                    alignItems: "center",
                  }}
                  onPress={async () => {
                    if (!email || !password) {
                      Alert.alert(
                        "入力エラー",
                        "メールアドレスとパスワードを入力してください"
                      );
                      return;
                    }
                    try {
                      const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                      });
                      if (error) {
                        console.error("Auth signUp error", error);
                        Alert.alert(
                          "登録失敗",
                          error.message || "未知のエラー"
                        );
                        return;
                      } else {
                        router.replace("/register");
                      }
                    } catch (e) {
                      console.error("ネットワークエラー:", e);
                      Alert.alert("ネットワークエラー", "接続に失敗しました");
                    }
                  }}
                >
                  <Text style={{ color: "#333" }}>登録</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/userlogin")}>
                  <Text style={styles.loginText}>ログイン</Text>
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
    top: 300,
  },
  character1: {
    position: "absolute",
    top: 350,
    left: 70,
    height: 90,
    width: 60,
    paddingBottom: 20,
    marginBottom: 60,
  },
  character2: {
    position: "absolute",
    top: 355,
    height: 70,
    width: 90,
  },
  character3: {
    position: "absolute",
    top: 350,
    right: 50,
    height: 75,
    width: 70,
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
  loginText: {
    fontSize: 15,
    marginTop: 16,
    color: "#ffffff",
    textAlign: "center",
    textDecorationLine: "none",
  },
});
