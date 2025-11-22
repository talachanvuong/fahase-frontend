// import React from "react";
// import { useLocation, Link } from "react-router-dom";
// import {
//   Grid, Card, CardMedia, CardContent, Typography, Button, Box
// } from "@mui/material";

// export default function Shop() {
//   // 🔹 Dữ liệu sản phẩm tĩnh
//   const products = [
//     { id: "101", name: "React Mastery", price: 180000, category: "1", image: "https://picsum.photos/400?1", description: "Khóa học ReactJS nâng cao" },
//     { id: "102", name: "NodeJS Express", price: 150000, category: "2", image: "https://picsum.photos/400?2", description: "Lập trình server với NodeJS" },
//     { id: "103", name: "Machine Learning 101", price: 200000, category: "3", image: "https://picsum.photos/400?3", description: "Giới thiệu cơ bản về AI/ML" },
//     { id: "104", name: "HTML & CSS Basics", price: 120000, category: "1", image: "https://picsum.photos/400?4", description: "Xây dựng giao diện web cơ bản" },
//   ];

//   // 🔹 Lấy query param category
//   const { search } = useLocation();
//   const params = new URLSearchParams(search);
//   const category = params.get("category");

//   // 🔹 Lọc sản phẩm nếu có category
//   const filtered = category
//     ? products.filter((p) => p.category === category)
//     : products;

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h5" fontWeight="bold" mb={3}>
//         {category ? "Sản phẩm theo loại" : "Danh sách Ebook"}
//       </Typography>

//       <Grid container spacing={3}>
//         {filtered.map((p) => (
//           <Grid item xs={12} sm={6} md={4} key={p.id}>
//             <Card>
//               <CardMedia component="img" height="200" image={p.image} alt={p.name} />
//               <CardContent>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {p.name}
//                 </Typography>
//                 <Typography color="success.main">
//                   {p.price.toLocaleString()} ₫
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" mb={1}>
//                   {p.description.slice(0, 40)}...
//                 </Typography>
//                 <Button
//                   component={Link}
//                   to={`/ebook/${p.id}`}
//                   fullWidth
//                   variant="outlined"
//                 >
//                   Xem chi tiết
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
