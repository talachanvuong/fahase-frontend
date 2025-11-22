import React, { useEffect } from "react";
import {Container, Box, Typography, Paper, Grid, Divider, Stack, Button, List, ListItem, ListItemAvatar, ListItemText, Avatar,} from "@mui/material";
import { ArrowBack, ShoppingCart } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../../hook/useCart";
import PayPalCheckout from "../../../components/paypal/PayPalCheckout";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();

  // Lấy thông tin sản phẩm "Mua ngay" từ state (nếu có)
  const buyNowProduct = location.state?.product;

  // Xác định danh sách sản phẩm cần thanh toán
  const checkoutItems = buyNowProduct ? [buyNowProduct] : cartItems;

  // Tính tổng tiền
  const total = checkoutItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // Redirect về giỏ hàng nếu không có sản phẩm
  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate("/cart");
    }
  }, [checkoutItems.length, navigate]);

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handlePaymentSuccess = () => {
    // Nếu là mua ngay thì không clear cart
    if (!buyNowProduct) {
      clearCart();
    }
    navigate("/order/success");
  };

  if (checkoutItems.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToCart}
          sx={{ mb: 2 }}
        >
          Quay lại giỏ hàng
        </Button>
        <Typography variant="h4" fontWeight="bold">
          💳 Thanh toán
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xác nhận đơn hàng và hoàn tất thanh toán
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/*Danh sách sản phẩm */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <ShoppingCart sx={{ mr: 1, verticalAlign: "middle" }} />
              Đơn hàng của bạn ({checkoutItems.length} sản phẩm)
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
              {checkoutItems.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.thumbnail}
                        alt={item.title}
                        variant="rounded"
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          {item.price?.toLocaleString()} ₫
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < checkoutItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Tóm tắt, Thanh toán */}
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              position: "sticky",
              top: 80,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tóm tắt đơn hàng
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">
                  Tạm tính ({checkoutItems.length} sản phẩm):
                </Typography>
                <Typography fontWeight="medium">
                  {total.toLocaleString()} ₫
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Phí vận chuyển:</Typography>
                <Typography fontWeight="medium" color="success.main">
                  Miễn phí
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Tổng cộng:
              </Typography>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {total.toLocaleString()} ₫
              </Typography>
            </Box>

            {/* PayPal Checkout */}
            <PayPalCheckout onSuccess={handlePaymentSuccess} />

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              sx={{ mt: 2 }}
            >
              🔒 Thanh toán an toàn qua PayPal
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}