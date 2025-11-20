import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  Person,
  Receipt,
  ShoppingBag,
  Logout
} from "@mui/icons-material";
import { useCart } from "../hook/useCart";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const uniqueCount = cartItems.length;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile?tab=info");
  };

  const handleOrders = () => {
    handleMenuClose();
    navigate("/profile?tab=orders");
  };

  const handlePurchased = () => {
    handleMenuClose();
    navigate("/profile?tab=purchased");
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          FAHASE
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f1f1f1",
            borderRadius: 2,
            px: 2,
            width: "50%",
          }}
        >
          <Search sx={{ mr: 1, color: "gray" }} />
          <InputBase fullWidth placeholder="Tìm kiếm sản phẩm..." />
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Shopping Cart */}
          <IconButton color="primary" onClick={() => navigate("/cart")}>
            <Badge badgeContent={uniqueCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* User Avatar / Login Button */}
          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
                <Avatar
                  src={user.photo_url}
                  alt={user.display_name}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    boxShadow: 3,
                    borderRadius: 2
                  }
                }}
              >
                {/* User Info Header */}
                <Box sx={{ px: 2, py: 1.5, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {user.display_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>

                <Divider />

                {/* Menu Items */}
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <Person fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Thông tin cá nhân</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleOrders}>
                  <ListItemIcon>
                    <Receipt fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Đơn hàng của tôi</ListItemText>
                </MenuItem>

                <MenuItem onClick={handlePurchased}>
                  <ListItemIcon>
                    <ShoppingBag fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Sản phẩm đã mua</ListItemText>
                </MenuItem>

                <Divider />

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography color="error">Đăng xuất</Typography>
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton color="primary" onClick={() => navigate("/login")}>
              <Person />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}