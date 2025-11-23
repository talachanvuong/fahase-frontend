import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import api from "../../../../services/api";

export default function ProductEdit() {
  const { categoryId, productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: null,
    file: null,
  });
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewFileName, setPreviewFileName] = useState(null);

  // ============ LOAD PRODUCT ============
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/getByIdByAdmin/${productId}`);
        const p = res.data.result;

        setForm({
          title: p.title ?? "",
          price: p.price ?? "",
          description: p.description ?? "",
          thumbnail: null,
          file: null,
        });

        setOriginal({
          title: p.title ?? "",
          price: p.price ?? "",
          description: p.description ?? "",
        });

        setPreviewThumbnail(p.thumbnail);
        setPreviewFileName(p.file?.split("/").pop() ?? null);
      } catch {
        alert("Không tải được dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ============ HANDLE INPUT ============
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "thumbnail") {
        setForm({ ...form, thumbnail: files[0] });
        setPreviewThumbnail(URL.createObjectURL(files[0]));
      } else if (name === "file") {
        setForm({ ...form, file: files[0] });
        setPreviewFileName(files[0].name);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ============ SUBMIT UPDATE ============
  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      // chỉ gửi field khác gốc hoặc file mới
      if (form.title !== original.title) payload.append("title", form.title);
      if (Number(form.price) !== Number(original.price))
        payload.append("price", Number(form.price));
      if (form.description !== original.description)
        payload.append("description", form.description);
      if (form.thumbnail) payload.append("thumbnail", form.thumbnail);
      if (form.file) payload.append("file", form.file);

      if (payload.keys().next().done) {
        alert("Bạn chưa thay đổi gì cả");
        return;
      }

      await api.patch(`/product/update/${productId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Cập nhật thành công!");
      navigate(`/admin/categories/${categoryId}/products`);
    } catch (e) {
      alert(e.response?.data?.result || e.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    }
  };

  // ============ CANCEL ============
  const handleCancel = () => {
    navigate(`/admin/categories/${categoryId}/products/${productId}`);
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Chỉnh sửa sản phẩm
      </Typography>

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

      {/* Thumbnail */}
      <Box sx={{ mb: 2 }}>
        {previewThumbnail && (
          <img
            src={previewThumbnail}
            alt="Thumbnail"
            style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 8 }}
          />
        )}
        <input type="file" name="thumbnail" onChange={handleChange} />
      </Box>

      {/* File */}
      <Box sx={{ mb: 2 }}>
        {previewFileName && <Typography>File hiện tại: {previewFileName}</Typography>}
        <input type="file" name="file" onChange={handleChange} />
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
