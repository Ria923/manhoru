import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

/**
 * FontAwesomeアイコンをタブバーで使いやすくするためのヘルパーコンポーネント
 * @param props - アイコン名と色を含むプロパティ
 * @returns - スタイルが適用されたアイコンコンポーネント
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  // styleでアイコンの垂直位置を微調整
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * アプリのメインとなるタブナビゲーションのレイアウトを定義するコンポーネント
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF", // アクティブなタブのアイコンとラベルの色
        headerShown: false, // すべての画面でヘッダーを非表示にする
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "マップ",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="map-marker" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "ギャラリー",
          tabBarIcon: ({ color }) => <TabBarIcon name="photo" color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "アップロード",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cloud-upload" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "プロフィール",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
