import React, { useState, } from "react";
import {
  AppBar, Toolbar, Typography, Box, InputBase, IconButton,
  Badge, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider,
  Paper, List, ListItem, ListItemButton
} from "@mui/material";
import {
  ShoppingCart, Search, Person, Receipt, Logout
} from "@mui/icons-material";

import { useCart } from "../hook/useCart";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Topbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, logoutUser } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  const uniqueCount = cartItems.length;
  const open = Boolean(anchorEl);

  const handleSearchEnter = async (e) => {
    if (e.key !== "Enter") return;

    if (!searchKeyword.trim()) {
      setSuggestions([]);
      setShowSuggest(false);
      return;
    }

    try {
      const res = await api.get(`/product/find?keyword=${encodeURIComponent(searchKeyword.trim())}`);

      if (res.data.status === 200) {
        setSuggestions(res.data.result);
        setShowSuggest(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
      setShowSuggest(true);
    }
  };

  // === CLICK ITEM SEARCH ===
  const handleSelectProduct = (id) => {
    setShowSuggest(false);
    setSearchKeyword("");
    navigate(`/ebook/${id}`);
  };

  // === LOGOUT HANDLER ===
  const handleLogout = () => {
    setAnchorEl(null);
    logoutUser();
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
        
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
        <Box sx={{ position: "relative", width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#f1f1f1",
              borderRadius: 2,
              px: 2,
            }}
          >
            <Search sx={{ mr: 1, color: "gray" }} />
            <InputBase
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setShowSuggest(false); 
              }}
              onKeyDown={handleSearchEnter}
            />
          </Box>

          {/* 🔥 SEARCH DROPDOWN */}
          {showSuggest && (
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: 45,
                width: "100%",
                zIndex: 99,
                maxHeight: 300,
                overflowY: "auto",
                borderRadius: 2,
              }}
            >
              {suggestions.length > 0 ? (
                <List>
                  {suggestions.map((item) => (
                    <ListItem disablePadding key={item._id}>
                      <ListItemButton onClick={() => handleSelectProduct(item._id)}>
                        <ListItemText
                          primary={item.title}
                          secondary={`${item.price.toLocaleString()} ₫`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>
                  Không có kết quả
                </Box>
              )}
            </Paper>
          )}
        </Box>

        {/* RIGHT ZONE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="primary" onClick={() => navigate("/cart")}>
            <Badge badgeContent={uniqueCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar src={user.photo_url} alt={user.display_name} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { minWidth: 220, borderRadius: 2 } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography fontWeight="bold">{user.display_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />

                <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile?tab=info"); }}>
                  <ListItemIcon><Person /></ListItemIcon>
                  <ListItemText>Thông tin cá nhân</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile?tab=orders"); }}>
                  <ListItemIcon><Receipt /></ListItemIcon>
                  <ListItemText>Đơn hàng</ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><Logout color="error" /></ListItemIcon>
                  <ListItemText><Typography color="error">Đăng xuất</Typography></ListItemText>
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