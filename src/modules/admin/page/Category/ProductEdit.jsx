import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import api from "../../../../services/api";

export default function ProductEdit() {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewFileName, setPreviewFileName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/product/getByIdByAdmin/${productId}`);
        const p = data.result;

        setForm({
          title: p.title ?? "",
          price: p.price ?? "",
          description: p.description ?? "",
        });

        setOriginal({
          title: p.title ?? "",
          price: p.price ?? "",
          description: p.description ?? "",
        });

        setPreviewThumbnail(p.thumbnail);
        setPreviewFileName(p.file?.split("/").pop() ?? null);
      } catch (err) {
        console.error(err);
        setErrorMessage(
          err.response?.data?.result ||
            err.response?.data?.message ||
            "Không tải được dữ liệu sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setErrorMessage(null);
      const payload = {};
      let hasChange = false;

      ["title", "description"].forEach((key) => {
        if (form[key] !== original[key]) {
          payload[key] = form[key];
          hasChange = true;
        }
      });

      if (form.price !== original.price) {
        const priceNumber = Number(form.price);
        if (isNaN(priceNumber)) {
          setErrorMessage("Giá phải là số hợp lệ");
          return;
        }
        payload.price = priceNumber;
        hasChange = true;
      }

      if (!hasChange) {
        setErrorMessage("Bạn chưa thay đổi gì cả");
        return;
      }

      const res = await api.patch(`/product/update/${productId}`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert(res.data.result || "Cập nhật thành công!");
      navigate(`/admin/categories/${categoryId}/products`);
    } catch (err) {
      console.error("Update error:", err);
      setErrorMessage("Vui lòng sửa thông tin sản phẩm hợp lệ");
    }
  };

  const handleCancel = () => {
    navigate(`/admin/categories/${categoryId}/products`);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Chỉnh sửa sản phẩm
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Tên sản phẩm"
        name="title"
        value={form.title}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Giá"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Mô tả"
        name="description"
        multiline
        rows={4}
        value={form.description}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        {previewThumbnail && (
          <img
            src={previewThumbnail}
            alt="Thumbnail"
            style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 8 }}
          />
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        {previewFileName && <Typography>File hiện tại: {previewFileName}</Typography>}
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu thay đổi
        </Button>
        <Button variant="outlined" onClick={handleCancel}>
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
