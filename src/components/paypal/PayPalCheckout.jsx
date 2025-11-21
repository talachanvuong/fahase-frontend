import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Alert, CircularProgress, Box, Snackbar } from "@mui/material";
import api from "../../services/api";

export default function PayPalCheckout({ onSuccess }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State cho Snackbar (popup notification)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" // "success" | "error" | "warning" | "info"
  });

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Hàm hiển thị popup thông báo
  const showPopup = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Hàm đóng popup
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const initialOptions = {
    clientId: clientId,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Box sx={{ mt: 2 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <PayPalButtons
          style={{ layout: "vertical", color: "gold" }}
          disabled={loading}
          
          //  Tạo đơn hàng
          createOrder={async () => {
            try {
              setLoading(true);
              setMessage("");
              
              const res = await api.post("/order/create");
              
              if (res.data.status === 200) {
                showPopup("Đang chuyển đến PayPal...", "info");
                return res.data.result;
              }
              throw new Error("Không tạo được order");
            } catch (err) {
              console.error("CreateOrder Error:", err);
              const errorMsg = " Không thể tạo đơn hàng PayPal";
              setMessage(errorMsg);
              showPopup(errorMsg, "error");
              throw err;
            } finally {
              setLoading(false);
            }
          }}
          
          //  Thanh toán thành công → Gọi API capture
          onApprove={async (data) => {
            try {
              setLoading(true);
              showPopup("Đang xác nhận thanh toán...", "info");
              
              const res = await api.post(`/order/capture/${data.orderID}`);
              
              if (res.data.status === 200) {
                const successMsg = " Thanh toán thành công!";
                setMessage(successMsg);
                showPopup(successMsg, "success");
                
                // Chờ 1.5 giây rồi gọi callback onSuccess
                setTimeout(() => onSuccess?.(), 1500);
              } else {
                const errorMsg = " " + res.data.result;
                setMessage(errorMsg);
                showPopup(errorMsg, "error");
              }
            } catch (err) {
              console.error("OnApprove Error:", err);
              const errorMsg = " Lỗi khi xác nhận thanh toán";
              setMessage(errorMsg);
              showPopup(errorMsg, "error");
            } finally {
              setLoading(false);
            }
          }}
          
          // Người dùng hủy thanh toán → Gọi API cancel
          onCancel={async (data) => {
            try {
              setLoading(true);
              console.log("Payment cancelled:", data);
              
              // Gọi API cancel
              if (data.orderID) {
                await api.post(`/order/cancel/${data.orderID}`);
              }
              
              const cancelMsg = " Bạn đã hủy thanh toán";
              setMessage(cancelMsg);
              showPopup(cancelMsg, "warning");
            } catch (err) {
              console.error("OnCancel Error:", err);
              showPopup(" Đã hủy thanh toán (có lỗi khi gọi API cancel)", "warning");
            } finally {
              setLoading(false);
            }
          }}
          
          // Lỗi PayPal → Gọi API cancel
          onError={async (err) => {
            try {
              setLoading(true);
              console.error("PayPal Error:", err);
              
              // Nếu có orderID trong error data, gọi API cancel
              if (err?.orderID) {
                await api.post(`/order/cancel/${err.orderID}`);
              }
              
              const errorMsg = "Có lỗi xảy ra với PayPal";
              setMessage(errorMsg);
              showPopup(errorMsg, "error");
            } catch (cancelErr) {
              console.error("Error calling cancel API:", cancelErr);
              showPopup(" Lỗi PayPal (không thể gọi API cancel)", "error");
            } finally {
              setLoading(false);
            }
          }}
        />

        {/* Alert hiển thị bên dưới nút PayPal */}
        {message && (
          <Alert 
            severity={
              message.includes("") ? "success" : 
              message.includes("") ? "warning" : 
              "error"
            } 
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}

        {/* Snackbar (Popup Notification) */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PayPalScriptProvider>
  );
}