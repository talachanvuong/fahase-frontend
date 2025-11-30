import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../../../../services/api";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Lấy danh sách category
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getAll");
      setCategories(res.data.result || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi server khi lấy danh sách");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getErrorMessage = (err) => {
    const data = err?.response?.data;
    return (
      data?.message ||
      data?.error ||
      data?.errors?.[0] ||
      "Lỗi server xảy ra"
    );
  };

  // Thêm category
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await api.post("/category/add", { title: newTitle });

      await fetchCategories();
      setNewTitle("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(getErrorMessage(err));
    }
  };

  // Xóa category
  const handleDelete = async (id) => {
    if (!confirm("Xóa loại sản phẩm này?")) return;

    try {
      await api.delete(`/category/remove/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert(getErrorMessage(err));
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Danh sách loại sản phẩm
      </Typography>

      {/* Nút thêm */}
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        Thêm loại
      </Button>

      {/* Form thêm category */}
      {showAddForm && (
        <Box
          component="form"
          onSubmit={handleAddSubmit}
          sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}
        >
          <TextField
            label="Tên loại mới"
            variant="outlined"
            size="small"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">
            Thêm
          </Button>
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên loại</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>{cat._id}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  to={`/admin/categories/${cat._id}/products`}
                  variant="text"
                >
                  {cat.title}
                </Button>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Xóa
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
