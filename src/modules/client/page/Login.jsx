// src/modules/client/page/Login.jsx
import React from "react";
import { Button, Stack } from "@mui/material";
import { useAuth } from "../../../hook/useAuth";

export default function Login() {
  const { login } = useAuth();

  // Demo tokens (HỖ TRỢ TEST OFFLINE)
  const demoLogin = (role = "user") => {
    const payload = { sub: "demo-user", email: `${role}@example.com`, role };
    const demoToken = "demo." + btoa(JSON.stringify(payload)) + ".sig";
    localStorage.setItem("token", demoToken);
    window.dispatchEvent(new CustomEvent("demo-login", { detail: payload }));
  };

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 8 }}>
      <Button variant="contained" onClick={() => login()}>Đăng nhập bằng Google</Button>

      <Button variant="outlined" onClick={() => demoLogin("user")}>Demo login (user)</Button>
      <Button variant="outlined" onClick={() => demoLogin("admin")}>Demo login (admin)</Button>
      <div style={{ fontSize: 12, color: "#666" }}>
        Lưu ý: nút Google sẽ chuyển hướng tới backend xử lý; nút Demo tạo token giả để test giao diện.
      </div>
    </Stack>
  );
}
