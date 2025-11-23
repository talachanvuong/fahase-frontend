import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Modal } from "@mui/material";
import api from "../../../../services/api";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbnailSrc, setThumbnailSrc] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);   // xem thumbnail
  const [pdfOpen, setPdfOpen] = useState(false);           // xem PDF

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/product/getById/${productId}`);
        const p = res.data.result;
        setProduct(p);

        setThumbnailSrc(
          p?._id ? `/api/blob/thumbnailPublic/${p._id}` : "/placeholder.png"
        );
      } catch {
        alert("Lỗi khi lấy chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (!product)
    return <Typography sx={{ mt: 2 }}>Không tìm thấy sản phẩm</Typography>;

  const categoryId = product.category?._id || product.category;

  return (
    <Box>
      <Typography variant="h4" mb={1}>
        {product.title}
      </Typography>

      <Typography mb={1}>
        Giá:{" "}
        {product.price
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)
          : "-"}
      </Typography>

      <Typography>{product.description}</Typography>

      {/* Thumbnail preview */}
      <Box mt={2} sx={{ cursor: "pointer", display: "inline-block" }}>
        <img
          src={thumbnailSrc}
          alt={product.title}
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 4 }}
          onError={() => setThumbnailSrc("/placeholder.png")}
          onClick={() => setPreviewOpen(true)}
        />
      </Box>

      {/* Modal thumbnail */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            outline: "none",
            maxWidth: "90%",
            maxHeight: "90%",
          }}
        >
          <img
            src={thumbnailSrc}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Modal>

      {/* Button xem PDF */}
      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setPdfOpen(true)}
          sx={{ mr: 2 }}
        >
          Xem File PDF
        </Button>
      </Box>

      {/* Modal PDF Viewer */}
      <Modal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            height: "90%",
            bgcolor: "white",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          <iframe
            src={`/api/blob/fileAdmin/${product._id}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="PDF Viewer"
          />
        </Box>
      </Modal>

      <Box mt={3}>
        <Button
          component={Link}
          to={`/admin/categories/${categoryId}/products`}
          variant="outlined"
        >
          Quay lại
        </Button>
      </Box>
    </Box>
  );
}
