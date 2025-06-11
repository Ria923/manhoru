// components/KeyboardDismissWrapper.tsx

import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function KeyboardDismissWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }} // 這裡補上背景色
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

//入力まわりの機能を作るときは、これも忘れずに入れてね。
