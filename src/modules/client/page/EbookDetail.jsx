import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container, // (MỚI) Dùng Container để căn giữa và giới hạn chiều rộng
  Divider, // (MỚI) Để phân chia nội dung rõ ràng
  Skeleton, // (MỚI) Cho hiệu ứng tải trang
  useTheme,
  Stack,
  Rating, // (MỚI) Thêm rating để tăng độ tin cậy
  Alert
} from "@mui/material";
import { useCart } from "../../../hook/useCart";
import api from "../../../services/api";
import { AddShoppingCart, FavoriteBorder } from "@mui/icons-material"; // Icons

// (MỚI) Mock data cho các trường nâng cao
const mockAdditionalInfo = {
  author: "Tác giả Demo",
  publisher: "Nhà xuất bản A",
  rating: 4.5,
  reviews: 120,
  stock: 5,
};

// (MỚI) Component Skeleton cho trang chi tiết
const DetailSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item md={6} xs={12}>
      <Skeleton variant="rectangular" sx={{ width: "100%", aspectRatio: "1/1", borderRadius: 3 }} />
    </Grid>
    <Grid item md={6} xs={12}>
      <Skeleton height={50} width="80%" sx={{ mb: 2 }} />
      <Skeleton height={20} width="50%" sx={{ mb: 1 }} />
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}><Skeleton width={100} height={20} /></Stack>
      <Divider sx={{ my: 2 }} />
      <Skeleton height={60} width="40%" sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={56} width="100%" />
      <Skeleton height={200} sx={{ mt: 3 }} />
    </Grid>
  </Grid>
);

export default function EbookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Load product data (Giữ nguyên logic)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/product/getById/${id}`);
        const data = res.data?.result;
        // Gán thêm mock info nếu cần
        if (data) setProduct({ ...data, ...mockAdditionalInfo }); 
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Container maxWidth="lg" sx={{ py: 4 }}><DetailSkeleton /></Container>;
  if (!product) return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="error">Không tìm thấy sản phẩm này hoặc sản phẩm đã bị xóa.</Alert>
    </Container>
  );

  const displayName = product.title || product.name;
  const price = product.price || 0;
  const image = product.thumbnail || `/api/blob/thumbnailPublic/${product._id}`;
  const description = product.description || "";
  const stock = product.stock || 0;
  const isInStock = stock > 0;

  const handleAdd = () => {
    addToCart({
      _id: product._id,
      title: displayName,
      price: price,
      thumbnail: image,
    });
  };

  return (
    // (MỚI) Dùng Container để căn giữa
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={5}>
        {/* === CỘT 1: HÌNH ẢNH === */}
        <Grid item md={6} xs={12}>
          {/* (MỚI) Thiết kế ảnh nổi bật hơn */}
          <Box 
            sx={{
              position: 'sticky',
              top: theme.spacing(2), // Giữ ảnh cố định khi cuộn
              aspectRatio: '1/1', // Đảm bảo hình vuông
              overflow: 'hidden',
              borderRadius: 3,
              boxShadow: 3, // Bóng đổ nhẹ nhàng
            }}
          >
            <img 
              src={image} 
              alt={displayName} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </Box>
        </Grid>

        {/* === CỘT 2: THÔNG TIN & HÀNH ĐỘNG === */}
        <Grid item md={6} xs={12}>
          {/* Tên sản phẩm */}
          <Typography variant="h3" fontWeight="bold" mb={1} sx={{ lineHeight: 1.2 }}>
            {displayName}
          </Typography>


          {/* Đường phân chia */}
          <Divider sx={{ my: 2 }} />

          {/* Giá */}
          <Typography variant="h4" fontWeight="bold" color="primary.main" mb={3}>
            {price.toLocaleString()} ₫
          </Typography>

          {/* === NÚT HÀNH ĐỘNG CTA Đôi (MỚI) === */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddShoppingCart />}
              onClick={handleAdd}
              fullWidth
              disabled={!isInStock}
              sx={{ py: 1.5, fontWeight: 'bold' }} // Nút to, nổi bật
            >
              Thêm vào giỏ hàng
            </Button>
          </Stack>

          {/* Đường phân chia */}
          <Divider sx={{ my: 3 }} />

          {/* Mô tả sản phẩm */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Mô tả sản phẩm
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              color: 'text.primary', 
              lineHeight: 1.6,
              // Giới hạn chiều cao cho đoạn mô tả dài
              maxHeight: 300, 
              overflowY: 'auto',
            }}
          >
            {description}
          </Typography>
          
          {/* Bạn có thể thêm các Tab cho Chi tiết kỹ thuật / Đánh giá ở đây */}
          
        </Grid>
      </Grid>
    </Container>
  );
}