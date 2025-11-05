import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Drawer variant="permanent" sx={{ width: 240 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/dashboard">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin/manage-books">
              <ListItemIcon><MenuBookIcon /></ListItemIcon>
              <ListItemText primary="Quản lý sách" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <main style={{ flexGrow: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
