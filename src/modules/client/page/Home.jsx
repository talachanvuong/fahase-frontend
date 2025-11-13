import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Pagination,
  Stack,
  Container, // (Mới) Giới hạn chiều rộng và căn giữa
  Tabs,        // (Mới) Thay cho Chip
  Tab,         // (Mới)
  Skeleton,    // (Mới) Để tạo hiệu ứng loading
  Card,
  CardContent,
  CardActions,
  useTheme
} from "@mui/material";
import ProductCard from "../../../components/ProductCard";
import api from "../../../services/api";

// (MỚI) Component Skeleton cho ProductCard
// Nó mô phỏng lại ProductCard đã refactor ở bước trước
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
  const pageSize = 12; // (Thay đổi) Thường là 12 (3x4) hoặc 16 (4x4)
  const [total, setTotal] = useState(0);
  const categoriesLoaded = useRef(false);

  // Load categories (Giữ nguyên)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await api.get("/category/getAll");
        const cats = catRes.data?.result || [];
        setCategories(cats);
        // Tự động chọn tab đầu tiên khi tải xong
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
  }, []); // Chỉ chạy 1 lần khi component mount

  // Load products (Giữ nguyên logic)
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
        // API returns { status, result: [...items] } or { status, result: { items, total } }
        const result = prodRes.data?.result || [];
        if (Array.isArray(result)) {
          // If result is array directly
          setProducts(result);
          setTotal(result.length || 0);
        } else {
          // If result is object with items and total
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
  }, [selectedCategory, page, pageSize]); // Thêm pageSize vào dependency

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // (MỚI) Hàm render trạng thái loading
  const renderLoading = () => (
    <Grid container spacing={2.5}>
      {Array.from({ length: pageSize }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );

  // (MỚI) Hàm render trạng thái rỗng
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

  // (MỚI) Hàm render danh sách sản phẩm
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
    // (MỚI) Dùng Container để căn chỉnh
    <Container maxWidth="xl" sx={{ py: 3, display: "flex", gap: 3 }}>
      
      {/* (MỚI) Box nội dung chính linh hoạt */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Thể loại
        </Typography>

        {/* (MỚI) Dùng Tabs thay cho Chip */}
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

        {/* (MỚI) Logic render theo trạng thái */}
        { (loading && products.length === 0) ? renderLoading()  // Chỉ Skeletons khi tải lần đầu
          : (!loading && products.length === 0) ? renderEmpty() // Trạng thái rỗng
          : renderProductList() // Hiển thị danh sách
        }
        
        {/* Hiển thị loading overlay mờ khi chuyển trang (tùy chọn) 
          Phần này hơi nâng cao, nhưng làm UX tăng vọt
        */}
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