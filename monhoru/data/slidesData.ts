// data/slidesData.ts
export const slides = [
  {
    key: "1",
    cloudTextTop: "全国のレアマンホールを",
    cloudTextBottom: "探しにいこう！",
    title: null,
    description:
      "地図を使って、近くにある限定マンホールをチェック。さあ、あなただけの発見を見つけよう！",
    image: require("@/assets/onboarding/char1.png"),
    imageStyle: {
      height: 375,
      position: "absolute" as const,
      top: 90,
      right: -150,
    },
  },
  {
    key: "2",
    cloudTextTop: "",
    cloudTextBottom: "",
    title2: "集める！",
    description:
      "撮影＆登録して、コレクションに追加！同じマンホールでも、時間や季節で見え方が違うかも？",
    image: require("@/assets/onboarding/char2.png"),
    imageStyle: {
      height: 380,
      position: "absolute" as const,
      top: 90,
      left: -220,
    },
  },
  {
    key: "3",
    cloudTextTop: "",
    cloudTextBottom: "",
    title2: "見つけたマンホールをみんなにシェア！",
    description:
      "お気に入りの1枚を投稿して、全国の仲間とつながろう。コメントや「いいね」も楽しめるよ！",
    image: require("@/assets/onboarding/char3.png"),
    imageStyle: {
      height: 480,
      position: "absolute" as const,
      top: -80,
      right: -260,
    },
  },
  {
    key: "4",
    type: "login", //
    cloudTextTop: "",
    cloudTextBottom: "",
    title: "",
    description: "",
    image: null,
  },
];
