import React from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Grid,      // Dùng Grid để chia 2 cột
  Divider,   // Phân chia rõ ràng
  Container, // Căn giữa nội dung
  Stack,     // Quản lý các nút
  Alert,
  useTheme
} from "@mui/material";
import { Delete, ShoppingCartCheckout } from "@mui/icons-material";
import { useCart } from "../../../hook/useCart";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang checkout

// Component Riêng cho từng Sản phẩm trong giỏ hàng (Không có nút +/-)
const CartItemDisplay = ({ item, removeFromCart, theme }) => {
  // Backend returns: { _id, title, price, thumbnail }
  // quantity luôn là 1 từ backend (không support multiple quantities)
  const quantity = 1;
  const subtotal = item.price * quantity;
  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        mb: 2,
        gap: 2,
      }}
    >
      {/* 1. Hình ảnh & Thông tin sản phẩm */}
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <img
          src={item.thumbnail}
          alt={item.title}
          style={{ 
            width: 90, 
            height: 90, 
            borderRadius: 8, 
            marginRight: 2,
            objectFit: 'cover'
          }}
        />
        <Box>
          <Typography fontWeight="bold" noWrap>{item.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
            {item.price.toLocaleString()} ₫
          </Typography>
        </Box>
      </Box>

      {/* 2. Tổng phụ & Xóa */}
      <Box sx={{ display: "flex", alignItems: 'center', gap: 1 }}>
        <Typography fontWeight="bold" color="primary.main" sx={{ minWidth: 100, textAlign: 'right' }}>
            {subtotal.toLocaleString()} ₫
        </Typography>
        <IconButton color="error" size="medium" onClick={() => removeFromCart(item._id)}>
            <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default function Cart() {
  // Đã xóa updateQuantity để phù hợp với code gốc mới nhất
  const { cartItems, removeFromCart, clearCart } = useCart(); 
  const navigate = useNavigate();
  const theme = useTheme();

  // Backend returns items with quantity = 1 always. Calculate total without quantity multiplier.
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Logic phụ cho tóm tắt đơn hàng 
  const total = subTotal;

  if (cartItems.length === 0)
    return (
        <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="h5" mb={2}>Giỏ hàng của bạn đang trống. 😟</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
                Tiếp tục mua sắm
            </Button>
        </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        🛒 Giỏ hàng của bạn
      </Typography>

      <Grid container spacing={4}>
        {/* === CỘT 1: DANH SÁCH SẢN PHẨM (8/12) === */}
        <Grid item xs={12} md={8}>
          <Box>
            {cartItems.map((item) => (
              <CartItemDisplay 
                key={item._id} 
                item={item} 
                removeFromCart={removeFromCart} 
                theme={theme}
              />
            ))}
          </Box>
          
          {/* Nút Xóa toàn bộ giỏ hàng */}
          <Button 
            variant="text" 
            color="error" 
            sx={{ mt: 1, textDecoration: 'underline' }} 
            onClick={clearCart}
            startIcon={<Delete />}
          >
            Xóa toàn bộ giỏ hàng
          </Button>

        </Grid>

        {/* === CỘT 2: TÓM TẮT ĐƠN HÀNG (4/12) - Sticky trên desktop === */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              p: 3, 
              border: `1px solid ${theme.palette.primary.main}`, 
              borderRadius: 3, 
              // Cần thêm position: 'sticky' và top: 80 nếu muốn cố định Summary Box
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Tóm tắt đơn hàng
            </Typography>

            <Stack spacing={1} mb={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Tạm tính ({cartItems.length} sản phẩm):</Typography>
                <Typography>{subTotal.toLocaleString()} ₫</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {total.toLocaleString()} ₫
              </Typography>
            </Box>

            {/* Nút Thanh toán (Checkout) */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<ShoppingCartCheckout />}
              // onClick={() => navigate('/checkout')} 
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Tiến hành thanh toán
            </Button>
            
            {/* Nút Tiếp tục mua sắm */}
            <Button
              variant="text"
              color="primary"
              fullWidth
              onClick={() => navigate('/')}
              sx={{ mt: 1 }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}