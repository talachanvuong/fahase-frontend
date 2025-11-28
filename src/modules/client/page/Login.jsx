// src/modules/client/page/Login.jsx
import React, { useEffect } from "react";
import {Button, Stack, Typography, Paper, Box, Divider,} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material"; 
import { useAuth } from "../../../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { loginUser, user, loading } = useAuth();
  const navigate = useNavigate();

   useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', 
        p: 2,
      }}
    >
      <Paper 
        elevation={10} 
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', // Box shadow tinh tế
        }}
      >
        <Stack spacing={3} alignItems="center">
          
          <Typography variant="h5" component="h1" fontWeight={700} color="primary.main">
            Chào mừng trở lại!
          </Typography>
          
          {/*Google */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => loginUser()}
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
              ĐĂNG NHẬP BẰNG MAIL EDU VAA
            </Typography>
          </Divider>
        </Stack>
      </Paper>
    </Box>
  );
}