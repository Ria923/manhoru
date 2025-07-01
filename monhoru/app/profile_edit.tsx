import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView, // これを追加
    Image,      // これを追加
  } from "react-native";
  import { Stack, useRouter } from "expo-router";
  import { Ionicons } from "@expo/vector-icons";
  
  // ThemedView はカスタムコンポーネントかな？
  // その場合は、正しいパスからimportしてね。
  // 例: import { ThemedView } from '@/components/ThemedView';
  // ここでは一旦、通常の <View> を使って修正しておくね。
  
  export default function TermsScreen() {
    const router = useRouter();
  
    return (
      // 1. 全体を単一の親要素 <View> で囲む
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerTitle: "プロフィール編集",
          }}
        />
        
        {/* 閉じタグがなかったので修正 */}
        {/* ThemedViewの代わりにViewを使用 */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            {/* 何か表示するコンテンツがないと空っぽになっちゃうから、Textを追加してみた */}
            <Text style={styles.content}>
            チョーニャンリン
            </Text>
          </View>
        </ScrollView>
      </View> 
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 16,
    },
    header: {
      alignItems: "center",

      transform: [{ translateY: -100 }], // 負の値で上に、正の値で下に
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,

      marginBottom: 34,
    },
    content: {
      fontSize: 16,
      lineHeight: 24,
    },
  });