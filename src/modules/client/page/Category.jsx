import React, { useEffect, useState } from "react";
import {
  Box, Grid, Card, CardContent, Typography, Button, Container, Pagination, Stack, useTheme, Skeleton, CardActions, CircularProgress
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../../../components/ProductCard";
import api from "../../../services/api";

const ProductCardSkeleton = () => {
  const theme = useTheme();
  return (
    <Card sx={{ height: '100%', border: `1px solid ${theme.palette.divider}`, borderRadius: 3 }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '1/1' }} />
      <CardContent>
        <Skeleton height={28} width="90%" />
        <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
        <Skeleton height={24} width="40%" sx={{ mt: 2 }} />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rounded" height={40} width="100%" />
      </CardActions>
    </Card>
  );
};

export default function Category() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin category
        if (categoryId) {
          const catRes = await api.get(`/category/getById/${categoryId}`);
          if (catRes.data?.result) {
            setCategoryName(catRes.data.result.name);
          }
        }

        // Lấy danh sách sản phẩm theo category
        const prodRes = await api.get(
          `/product/getByCategory/${categoryId}?page=${page}&limit=${pageSize}`
        );
        
        if (prodRes.data?.result) {
          setProducts(prodRes.data.result);
          setTotal(prodRes.data.total || 0);
        }
      } catch (err) {
        console.error("Error loading category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadCategoryProducts();
    }
  }, [categoryId, page]);

  const handlePageChange = (e, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          📚 {categoryName || "Danh mục"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Khám phá những cuốn sách hay trong danh mục này
        </Typography>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(pageSize)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            Không có sản phẩm nào trong danh mục này
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Quay lại trang chủ
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {total > pageSize && (
            <Stack sx={{ display: 'flex', alignItems: 'center', py: 4 }}>
              <Pagination
                count={Math.ceil(total / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
