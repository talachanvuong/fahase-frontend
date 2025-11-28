// src/modules/admin/page/orders/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Modal,
} from "@mui/material";
import api from "../../../../services/api";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state cho modal PDF
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/order/getDetailByAdmin/${id}`);

        if (res.data.status === 200) {
          setOrder(res.data.result);
        } else {
          setError(res.data.result || "Không thể lấy chi tiết đơn hàng");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.result || err.message || "Lỗi server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

  if (!order)
    return <Typography sx={{ mt: 2 }}>Không tìm thấy đơn hàng</Typography>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Chi tiết đơn hàng #{order._id}
      </Typography>

      <Typography>
        <strong>Khách hàng:</strong>{" "}
        {order.user?.display_name || order.user?.email || "Unknown"}
      </Typography>
      <Typography>
        <strong>Trạng thái:</strong> {order.state}
      </Typography>
      <Typography>
        <strong>Ngày tạo:</strong> {order.created_at}
      </Typography>

      <Typography variant="h6" mt={3} mb={1}>
        Sản phẩm
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Giá</TableCell>
            <TableCell>File</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.orderItems.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                )}
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {item.price
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)
                  : "-"}
              </TableCell>
              <TableCell>
                {item.file ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setPdfUrl(item.file);
                      setPdfOpen(true);
                    }}
                  >
                    Xem PDF
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal PDF Viewer */}
      <Modal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            height: "90%",
            bgcolor: "white",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 24,
          }}
        >
          <iframe
            src={pdfUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="PDF Viewer"
          />
        </Box>
      </Modal>

      <Box mt={2}>
        <Button component={Link} to="/admin/orders" variant="contained">
          Quay lại danh sách
        </Button>
      </Box>
    </Box>
  );
}
