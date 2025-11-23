// OrderList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import api from "../../../../services/api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/order/getAllByUser");
      setOrders(res.data.result || []);
    };
    fetchOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h5" mb={2}>Danh sách đơn hàng</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Button component={Link} to={`${order._id}`} variant="contained" size="small">Xem</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
