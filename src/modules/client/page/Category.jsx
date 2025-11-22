import React from "react";
import {
  Box, Grid, Card, CardContent, Typography, Button
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Category() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Danh mục Ebook
      </Typography>
    </Box>
  );
}
