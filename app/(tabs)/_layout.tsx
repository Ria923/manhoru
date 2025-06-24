import { Tabs, usePathname } from "expo-router";
import React from "react";
import { Platform, Image, View, StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab"; // タブを押したときの触感効果を追加するカスタムボタン
import TabBarBackground from "@/components/ui/TabBarBackground"; // タブバーの背景デザイン（カスタム）
import { useColorScheme } from "@/hooks/useColorScheme"; // カラースキーム（ライト・ダークモード）取得用

export default function TabLayout() {
  const colorScheme = useColorScheme(); // 現在のカラースキーム（未使用だがテーマ制御に使える）

  const pathname = usePathname(); // 現在のフルパス（例: /upload/postform）
  const hiddenLogoPages = ["/upload/postform", "/upload/preview", "/Upload"];
  const shouldHideLogo = hiddenLogoPages.includes(pathname); // ロゴ非表示対象かどうか

  return (
    <View style={{ flex: 1 }}>
      {/* 左上のロゴ表示部分（特定ページでは非表示） */}
      {!shouldHideLogo && (
        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* タブナビゲーションの定義部分 */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            marginHorizontal: 2,
            height: 75,
            overflow: "hidden",
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require("@/assets/icons/location-active.png")
                    : require("@/assets/icons/location.png")
                }
                style={{ width: 40, height: 40, marginTop: 30 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: "ギャラリー",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require("@/assets/icons/grid-active.png")
                    : require("@/assets/icons/grid.png")
                }
                style={{ width: 35, height: 35, marginTop: 30 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Upload"
          options={{
            title: "アップロード",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require("@/assets/icons/upload-active.png")
                    : require("@/assets/icons/upload.png")
                }
                style={{ width: 35, height: 35, marginTop: 30 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "プロフィール",
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <Image
                source={
                  focused
                    ? require("@/assets/icons/profile-active.png")
                    : require("@/assets/icons/profile.png")
                }
                style={{ width: 32, height: 32, marginTop: 30 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tabs.Screen name="notice" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

// スタイル定義（ロゴ用）
const styles = StyleSheet.create({
  logoWrapper: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
    width: 120,
    height: 65,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 107,
    height: 61,
  },
});
