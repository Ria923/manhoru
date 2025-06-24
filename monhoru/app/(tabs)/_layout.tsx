import { Tabs, useRouter, useSegments } from "expo-router";
import React from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab"; // タブを押したときの触感効果を追加するカスタムボタン
import TabBarBackground from "@/components/ui/TabBarBackground"; // タブバーの背景デザイン（カスタム）
import { useColorScheme } from "@/hooks/useColorScheme"; // カラースキーム（ライト・ダークモード）取得用

export default function TabLayout() {
  const colorScheme = useColorScheme(); // 現在のカラースキーム（未使用だがテーマ制御に使える）
  const router = useRouter(); // ← これを追加

  const segments = useSegments(); // 現在の画面パス情報を取得（例: ["(tabs)", "upload"]）
  const currentRoute = segments[segments.length - 1] ?? ""; // 最後の要素が現在のページ名

  // 非表示にしたいページ名を配列で管理
  const hiddenHeaderPages = ["Upload"]; // 例: gallery, gallery/all など

  const shouldHideHeader = hiddenHeaderPages.includes(currentRoute);

  return (
    <View style={{ flex: 1 }}>
      {/* ロゴとお知らせボタンを特定ページ以外で表示 */}
      {!shouldHideHeader && (
        <>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/splash-icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("../../notice")}
            hitSlop={10}
          >
            <Image
              source={require("@/assets/icons/notification.png")}
              style={{ width: 55, height: 55 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </>
      )}

      {/* タブナビゲーション */}
      <Tabs
        screenOptions={{
          headerShown: false, // 画面上部のヘッダーは非表示
          tabBarButton: HapticTab, // カスタムのタブボタン（触感付き）
          tabBarBackground: TabBarBackground, // 背景デザイン（角丸・透明など）
          tabBarShowLabel: false, // タブにラベル（テキスト）は表示しない
          tabBarStyle: {
            position: "absolute", // タブを画面下部に固定
            backgroundColor: "transparent", // 背景を透明に
            borderTopLeftRadius: 25, // 左上の角丸
            borderTopRightRadius: 25, // 右上の角丸
            marginHorizontal: 2,
            height: 75, // タブバーの高さ
            overflow: "hidden", // オーバーフロー非表示（角丸対応）
            borderTopWidth: 0, // 上枠線なし
            elevation: 0, // Android の影をなくす
          },
        }}
      >
        {/* ホームタブ */}
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

        {/* ギャラリータブ */}
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

        {/* アップロードタブ（ロゴ非表示対象） */}
        <Tabs.Screen
          name="upload"
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

        {/* プロフィールタブ */}
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

        {/* タブには表示しないが、内部遷移では使用される画面 */}
        <Tabs.Screen name="notice" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

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
  notificationButton: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 10,
    backgroundColor: "transparent",
  },
});
