import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
} from "@mui/material";
import api from "../../../../services/api";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState(""); // tên category
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Lấy danh sách sản phẩm
      const resProducts = await api.get(`/product/getAllByCategory/${categoryId}`);
      setProducts(resProducts.data.result || []);

      // Lấy tên category từ API
      const resCategory = await api.get(`/category/getById/${categoryId}`);
      setCategoryName(resCategory.data.result?.title || ""); // lấy đúng tên
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Sản phẩm của loại: {categoryName}
      </Typography>

      <Box mb={2}>
        <Button
          component={Link}
          to={`/admin/categories/${categoryId}/products/add`}
          variant="contained"
          sx={{ mr: 1 }}
        >
          Thêm sản phẩm
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/categories`, { replace: true })}
        >
          Quay lại
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p._id}</TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.price.toLocaleString()} VND</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  to={`/admin/categories/${categoryId}/products/${p._id}`}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Xem
                </Button>
                <Button
                  component={Link}
                  to={`/admin/categories/${categoryId}/products/${p._id}/edit`}
                  size="small"
                  variant="contained"
                  sx={{ mr: 1 }}
                >
                  Sửa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
