// OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import api from "../../../../services/api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await api.get(`/order/getDetailByAdmin/${id}`);
      setOrder(res.data.result);
    };
    fetchOrder();
  }, [id]);

  if (!order) return <Typography>Đang tải...</Typography>;

  return (
    <Box>
      <Typography variant="h5">Chi tiết đơn hàng #{order._id}</Typography>
      <Typography mt={2}>Khách: {order.customer_name}</Typography>
      <Typography>Tổng tiền: {order.total}</Typography>
      <Typography>Trạng thái: {order.state}</Typography>
    </Box>
  );
}
