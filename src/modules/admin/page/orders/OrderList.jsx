// src/modules/admin/page/orders/OrderList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/order/getAllByAdmin");

        // Kiểm tra dữ liệu trả về từ BE
        if (res.data.status === 200) {
          setOrders(res.data.result || []);
        } else {
          setError(res.data.result || "Không thể lấy danh sách đơn hàng");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.result || err.message || "Lỗi server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );

  if (orders.length === 0)
    return (
      <Typography sx={{ mt: 2 }}>Chưa có đơn hàng nào</Typography>
    );

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Danh sách đơn hàng
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>
                {order.user?.display_name || order.user?.email || "Unknown"}
              </TableCell>
              <TableCell>{order.state}</TableCell>
              <TableCell>
                <Button
                  component={Link}
                  to={`${order._id}`}
                  variant="contained"
                  size="small"
                >
                  Xem
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
