import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
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
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await api.get(`/category/getById/${categoryId}`);
        setCategoryName(data.result?.title || "");
      } catch {
        setErrors({ general: "Lỗi khi lấy thông tin loại sản phẩm" });
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "thumbnail") {
        setForm(f => ({ ...f, thumbnail: file }));
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else if (name === "file") {
        setForm(f => ({ ...f, file }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    setErrors({});
    setSuccess("");
    if (!form.thumbnail || !form.file) {
      setErrors({ 
        thumbnail: !form.thumbnail && "Thiếu thumbnail", 
        file: !form.file && "Thiếu file" 
      });
      return;
    }

    setLoading(true);
    try {
      const thumbnailBase64 = await fileToBase64(form.thumbnail);
      const fileBase64 = await fileToBase64(form.file);

      const body = {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        category: categoryId,
        thumbnail: thumbnailBase64,
        file: fileBase64,
      };

      const res = await api.post("/product/add", body);

      if (res.status === 201) {
        // Hiển thị thông báo thành công
        setSuccess("Thêm sản phẩm thành công!");
        setForm({ title: "", price: "", description: "", thumbnail: null, file: null });
        setPreview(null);

        // Tự điều hướng sau 1.5 giây
        setTimeout(() => {
          navigate(`/admin/categories/${categoryId}/products`, { replace: true });
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      const newErrors = {};

      if (Array.isArray(msg)) {
        msg.forEach(m => {
          if (m.field) newErrors[m.field] = m.message;
          else newErrors.general = m.message;
        });
      } else if (typeof msg === "string") {
        const lower = msg.toLowerCase();
        if (lower.includes("title")) newErrors.title = msg;
        else if (lower.includes("price")) newErrors.price = msg;
        else if (lower.includes("description")) newErrors.description = msg;
        else if (lower.includes("thumbnail")) newErrors.thumbnail = msg;
        else if (lower.includes("file")) newErrors.file = msg;
        else newErrors.general = msg;
      } else {
        newErrors.general = "Vui lòng nhập thông tin sản phẩm hợp lệ";
      }

      setErrors(newErrors);
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

      {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        fullWidth
        label="Tên sản phẩm"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Giá"
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        error={!!errors.price}
        helperText={errors.price}
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
        error={!!errors.description}
        helperText={errors.description}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label" sx={{ mr: 1 }}>
          Chọn Thumbnail
          <input type="file" hidden name="thumbnail" onChange={handleChange} accept="image/*" />
        </Button>
        {preview && <img src={preview} alt="Thumbnail" style={{ width: 60, height: 60, objectFit: "cover" }} />}
        {errors.thumbnail && <Typography color="error">{errors.thumbnail}</Typography>}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" component="label">
          Chọn File
          <input type="file" hidden name="file" onChange={handleChange} />
        </Button>
        {form.file && <Typography sx={{ mt: 1 }}>{form.file.name}</Typography>}
        {errors.file && <Typography color="error">{errors.file}</Typography>}
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
