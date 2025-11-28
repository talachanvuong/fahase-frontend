import React, { useEffect, useState, useRef } from "react";
import {Box, Grid, Typography, Pagination, Stack, Container, Tabs, Tab, Skeleton, Card, CardContent, CardActions, useTheme, IconButton, Drawer, Paper, Divider, Chip } from "@mui/material";
import { Menu, Close, LocalOffer, TrendingUp, Favorite, CardGiftcard, AcUnit } from "@mui/icons-material";
import ProductCard from "../../../components/ProductCard";
import api from "../../../services/api";

// Component hiệu ứng tuyết rơi
const SnowEffect = () => (
  <Box sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden'
  }}>
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          top: '-10px',
          left: `${Math.random() * 100}%`,
          color: 'white',
          fontSize: `${Math.random() * 10 + 10}px`,
          opacity: 0.7,
          animation: `snowfall ${Math.random() * 3 + 2}s linear infinite`,
          animationDelay: `${Math.random() * 2}s`,
          '@keyframes snowfall': {
            '0%': {
              transform: 'translateY(0) rotate(0deg)',
              opacity: 0.7
            },
            '100%': {
              transform: `translateY(100vh) rotate(360deg)`,
              opacity: 0
            }
          }
        }}
      >
        ❄️
      </Box>
    ))}
  </Box>
);

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

// Banner trang trí Noel
const PromoBanner = () => (
  <Paper 
    elevation={0}
    sx={{ 
      p: 3, 
      mb: 3, 
      borderRadius: 3,
      background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 50%, #388e3c 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ 
      position: 'absolute', 
      top: 10, 
      right: 10, 
      fontSize: 40,
      animation: 'float 3s ease-in-out infinite',
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' }
      }
    }}>
      🎅
    </Box>
    <Stack direction="row" spacing={2} alignItems="center">
      <CardGiftcard sx={{ fontSize: 40 }} />
      <Box>
        <Typography variant="h6" fontWeight="bold">
          🎄Chào mừng ngày lễ Noel 🎁
        </Typography>
        <Typography variant="body2">
          Hãy mua ngay cho bản thân 1 cuốn sách để nhâm nhi trong cái lạnh của lễ giáng sinh Sài Gòn nào ⛄
        </Typography>
      </Box>
    </Stack>
  </Paper>
);


// Footer Component với theme Noel
const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      bgcolor: '#1a472a', 
      color: 'white', 
      py: 4, 
      mt: 6,
      position: 'relative',
      '&::before': {
        content: '"🎄"',
        position: 'absolute',
        top: 20,
        right: 50,
        fontSize: 60,
        opacity: 0.2
      }
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🎅 FAHASE
          </Typography>
          <Typography variant="body2" color="grey.300">
            Nền tảng mua bán ebook duy nhất tại VAA.
          </Typography>
          <Typography variant="body2" color="grey.300" sx={{ mt: 1 }}>
            🎁 Chúc bạn mùa Giáng Sinh an lành! ⛄
          </Typography>
        </Grid>
        
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Về chúng tôi
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="grey.300" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
              Giới thiệu: Đây là sản phẩm của nhóm 01
            </Typography>
            <Typography variant="body2" color="grey.300" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>
              Liên hệ: Không nhận liên hệ 
            </Typography>
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Kết nối với chúng tôi
          </Typography>
          <Typography variant="body2" color="grey.300" gutterBottom>
            📧 Email: nhom1fahase@gmail.com
          </Typography>
          <Typography variant="body2" color="grey.300">
            📞 Hotline: xxx xxx xxxx
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      <Typography variant="body2" color="grey.400" textAlign="center">
        © FAHASE. 🎄 Merry Christmas! 🎅
      </Typography>
    </Container>
  </Box>
);

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageSize = 12;
  const [total, setTotal] = useState(0);
  const categoriesLoaded = useRef(false);

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

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          🎄 Thể loại
        </Typography>
        <IconButton onClick={() => setSidebarOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Stack spacing={1}>
        {categories.map((c) => (
          <Paper
            key={c._id}
            elevation={selectedCategory === c._id ? 2 : 0}
            sx={{
              p: 1.5,
              cursor: 'pointer',
              bgcolor: selectedCategory === c._id ? 'primary.light' : 'transparent',
              color: selectedCategory === c._id ? 'white' : 'text.primary',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: selectedCategory === c._id ? 'primary.light' : 'grey.100',
              }
            }}
            onClick={() => {
              setSelectedCategory(c._id);
              setPage(1);
              setSidebarOpen(false);
            }}
          >
            <Typography variant="body1" fontWeight={selectedCategory === c._id ? 'bold' : 'regular'}>
              {c.title}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      {/* Hiệu ứng tuyết rơi */}
      <SnowEffect />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Banner khuyến mãi */}
        <PromoBanner />

        {/* Header với nút menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton 
            color="primary" 
            onClick={() => setSidebarOpen(true)}
            sx={{ 
              border: 1, 
              borderColor: 'primary.main',
              '&:hover': { bgcolor: 'primary.light', color: 'white' }
            }}
          >
            <Menu />
          </IconButton>
          
          <Typography variant="h5" fontWeight="bold">
            🎁 Sản phẩm nổi bật
          </Typography>
          
          {selectedCategory && (
            <Chip 
              label={categories.find(c => c._id === selectedCategory)?.title || ''} 
              color="primary" 
              onDelete={() => {}}
              deleteIcon={<></>}
            />
          )}
        </Box>

        {/* Tabs danh mục (hiển thị trên desktop) */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, display: { xs: 'none', md: 'block' } }}>
          <Tabs
            value={selectedCategory || false}
            onChange={(e, newValue) => { setSelectedCategory(newValue); setPage(1); }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {categories.map((c) => (
              <Tab key={c._id} label={c.title} value={c._id} />
            ))}
          </Tabs>
        </Box>

        {/* Products */}
        {(loading && products.length === 0) ? renderLoading()
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
      </Container>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        {sidebarContent}
      </Drawer>

      {/* Footer */}
      <Footer />
    </>
  );
}