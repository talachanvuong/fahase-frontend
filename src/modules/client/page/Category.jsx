import React from "react";
import {
  Box, Grid, Card, CardContent, Typography, Button
} from "@mui/material";
import { Link } from "react-router-dom";

export default function Category() {
  // 🔹 Dữ liệu tĩnh
  const categories = [
    { id: "1", name: "Frontend", icon: "https://cdn-icons-png.flaticon.com/512/919/919851.png", items: 5 },
    { id: "2", name: "Backend", icon: "https://cdn-icons-png.flaticon.com/512/919/919825.png", items: 7 },
    { id: "3", name: "AI/ML", icon: "https://cdn-icons-png.flaticon.com/512/2920/2920258.png", items: 4 },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Danh mục Ebook
      </Typography>

      <Grid container spacing={3}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={4} key={cat.id}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <img src={cat.icon} alt={cat.name} width={80} height={80} />
              <CardContent>
                <Typography variant="h6">{cat.name}</Typography>
                <Typography color="text.secondary" mb={2}>
                  {cat.items} sản phẩm
                </Typography>
                <Button
                  component={Link}
                  to={`/shop?category=${cat.id}`}
                  variant="outlined"
                  size="small"
                >
                  Xem sản phẩm
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
