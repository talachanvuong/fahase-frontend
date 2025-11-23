import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import api from "../../../../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/product/getByIdByAdmin/${id}`).then(res => setProduct(res.data)).catch(err => console.error(err));
  }, [id]);

  if (!product) return <Typography>Đang tải...</Typography>;

  return (
    <Box>
      <Typography variant="h5">Chi tiết sản phẩm #{id}</Typography>
      <Typography mt={1}>Tên: {product.name}</Typography>
      <Typography>Giá: {product.price}</Typography>
      <Typography>Mô tả: {product.description}</Typography>
      {product.thumbnail && (
        <img src={`/api/thumbnailPublic/${id}`} alt="thumbnail" style={{ marginTop: 10, maxWidth: 200 }} />
      )}
    </Box>
  );
}
