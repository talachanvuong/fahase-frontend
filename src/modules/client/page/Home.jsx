import React, { useEffect, useState, useRef } from "react";
import {Box, Grid, Typography, Pagination, Stack, Container, Tabs, Tab, Skeleton, Card, CardContent, CardActions, useTheme } from "@mui/material";
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

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 12; 
  const [total, setTotal] = useState(0);
  const categoriesLoaded = useRef(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await api.get("/category/getAll");
        const cats = catRes.data?.result || [];
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0]._id);
        }
      } catch {
        setCategories([]);
      }
    };
    
    if (!categoriesLoaded.current) {
      loadCategories();
      categoriesLoaded.current = true;
    }
  }, []); 

  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedCategory) {
        setProducts([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const prodRes = await api.get(`/product/getAllByCategory/${selectedCategory}`, {
          params: { page, limit: pageSize },
        });

        const result = prodRes.data?.result || [];
        if (Array.isArray(result)) {
          setProducts(result);
          setTotal(result.length || 0);
        } else {
          setProducts(result.items || []);
          setTotal(result.total || 0);
        }
      } catch {
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, page, pageSize]); 

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const renderLoading = () => (
    <Grid container spacing={2.5}>
      {Array.from({ length: pageSize }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );

  const renderEmpty = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      bgcolor: 'grey.50',
      borderRadius: 2,
      minHeight: '300px'
    }}>
      <Typography variant="h6" gutterBottom>Không tìm thấy sản phẩm</Typography>
      <Typography color="text.secondary">Vui lòng thử chọn danh mục khác nhé.</Typography>
    </Box>
  );

  const renderProductList = () => (
    <>
      <Grid container spacing={2.5}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p._id || p.id}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            color="primary"
          />
        </Stack>
      )}
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3, display: "flex", gap: 3 }}>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Thể loại
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedCategory || false} // Xử lý trường hợp selectedCategory=null
            onChange={(e, newValue) => { setSelectedCategory(newValue); setPage(1); }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Danh mục sản phẩm"
          >
            {categories.map((c) => (
              <Tab key={c._id} label={c.title} value={c._id} />
            ))}
          </Tabs>
        </Box>

        { (loading && products.length === 0) ? renderLoading()  
          : (!loading && products.length === 0) ? renderEmpty() 
          : renderProductList() 
        }
       
        {loading && products.length > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0, left: 0,
            bgcolor: 'rgba(255,255,255,0.5)',
            zIndex: 1,
          }} />
        )}
      </Box>
    </Container>
  );
}