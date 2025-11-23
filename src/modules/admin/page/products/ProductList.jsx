import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import api from "../../../../services/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/product/getAllByAdmin").then(res => setProducts(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <Box>
      <Typography variant="h5" mb={2}>Danh sách sản phẩm</Typography>
      <Button component={Link} to="add" variant="contained" sx={{ mb: 2 }}>Thêm sản phẩm</Button>
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
          {products.map(p => (
            <TableRow key={p._id}>
              <TableCell>{p._id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>
                <Button component={Link} to={`${p._id}`} size="small" variant="outlined" sx={{ mr: 1 }}>Xem</Button>
                <Button component={Link} to={`${p._id}/edit`} size="small" variant="contained">Sửa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
