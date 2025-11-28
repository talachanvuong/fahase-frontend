import React, { useState, useEffect } from "react";
import {Container, Box, Avatar, Typography, Tabs, Tab, Card, CardContent, Grid, Chip, Divider, Stack, Paper, List, ListItem, ListItemText, Button, Skeleton} from "@mui/material";
import {Person, Receipt, Email, AccountCircle} from "@mui/icons-material";
import { useAuth } from "../../../hook/useAuth";
import api from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";

// ============ THÔNG TIN USER ============
const UserInfoTab = ({ user }) => (
  <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
    <Stack spacing={4} alignItems="center">
      <Avatar
        src={user.photo_url}
        alt={user.display_name}
        sx={{ width: 140, height: 140, boxShadow: 3 }}
      />
      
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

      <Box sx={{ width: '100%', maxWidth: 500 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
           Thông tin tài khoản
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

// ============ ĐƠN HÀNG ============
const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const loadOrderDetail = async (orderId) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/order/getDetail/${orderId}`);
      if (res.data.status === 200) {
        setOrderDetail(res.data.result);
      }
    } catch (error) {
      console.error("Load order detail error:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    loadOrderDetail(order._id);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  const getStatusColor = (state) => {
    const statusMap = {
      "Thành công": "success",
      "Thất bại": "error",
      "Đang xử lý": "info",
      "Chờ xử lý": "warning"
    };
    return statusMap[state] || "default";
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

  // Hiển thị chi tiết đơn hàng
  if (selectedOrder && orderDetail) {
    const totalPrice = orderDetail.orderItems?.reduce((sum, item) => sum + item.price, 0) || 0;
    
    return (
      <Box>
        <Button 
          startIcon={<Receipt />} 
          onClick={handleBackToList}
          sx={{ mb: 3 }}
        >
          Quay lại danh sách
        </Button>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mã đơn hàng
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  #{orderDetail._id.slice(-8).toUpperCase()}
                </Typography>
              </Box>
              <Chip 
                label={orderDetail.state} 
                color={getStatusColor(orderDetail.state)}
                size="large"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Thông tin đơn hàng */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {orderDetail.created_at}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tiền
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {totalPrice.toLocaleString()} ₫
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Danh sách sản phẩm */}
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Sản phẩm ({orderDetail.orderItems?.length || 0})
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 2 }}>
                {orderDetail.orderItems?.map((item) => (
                  <Box 
                    key={item._id}
                    sx={{ 
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 2
                    }}
                  >
                    <Box
                      component="img"
                      src={item.thumbnail}
                      alt={item.title}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                        bgcolor: 'grey.200'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ mt: 1 }}>
                        {item.price.toLocaleString()} ₫
                      </Typography>
                      {orderDetail.state === "Thành công" && item.file && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={item.file}
                          download
                          sx={{ mt: 1 }}
                        >
                          Tải xuống
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Hiển thị danh sách đơn hàng
  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <Card 
          key={order._id} 
          variant="outlined" 
          sx={{ 
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)'
            }
          }}
          onClick={() => handleOrderClick(order)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mã đơn hàng
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  #{order._id.slice(-8).toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {order.created_at}
                </Typography>
              </Box>
              <Chip 
                label={order.state} 
                color={getStatusColor(order.state)}
                size="medium"
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
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
          Quản lý thông tin và đơn hàng của bạn
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
            label="Thông tin cá nhân" 
            value="info" 
          />
          <Tab 
            icon={<Receipt />} 
            iconPosition="start" 
            label="Đơn hàng của tôi" 
            value="orders" 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {activeTab === "info" && <UserInfoTab user={user} />}
        {activeTab === "orders" && <OrdersTab />}
      </Box>
    </Container>
  );
}