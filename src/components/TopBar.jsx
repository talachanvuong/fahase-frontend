import React from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Badge } from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import { useCart } from "../hook/useCart";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const uniqueCount = cartItems.length;

  return (
    <AppBar position="static" sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          FAHASE
        </Typography>

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

        <IconButton color="primary" onClick={() => navigate("/cart")}> 
          <Badge badgeContent={uniqueCount} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}