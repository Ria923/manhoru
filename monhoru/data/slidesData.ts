// data/slidesData.ts
export const slides = [
  {
    key: "1",
    cloudTextTop: "全国のレアマンホールを",
    cloudTextBottom: "探しにいこう！",
    title: "探そう！",
    description:
      "地図を使って、近くにある限定マンホールをチェック。さあ、あなただけの発見を見つけよう！",
    image: require("@/assets/onboarding/char1.png"),
  },
  {
    key: "2",
    cloudTextTop: "",
    cloudTextBottom: "",
    title: "集める！",
    description:
      "撮影＆登録して、コレクションに追加！同じマンホールでも、時間や季節で見え方が違うかも？",
    image: require("@/assets/onboarding/char1.png"),
  },
  {
    key: "3",
    cloudTextTop: "",
    cloudTextBottom: "",
    title: "シェア！",
    description:
      "お気に入りの1枚を投稿して、全国の仲間とつながろう。コメントや「いいね」も楽しめるよ！",
    image: require("@/assets/onboarding/char1.png"),
  },
  {
    key: "4",
    type: "login", // ✅ 登入頁唯一標記
    cloudTextTop: "",
    cloudTextBottom: "",
    title: "",
    description: "",
    image: null, // ✅ 不需要 image，圖直接在 onboarding 畫面裡載入
  },
];
