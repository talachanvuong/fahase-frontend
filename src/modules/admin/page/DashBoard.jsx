import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import api from "../../../services/api";

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/getReport");
        if (res.data.status === 200) {
          setReport(res.data.result);
        } else {
          setError(res.data.result || "Không thể lấy dữ liệu");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.result || "Lỗi server");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );
  if (!report)
    return (
      <Typography textAlign="center" mt={4}>
        Không có dữ liệu
      </Typography>
    );

  const renderCard = (title, data, color = "primary") => (
    <Card
      sx={{
        borderLeft: `6px solid ${color === "primary" ? "#1976d2" : "#d32f2f"}`,
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Typography variant="subtitle1">Hôm nay: {data.today}</Typography>
        <Typography variant="subtitle1">3 ngày: {data.threeDays}</Typography>
        <Typography variant="subtitle1">7 ngày: {data.sevenDays}</Typography>
        <Typography variant="subtitle1">30 ngày: {data.thirtyDays}</Typography>

        {data.revenue && (
          <Typography
            variant="subtitle2"
            sx={{ mt: 1, fontWeight: "bold", color: "#2e7d32" }}
          >
            Doanh thu: {data.revenue.toLocaleString("vi-VN")} đ
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Dashboard Báo cáo đơn hàng
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderCard("Thành công", report.success, "primary")}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderCard("Thất bại", report.fail, "error")}
        </Grid>
      </Grid>
    </Box>
  );
}
