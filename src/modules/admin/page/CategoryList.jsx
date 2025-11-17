import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import api from "../../../services/api";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data)).catch(err => console.error(err));
  }, []);

  const handleAdd = () => {
    const name = prompt("Tên loại mới:");
    if (!name) return;
    api.post("/categories", { name }).then(res => setCategories(prev => [...prev, res.data]));
  };

  const handleDelete = (id) => {
    if (!confirm("Xóa loại sản phẩm này?")) return;
    api.delete(`/categories/${id}`).then(() => setCategories(prev => prev.filter(c => c._id !== id)));
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Danh sách loại sản phẩm</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>Thêm loại</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên loại</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map(cat => (
            <TableRow key={cat._id}>
              <TableCell>{cat._id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDelete(cat._id)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
