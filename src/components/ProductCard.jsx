import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CardActionArea,
  CardActions,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AddShoppingCart } from "@mui/icons-material";
import { useCart } from "../hook/useCart"; 

export default function ProductCard({ product }) {
  const theme = useTheme();
  const { addToCart } = useCart(); 

  const title = product?.title || product?.name || "Sản phẩm";
  const price = product?.price || 0;
  const author = product?.author;
  const hasBackendId = Boolean(product?._id);
  const imageUrl = hasBackendId
    ? `/api/blob/thumbnailPublic/${product._id}`
    : product?.image || "https://via.placeholder.com/300x300?text=No+Image";
  const detailHref = hasBackendId ? `/ebook/${product._id}` : "#";

  //  Xử lý khi nhấn thêm giỏ hàng
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

  return (
    <Card
      sx={{
        width: 240,
        height: 360,
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
      {/* --- Vùng nhấn chuyển đến chi tiết --- */}
      <CardActionArea
        component={RouterLink}
        to={detailHref}
        disabled={!hasBackendId}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Ảnh sản phẩm */}
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

        {/* Thông tin sản phẩm */}
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

          {author && (
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                mb: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={author}
            >
              {author}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

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

      {/* --- Nút thêm giỏ --- */}
      <CardActions sx={{ p: 1.5, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddShoppingCart />}
          disabled={!hasBackendId}
          onClick={handleAddToCart}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "0.9rem",
            borderRadius: 2,
          }}
        >
          Thêm vào giỏ
        </Button>
      </CardActions>
    </Card>
  );
}
