import React, { useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";

const menuItems = [
  { label: "Quản Lý Đơn hàng", path: "orders" },
  { label: "Quản Lý sản phẩm", path: "categories" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useContext(AuthContext);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/admin/dashboard"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none", cursor: "pointer" }}
          >
            FAHASE ADMIN
          </Typography>

          {menuItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={`/admin/${item.path}`}
              sx={{ textDecoration: location.pathname.includes(item.path) ? "underline" : "none" }}
            >
              {item.label}
            </Button>
          ))}

          {admin && (
            <Button onClick={handleLogout} sx={{ ml: 2, color: "red" }}>
              Đăng xuất
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
