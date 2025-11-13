// src/modules/client/page/Login.jsx
import React, { useEffect } from "react";
import {
  Button,
  Stack,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material"; // Icon cho Google
import { AccountCircle, VerifiedUser } from "@mui/icons-material"; // Icons cho Demo
import { useAuth } from "../../../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Demo tokens (HỖ TRỢ TEST OFFLINE)
  const demoLogin = (role = "user") => {
    const payload = { sub: "demo-user", email: `${role}@example.com`, role };
    // Tạo token giả: header.payload.signature
    const demoToken = "demo." + btoa(JSON.stringify(payload)) + ".sig"; 
    localStorage.setItem("token", demoToken);
    // Kích hoạt event để hệ thống `useAuth` có thể nhận biết và cập nhật state
    window.dispatchEvent(new CustomEvent("demo-login", { detail: payload }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // Chiếm gần hết chiều cao màn hình
        p: 2,
      }}
    >
      <Paper 
        elevation={10} // Độ sâu lớn hơn, hiện đại hơn
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3, // Bo góc nhiều hơn
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', // Box shadow tinh tế
        }}
      >
        <Stack spacing={3} alignItems="center">
          
          <Typography variant="h5" component="h1" fontWeight={700} color="primary.main">
            Chào mừng trở lại!
          </Typography>
          
          {/* Nút Đăng nhập Chính - Google */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => login()}
            startIcon={<GoogleIcon />}
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 2,
            }}
          >
            Tiếp tục với Google
          </Button>

          {/* Đường ngăn cách */}
          <Divider sx={{ width: '100%', my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              HOẶC
            </Typography>
          </Divider>

          {/* Khu vực Demo Login (Testing) */}
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              textAlign="center" 
              mb={1}
            >
              (Dành cho Người Phát triển - Test Offline)
            </Typography>
            
            <Stack spacing={1} direction="row" justifyContent="space-between">
              {/* Nút Demo User */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => demoLogin("user")}
                startIcon={<AccountCircle />}
                sx={{ flexGrow: 1, mr: 1 }}
              >
                Người dùng
              </Button>
              
              {/* Nút Demo Admin */}
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => demoLogin("admin")}
                startIcon={<VerifiedUser />}
                sx={{ flexGrow: 1, ml: 1 }}
              >
                Quản trị viên
              </Button>
            </Stack>
          </Box>
        
        </Stack>
      </Paper>
      
      {/* Ghi chú */}
      <Box sx={{ mt: 3, textAlign: 'center', position: 'absolute', bottom: 20 }}>
        <Typography variant="caption" color="text.disabled">
          *Nút Google sẽ chuyển hướng tới backend xử lý. Các nút Demo tạo token giả để test giao diện.
        </Typography>
      </Box>
    </Box>
  );
}