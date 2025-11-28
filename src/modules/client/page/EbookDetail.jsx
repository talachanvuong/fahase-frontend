import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button, Container, Divider, Skeleton, Stack, Alert, TextField, Card, CardContent, Avatar, Paper, Chip, CircularProgress } from "@mui/material";
import { useCart } from "../../../hook/useCart";
import { useAuth } from "../../../hook/useAuth";
import api from "../../../services/api";
import { AddShoppingCart, ShoppingCartCheckout, Send, Download, CheckCircle } from "@mui/icons-material";

const DetailSkeleton = () => (
  <Box>
    <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
      <Skeleton variant="rectangular" sx={{ width: 200, height: 280, borderRadius: 2, flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton height={35} width="60%" sx={{ mb: 1 }} />
        <Skeleton height={40} width="25%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={48} />
      </Box>
    </Box>
    <Skeleton height={100} />
  </Box>
);

const CommentItem = ({ comment }) => (
  <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2 }}>
    <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Avatar
          src={comment.user?.photo_url}
          alt={comment.user?.display_name}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="body2" fontWeight="600">
              {comment.user?.display_name || "Người dùng"}
            </Typography>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 14 }} />}
              label="Đã mua"
              size="small"
              color="success"
              sx={{ height: 18, fontSize: "0.65rem", "& .MuiChip-icon": { fontSize: 14 } }}
            />
          </Box>
          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, lineHeight: 1.5 }}>
            {comment.content}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
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

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

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
      <Container maxWidth="md" sx={{ py: 3 }}>
        <DetailSkeleton />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">Không tìm thấy sản phẩm này hoặc sản phẩm đã bị xóa.</Alert>
      </Container>
    );
  }

  const displayName = product.title || product.name;
  const price = product.price || 0;
  const image = `/api/blob/thumbnailPublic/${product._id}`;
  const description = product.description || "Chưa có mô tả cho sản phẩm này.";

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Thông tin sản phẩm - Layout ngang */}
      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        {/* Ảnh sản phẩm - Cố định kích thước nhỏ */}
        <Box
          sx={{
            width: 200,
            height: 280,
            flexShrink: 0,
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

        {/* Thông tin và nút hành động */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" fontWeight="bold" mb={1}>
            {displayName}
          </Typography>

          <Typography variant="h6" fontWeight="bold" color="primary.main" mb={2}>
            {price.toLocaleString()} ₫
          </Typography>

          {checkingPurchase ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : hasPurchased ? (
            <Box>
              <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 1.5, py: 0.5 }}>
                Bạn đã sở hữu sản phẩm này
              </Alert>
              <Button
                variant="contained"
                color="success"
                size="medium"
                startIcon={<Download />}
                fullWidth
                sx={{ fontWeight: "bold" }}
              >
                Tải xuống ngay
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleBuyNow}
                fullWidth
                sx={{ fontWeight: "bold" }}
              >
                Mua ngay
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                sx={{ fontWeight: "bold" }}
              >
                Thêm vào giỏ
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Mô tả sản phẩm */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={1.5}>
          Mô tả sản phẩm
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          {description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Phần đánh giá */}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Đánh giá sản phẩm ({comments.length})
        </Typography>

        {/* Form đánh giá */}
        {user ? (
          hasPurchased ? (
            <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "grey.50" }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Viết đánh giá của bạn về sản phẩm này..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
                size="small"
                sx={{ mb: 1.5, bgcolor: "white" }}
              />

              {submitMessage.text && (
                <Alert severity={submitMessage.type} sx={{ mb: 1.5, py: 0.5 }}>
                  {submitMessage.text}
                </Alert>
              )}

              <Button
                variant="contained"
                size="small"
                startIcon={<Send />}
                onClick={handleSubmitComment}
                disabled={submitting}
                sx={{ fontWeight: "bold" }}
              >
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </Paper>
          ) : checkingPurchase ? (
            <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
              Đang kiểm tra...
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
              Bạn cần mua sản phẩm này để có thể đánh giá.
            </Alert>
          )
        ) : (
          <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
            Vui lòng{" "}
            <Button size="small" onClick={() => navigate("/login")}>
              đăng nhập
            </Button>{" "}
            để đánh giá sản phẩm.
          </Alert>
        )}

        {/* Danh sách đánh giá */}
        {commentsLoading ? (
          <Stack spacing={1.5}>
            {[1, 2].map((i) => (
              <Card key={i} variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Skeleton width="40%" height={20} />
                  <Skeleton width="100%" height={40} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : comments.length === 0 ? (
          <Alert severity="info" sx={{ py: 0.5 }}>
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
    </Container>
  );
}