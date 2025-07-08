// /reset-password.tsx（或任意你頁面名稱）
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");

    if (access_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token: params.get("refresh_token") || "",
      });
    }
  }, []);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMessage("失敗：" + error.message);
    } else {
      setMessage("パスワードが変更されました！");
    }
  };

  return (
    <div>
      <h2>新しいパスワードを入力してください</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>変更する</button>
      <p>{message}</p>
    </div>
  );
}
