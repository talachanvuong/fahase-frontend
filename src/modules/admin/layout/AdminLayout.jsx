import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";

const menuItems = [
  { label: "Đơn hàng", path: "orders" },
  { label: "Sản phẩm", path: "products" },
  { label: "Loại sản phẩm", path: "categories" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <Box>
      {/* AppBar Menu Ngang */}
      <AppBar position="static">
        <Toolbar>
          {/* Click quay về dashboard */}
          <Typography
            variant="h6"
            component={Link}
            to="/admin/dashboard"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Administrator
          </Typography>

          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={`/admin/${item.path}`} // đường dẫn tuyệt đối
              sx={{
                textDecoration: location.pathname.includes(item.path)
                  ? "underline"
                  : "none",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* Nội dung chính */}
      <Box sx={{ padding: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
