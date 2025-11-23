import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import api from "../../../../services/api";

export default function ProductAdd() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState(""); 
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    thumbnail: null,
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy tên category khi mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/category/getById/${categoryId}`);
        setCategoryName(res.data.result?.title || "");
      } catch {
        alert("Lỗi khi lấy thông tin loại sản phẩm");
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "thumbnail") {
        setForm((f) => ({ ...f, thumbnail: file }));
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (name === "file") {
        setForm((f) => ({ ...f, file }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.description || !form.thumbnail || !form.file) {
      alert("Vui lòng điền đầy đủ thông tin và chọn file");
      return;
    }

    setLoading(true);

    try {
      const thumbnailBase64 = await fileToBase64(form.thumbnail);
      const fileBase64 = await fileToBase64(form.file);

      await api.post("/product/add", {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        category: categoryId,
        thumbnail: thumbnailBase64,
        file: fileBase64,
      });

      alert("Thêm sản phẩm thành công!");
      navigate(`/admin/categories/${categoryId}/products`, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Thêm sản phẩm mới cho loại: {categoryName}
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

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label" sx={{ mr: 1 }}>
          Chọn Thumbnail
          <input type="file" hidden name="thumbnail" onChange={handleChange} accept="image/*" />
        </Button>
        {preview && <img src={preview} alt="Thumbnail" style={{ width: 60, height: 60, objectFit: "cover" }} />}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label">
          Chọn File
          <input type="file" hidden name="file" onChange={handleChange} />
        </Button>
        {form.file && <Typography sx={{ mt: 1 }}>{form.file.name}</Typography>}
      </Box>

      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Thêm sản phẩm
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate(`/admin/categories/${categoryId}/products`, { replace: true })}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
