import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>マンホール利用規約</Text>
          <Text style={styles.content}>
            この利用規約（以下、「本規約」といいます。）は、○○（）（以下、「当方」といいます。）が提供するアプリケーション「○○（アプリ名）」（以下、「本アプリ」といいます。）の利用条件を定めるものです。本アプリをご利用になるユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に同意の上、本アプリをご利用いただきます。
          </Text>

          <Text style={styles.sectionTitle}>第111条（本アプリの概要）</Text>
          <Text style={styles.content}>
            本アプリは、ユーザーが撮影したマンホールの画像をマップ上に投稿・共有し、他のユーザーと楽しむことを目的としたサービスです。
          </Text>

          <Text style={styles.sectionTitle}>第2条（利用登録）</Text>
          <Text style={styles.content}>
            1.
            本アプリの利用を希望する方は、本規約に同意の上、当方が定める方法により利用登録を行うものとします。
            2.
            未成年者の方は、法定代理人（親権者など）の同意を得てから本アプリをご利用ください。
          </Text>

          <Text style={styles.sectionTitle}>第3条（位置情報の利用）</Text>
          <Text style={styles.content}>
            当方は、以下の目的でユーザーの端末の位置情報を取得し、利用します。 •
            マップ機能で現在地を表示するため •
            投稿されたマンホールの位置情報を記録・表示するため •
            ユーザーに周辺のマンホール情報を提供するため
          </Text>

          <Text style={styles.sectionTitle}>第4条（投稿データについて）</Text>
          <Text style={styles.content}>
            1.
            ユーザーは、自らが撮影したマンホールの画像（以下、「投稿データ」といいます。）を本アプリにアップロードすることができます。
            2. 投稿データの著作権は、撮影したユーザー本人に帰属します。 3.
            ただし、ユーザーは、投稿データをアップロードした時点で、当方に対し、本アプリの提供、改善、宣伝広告に必要な範囲において、投稿データを無償で非独占的に使用（複製、上映、公衆送信、展示、頒布、翻訳、翻案などを含みます。）する権利を許諾したものとします。この権利許諾は、ユーザーが退会した後も有効に存続するものとします。
            4.
            ユーザーは、第三者の著作権、肖像権、プライバシー権、その他の権利を侵害しない画像を投稿するものとします。投稿データに関する第三者との紛争は、ユーザー自身の責任と費用において解決するものとし、当方は一切の責任を負いません。
          </Text>

          <Text style={styles.sectionTitle}>第5条（禁止事項）</Text>
          <Text style={styles.content}>
            ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません。 •
            法令または公序良俗に違反する行為 • 犯罪行為に関連する行為 •
            当方、他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
            • マンホールと無関係な画像を投稿する行為 •
            個人情報（氏名、住所、電話番号など）が写り込んでいる画像や、それを特定できる情報を投稿する行為
            • 他人が撮影した画像を無断で投稿する行為 •
            危険な場所での撮影行為や、撮影のために私有地へ無断で立ち入る行為 •
            当方のサービスの運営を妨害するおそれのある行為 •
            不正アクセスをし、またはこれを試みる行為 •
            他のユーザーに関する個人情報等を収集または蓄積する行為 •
            他のユーザーに成りすます行為 •
            当方のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
            • その他、当方が不適切と判断する行為
          </Text>

          <Text style={styles.sectionTitle}>
            第6条（本サービスの提供の停止等）
          </Text>
          <Text style={styles.content}>
            当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            •
            本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
            •
            地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
            • コンピュータまたは通信回線等が事故により停止した場合 •
            その他、当方が本サービスの提供が困難と判断した場合
          </Text>

          <Text style={styles.sectionTitle}>第7条（免責事項）</Text>
          <Text style={styles.content}>
            •
            当方は、本アプリに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            •
            当方は、本アプリに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
            •
            ユーザー間のトラブルについては、当事者間で解決するものとし、当方は関与しません。
          </Text>

          <Text style={styles.sectionTitle}>第8条（利用規約の変更）</Text>
          <Text style={styles.content}>
            当方は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の利用規約は、本アプリ内に掲示した時点から効力を生じるものとします。
          </Text>

          <Text style={styles.sectionTitle}>第9条（準拠法・裁判管轄）</Text>
          <Text style={styles.content}>
            • 本規約の解釈にあたっては、日本法を準拠法とします。 •
            本サービスに関して紛争が生じた場合には、当方の本店所在地を管轄する裁判所を専属的合意管轄とします。
          </Text>

          <Text style={styles.content}>以上</Text>

          <Text style={styles.sectionTitle}>【附則】</Text>
          <Text style={styles.content}>
            本規約は、XXXX年XX月XX日より施行します。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});
