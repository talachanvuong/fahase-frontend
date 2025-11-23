import { useState, useEffect } from "react";
import { 
  Card, CardMedia, CardContent, Typography, Button, Box, 
  CardActionArea, CardActions, useTheme, alpha, Stack, CircularProgress 
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AddShoppingCart, ShoppingCartCheckout, Download } from "@mui/icons-material";
import { useCart } from "../hook/useCart";
import { useAuth } from "../hook/useAuth";
import api from "../services/api";

export default function ProductCard({ product }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  const title = product?.title || product?.name || "Sản phẩm";
  const price = product?.price || 0;
  const hasBackendId = Boolean(product?._id);
  const imageUrl = hasBackendId
    ? `/api/blob/thumbnailPublic/${product._id}`
    : product?.image || "https://via.placeholder.com/300x300?text=No+Image";
  const detailHref = hasBackendId ? `/ebook/${product._id}` : "#";

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user || !hasBackendId) {
        setCheckingPurchase(false);
        return;
      }

      setCheckingPurchase(true);
      try {
        const res = await api.get(`/bought/isBought/${product._id}`);
        if (res.data.status === 200) {
          setHasPurchased(res.data.result === true);
        }
      } catch (error) {
        console.error("Check purchase error:", error);
        setHasPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    };

    checkPurchase();
  }, [user, product._id, hasBackendId]);

  // Xử lý thêm giỏ hàng
  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasBackendId) return;

    addToCart({
      _id: product._id,
      title: title,
      price: price,
      thumbnail: imageUrl,
    });
  };

  // Xử lý "Mua ngay"
  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasBackendId) return;

    navigate("/checkout", {
      state: {
        product: {
          _id: product._id,
          title: title,
          price: price,
          thumbnail: imageUrl,
        },
      },
    });
  };

  // Xử lý đã mua
  const handleDownload = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Chuyển đến trang chi tiết để xem và tải file
    navigate(detailHref);
  };

  return (
    <Card
      sx={{
        width: 240,
        height: 400,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.15)}`,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={detailHref}
        disabled={!hasBackendId}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            width: "100%",
            height: 180,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f4f4f4",
          }}
        >
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            width: "100%",
            padding: "10px 12px 0 12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="600"
            noWrap
            title={title}
            sx={{ mb: 0.5 }}
          >
            {title}
          </Typography>


          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary.main"
            sx={{ mb: 1 }}
          >
            {price?.toLocaleString()} ₫
          </Typography>
        </CardContent>
      </CardActionArea>

      {/*Thay đổi dựa trên trạng thái mua */}
      <CardActions sx={{ p: 1.5, pt: 0 }}>
        {checkingPurchase ? (
          // Loading state
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : hasPurchased ? (
          // Đã mua
          <Button
            variant="contained"
            fullWidth
            color="success"
            onClick={handleDownload}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.85rem",
              borderRadius: 2,
            }}
          >
            Đã mua
          </Button>
        ) : (
          // Chưa mua 
          <Stack spacing={1} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCartCheckout />}
              disabled={!hasBackendId}
              onClick={handleBuyNow}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.85rem",
                borderRadius: 2,
              }}
            >
              Mua ngay
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddShoppingCart />}
              disabled={!hasBackendId}
              onClick={handleAddToCart}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "0.85rem",
                borderRadius: 2,
              }}
            >
              Thêm vào giỏ
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}