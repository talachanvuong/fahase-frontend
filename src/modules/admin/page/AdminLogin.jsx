// src/modules/admin/page/AdminLogin.jsx
import React, { useState } from "react";
import { Box, Paper, Typography, Stack, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hook/useAuth";

export default function AdminLogin() {
  const [form, setForm] = useState({ display_name: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAdmin(form.display_name, form.password);

      if (res.success) {
        // Login thành công → chuyển hướng dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(res.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Đăng nhập Quản trị
          </Typography>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={2}>
              <input
                name="display_name"
                placeholder="Display Name"
                value={form.display_name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ width: "100%", mt: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Sử dụng tài khoản admin đã tạo để đăng nhập.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
