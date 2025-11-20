import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Alert, CircularProgress, Box } from "@mui/material";
import api from "../../../services/api";

export default function PayPalCheckout({ onSuccess }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Kiểm tra client ID
  if (!clientId || clientId === "undefined") {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        ⚠️ Thiếu VITE_PAYPAL_CLIENT_ID trong file .env
      </Alert>
    );
  }

  const initialOptions = {
    clientId: clientId, // Đổi từ "client-id" thành "clientId"
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
          
          createOrder={async () => {
            try {
              setLoading(true);
              setMessage("");
              
              const res = await api.post("/create");
              
              if (res.data.status === 200) {
                return res.data.result;
              }
              throw new Error("Không tạo được order");
            } catch (err) {
              console.error("CreateOrder Error:", err);
              setMessage("❌ Không thể tạo đơn hàng PayPal");
              throw err;
            } finally {
              setLoading(false);
            }
          }}
          
          onApprove={async (data) => {
            try {
              setLoading(true);
              const res = await api.post(`/orders/capture/${data.orderID}`);
              
              if (res.data.status === 200) {
                setMessage("✅ Thanh toán thành công!");
                setTimeout(() => onSuccess?.(), 1000);
              } else {
                setMessage("❌ " + res.data.result);
              }
            } catch (err) {
              console.error("OnApprove Error:", err);
              setMessage("❌ Lỗi khi xác nhận thanh toán");
            } finally {
              setLoading(false);
            }
          }}
          
          onError={(err) => {
            console.error("PayPal Error:", err);
            setMessage("❌ Có lỗi xảy ra với PayPal");
            setLoading(false);
          }}
        />

        {message && (
          <Alert 
            severity={message.includes("✅") ? "success" : "error"} 
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}
      </Box>
    </PayPalScriptProvider>
  );
}