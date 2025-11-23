import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Divider,
  Skeleton,
  useTheme,
  Stack,
  Alert,
  TextField,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useCart } from "../../../hook/useCart";
import { useAuth } from "../../../hook/useAuth";
import api from "../../../services/api";
import {
  AddShoppingCart,
  ShoppingCartCheckout,
  Send,
  Download,
  CheckCircle,
} from "@mui/icons-material";

const DetailSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item md={5} xs={12}>
      <Skeleton variant="rectangular" sx={{ width: "100%", aspectRatio: "1/1", borderRadius: 3 }} />
    </Grid>
    <Grid item md={7} xs={12}>
      <Skeleton height={40} width="70%" sx={{ mb: 2 }} />
      <Skeleton height={20} width="40%" sx={{ mb: 1 }} />
      <Divider sx={{ my: 2 }} />
      <Skeleton height={50} width="30%" sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={56} width="100%" sx={{ mb: 2 }} />
      <Skeleton height={150} sx={{ mt: 3 }} />
    </Grid>
  </Grid>
);

const CommentItem = ({ comment }) => (
  <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar
          src={comment.user?.photo_url}
          alt={comment.user?.display_name}
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="body1" fontWeight="bold">
              {comment.user?.display_name || "Người dùng"}
            </Typography>
            <Chip
              icon={<CheckCircle />}
              label="Đã mua"
              size="small"
              color="success"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          </Box>

          <Typography variant="body2" color="text.primary" sx={{ mb: 1, lineHeight: 1.6 }}>
            {comment.content}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {comment.created_at}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function EbookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const theme = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  // State cho comment form
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Load product data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/product/getById/${id}`);
        const data = res.data?.result;
        if (data) setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await api.get(`/comment/getAllByProduct/${id}`);
        if (res.data.status === 200) {
          setComments(res.data.result || []);
        }
      } catch (error) {
        console.error("Load comments error:", error);
      } finally {
        setCommentsLoading(false);
      }
    };
    loadComments();
  }, [id]);

  // Check if user has purchased
  useEffect(() => {
    const checkPurchase = async () => {
      if (!user) {
        setCheckingPurchase(false);
        setHasPurchased(false);
        return;
      }

      setCheckingPurchase(true);
      try {
        const res = await api.get(`/bought/isBought/${id}`);
        if (res.data.status === 200) {
          setHasPurchased(res.data.result === true);
        }
      } catch (error) {
        console.error("Check purchase error:", error);
        setHasPurchased(false);
      } finally {
        setCheckingPurchase(false);
      }
    };
    checkPurchase();
  }, [id, user]);

  // Submit comment
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      setSubmitMessage({ type: "error", text: "Vui lòng nhập nội dung đánh giá" });
      return;
    }

    setSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const res = await api.post("/comment/add", {
        product: id,
        content: commentText,
      });

      if (res.data.status === 200) {
        setSubmitMessage({ type: "success", text: "Đánh giá của bạn đã được gửi!" });
        setCommentText("");

        // Reload comments
        const commentsRes = await api.get(`/comment/getAllByProduct/${id}`);
        if (commentsRes.data.status === 200) {
          setComments(commentsRes.data.result || []);
        }
      } else {
        setSubmitMessage({ type: "error", text: res.data.result || "Có lỗi xảy ra" });
      }
    } catch (error) {
      console.error("Submit comment error:", error);
      setSubmitMessage({
        type: "error",
        text: error.response?.data?.result || "Không thể gửi đánh giá",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      thumbnail: `/api/blob/thumbnailPublic/${product._id}`,
    });
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          thumbnail: `/api/blob/thumbnailPublic/${product._id}`,
        },
      },
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <DetailSkeleton />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy sản phẩm này hoặc sản phẩm đã bị xóa.</Alert>
      </Container>
    );
  }

  const displayName = product.title || product.name;
  const price = product.price || 0;
  const image = `/api/blob/thumbnailPublic/${product._id}`;
  const description = product.description || "Chưa có mô tả cho sản phẩm này.";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* === CỘT 1: HÌNH ẢNH (40%) === */}
        <Grid item md={5} xs={12}>
          <Box
            sx={{
              position: "sticky",
              top: 100,
              aspectRatio: "1/1",
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "grey.100",
            }}
          >
            <img
              src={image}
              alt={displayName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid>

        {/* === CỘT 2: THÔNG TIN (60%) === */}
        <Grid item md={7} xs={12}>
          {/* Tên sản phẩm */}
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {displayName}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Giá */}
          <Typography variant="h5" fontWeight="bold" color="primary.main" mb={3}>
            {price.toLocaleString()} ₫
          </Typography>

          {/* === NÚT HÀNH ĐỘNG === */}
          {checkingPurchase ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={30} />
            </Box>
          ) : hasPurchased ? (
            // ✅ Đã mua - Hiển thị trạng thái và nút tải
            <Box>
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                Bạn đã sở hữu sản phẩm này
              </Alert>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<Download />}
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold", mb: 2 }}
              >
                Tải xuống ngay
              </Button>
            </Box>
          ) : (
            // ❌ Chưa mua - Hiển thị nút mua
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleBuyNow}
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                Mua ngay
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                Thêm vào giỏ
              </Button>
            </Stack>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Mô tả sản phẩm */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Mô tả sản phẩm
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              lineHeight: 1.8,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {description}
          </Typography>
        </Grid>
      </Grid>

      {/* === PHẦN ĐÁNH GIÁ === */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Đánh giá sản phẩm
        </Typography>

        {/* Form đánh giá */}
        {user ? (
          hasPurchased ? (
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Chia sẻ trải nghiệm của bạn
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Viết đánh giá của bạn về sản phẩm này..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
                sx={{ mb: 2, bgcolor: "white" }}
              />

              {submitMessage.text && (
                <Alert severity={submitMessage.type} sx={{ mb: 2 }}>
                  {submitMessage.text}
                </Alert>
              )}

              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleSubmitComment}
                disabled={submitting}
                sx={{ fontWeight: "bold" }}
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </Paper>
          ) : checkingPurchase ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Đang kiểm tra...
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Bạn cần mua sản phẩm này để có thể đánh giá.
            </Alert>
          )
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Vui lòng{" "}
            <Button size="small" onClick={() => navigate("/login")}>
              đăng nhập
            </Button>{" "}
            để đánh giá sản phẩm.
          </Alert>
        )}

        {/* Danh sách đánh giá */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Nhận xét ({comments.length})
          </Typography>

          {commentsLoading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((i) => (
                <Card key={i} variant="outlined">
                  <CardContent>
                    <Skeleton width="40%" height={25} />
                    <Skeleton width="100%" height={50} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : comments.length === 0 ? (
            <Alert severity="info">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!
            </Alert>
          ) : (
            <Box>
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}