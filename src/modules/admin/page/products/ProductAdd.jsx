import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import api from "../../../../services/api";

export default function ProductAdd() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !price) return alert("Tên và giá là bắt buộc!");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (file) formData.append("file", file);

    try {
      setLoading(true);
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm sản phẩm thành công!");
      setName("");
      setPrice("");
      setDescription("");
      setThumbnail(null);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Thêm sản phẩm</Typography>
      <TextField
        label="Tên sản phẩm"
        fullWidth
        sx={{ mb: 2 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Giá"
        fullWidth
        sx={{ mb: 2 }}
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <TextField
        label="Mô tả"
        fullWidth
        sx={{ mb: 2 }}
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />
      <br />
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: 20 }}
      />
      <br />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu"}
      </Button>
    </Box>
  );
}
