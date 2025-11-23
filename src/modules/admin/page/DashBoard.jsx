import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import api from "../../../services/api";

export default function Dashboard() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await api.get("/admin/getReport");
      setReport(res.data.result);
    };
    fetchReport();
  }, []);

  if (!report) return <Typography>Đang tải...</Typography>;

  return (
    <Box>
      <Typography variant="h5" mb={2}>Báo cáo đơn hàng</Typography>
      <Grid container spacing={2}>
        {["success", "fail"].map((status) => (
          <Grid item key={status} xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{status === "success" ? "Thành công" : "Thất bại"}</Typography>
              <Typography>Hôm nay: {report[status].today}</Typography>
              <Typography>3 ngày: {report[status].threeDays}</Typography>
              <Typography>7 ngày: {report[status].sevenDays}</Typography>
              <Typography>30 ngày: {report[status].thirtyDays}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
