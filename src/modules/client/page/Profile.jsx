import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Skeleton
} from "@mui/material";
import {
  Person,
  Receipt,
  ShoppingBag,
  Email,
  AccountCircle
} from "@mui/icons-material";
import { useAuth } from "../../../hook/useAuth";
import api from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

// ============ TAB 1: THÔNG TIN USER ============
const UserInfoTab = ({ user }) => (
  <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
    <Stack spacing={4} alignItems="center">
      {/* Avatar lớn */}
      <Avatar
        src={user.photo_url}
        alt={user.display_name}
        sx={{ width: 140, height: 140, boxShadow: 3 }}
      />
      
      {/* Tên và Email */}
      <Box textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {user.display_name}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={1} 
          justifyContent="center" 
          alignItems="center" 
          sx={{ mt: 1 }}
        >
          <Email fontSize="small" color="action" />
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ width: '100%' }} />

      {/* Thông tin chi tiết */}
      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          📋 Thông tin tài khoản
        </Typography>
        
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary={
                <Typography variant="body2" color="text.secondary">
                  ID tài khoản
                </Typography>
              }
              secondary={
                <Typography 
                  variant="body1" 
                  fontWeight="medium" 
                  sx={{ wordBreak: 'break-all', mt: 0.5 }}
                >
                  {user._id}
                </Typography>
              }
            />
          </ListItem>
          
          <Divider />
          
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary={
                <Typography variant="body2" color="text.secondary">
                  Loại tài khoản
                </Typography>
              }
              secondary={
                <Chip 
                  icon={<AccountCircle />}
                  label="Google Account" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 0.5 }}
                />
              }
            />
          </ListItem>
          
          <Divider />
          
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
              primary={
                <Typography variant="body2" color="text.secondary">
                  Trạng thái
                </Typography>
              }
              secondary={
                <Chip 
                  label="Hoạt động" 
                  color="success" 
                  size="small" 
                  sx={{ mt: 0.5 }}
                />
              }
            />
          </ListItem>
        </List>
      </Box>
    </Stack>
  </Paper>
);

// ============ TAB 2: ĐƠN HÀNG ============
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get("/order/getAllByUser");
        if (res.data.status === 200) {
          setOrders(res.data.result || []);
        }
      } catch (error) {
        console.error("Load orders error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "warning",
      completed: "success",
      cancelled: "error",
      processing: "info"
    };
    return statusMap[status] || "default";
  };

  const getStatusText = (status) => {
    const textMap = {
      pending: "Chờ xử lý",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      processing: "Đang xử lý"
    };
    return textMap[status] || "Không rõ";
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Skeleton height={60} />
              <Skeleton height={40} sx={{ mt: 2 }} />
              <Skeleton height={40} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  if (orders.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Chưa có đơn hàng nào
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Hãy mua sắm ngay để trải nghiệm dịch vụ tuyệt vời!
        </Typography>
        <Button variant="contained" href="/">
          Khám phá sản phẩm
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <Card key={order._id} variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            {/* Header: Mã đơn + Trạng thái */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mã đơn hàng
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  #{order._id.slice(-8).toUpperCase()}
                </Typography>
              </Box>
              <Chip 
                label={getStatusText(order.status)} 
                color={getStatusColor(order.status)}
                size="medium"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Thông tin đơn hàng */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📅 Ngày đặt
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  💰 Tổng tiền
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {order.total?.toLocaleString()} ₫
                </Typography>
              </Grid>
            </Grid>

            {/* Danh sách sản phẩm */}
            {order.items && order.items.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  📦 Sản phẩm ({order.items.length})
                </Typography>
                {order.items.slice(0, 3).map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mt: 0.5 }}>
                    • {item.title || item.product_name}
                  </Typography>
                ))}
                {order.items.length > 3 && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    ... và {order.items.length - 3} sản phẩm khác
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

// ============ TAB 3: SẢN PHẨM ĐÃ MUA ============
const PurchasedProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPurchasedProducts = async () => {
      try {
        const res = await api.get("/bought/isBought/");
        if (res.data.status === 200) {
          setProducts(res.data.result || []);
        }
      } catch (error) {
        console.error("Load purchased products error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPurchasedProducts();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card>
              <Skeleton variant="rectangular" sx={{ aspectRatio: '1/1' }} />
              <CardContent>
                <Skeleton height={30} />
                <Skeleton height={20} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
        <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Chưa mua sản phẩm nào
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Khám phá cửa hàng và tìm những sản phẩm yêu thích của bạn!
        </Typography>
        <Button variant="contained" href="/">
          Mua sắm ngay
        </Button>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': { 
                boxShadow: 6,
                transform: 'translateY(-4px)'
              } 
            }}
            onClick={() => navigate(`/product/getById/${product._id}`)}
          >
            <Box
              component="img"
              src={product.thumbnail}
              alt={product.title}
              sx={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                objectFit: 'cover',
                bgcolor: 'grey.100'
              }}
            />
            <CardContent>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  minHeight: 48
                }}
              >
                {product.title}
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mt: 1 }}>
                {product.price?.toLocaleString()} ₫
              </Typography>
              {product.purchasedAt && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  🛒 Mua ngày {new Date(product.purchasedAt).toLocaleDateString('vi-VN')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// ============ MAIN PROFILE COMPONENT ============
export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/profile?tab=${newValue}`, { replace: true });
  };

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Person sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Vui lòng đăng nhập
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Bạn cần đăng nhập để xem thông tin cá nhân
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/login")}>
          Đăng nhập ngay
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          👤 Trang cá nhân
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý thông tin, đơn hàng và sản phẩm của bạn
        </Typography>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 2, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 600
            }
          }}
        >
          <Tab 
            icon={<Person />} 
            iconPosition="start" 
            label="Thông tin" 
            value="info" 
          />
          <Tab 
            icon={<Receipt />} 
            iconPosition="start" 
            label="Đơn hàng" 
            value="orders" 
          />
          <Tab 
            icon={<ShoppingBag />} 
            iconPosition="start" 
            label="Đã mua" 
            value="purchased" 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === "info" && <UserInfoTab user={user} />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "purchased" && <PurchasedProductsTab />}
      </Box>
    </Container>
  );
}