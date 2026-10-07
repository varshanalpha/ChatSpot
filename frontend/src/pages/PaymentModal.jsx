import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CreditCard,
  QrCode,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  X,
  ArrowRight
} from "lucide-react";
import { api } from "../api/client";

export default function PaymentModal({
  order,
  isOpen,
  onClose,
  onPaymentSuccess
}) {
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentState, setPaymentState] = useState("PENDING"); // PENDING, PROCESSING, SUCCESSFUL, FAILED
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    if (isOpen && order) {
      setPaymentState("PENDING");
      setErrorMessage("");
      // Generate initial mock payment reference
      setPaymentReference(`PAY-${order.order_number}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleSimulatePayment = async (forceFail = false) => {
    setPaymentState("PROCESSING");
    setErrorMessage("");

    try {
      // Realistic simulation delay for payment gateway handshake
      await new Promise((res) => setTimeout(res, 1800));

      if (forceFail) {
        // Test payment failure flow
        await api.verifyPayment({
          order_id: order.id,
          payment_reference: paymentReference,
          payment_status: "FAILED",
          payment_method: paymentMethod,
        });
        setPaymentState("FAILED");
        setErrorMessage("Payment was declined by your bank/UPI provider. Please retry.");
        return;
      }

      // Successful verification
      const verifyRes = await api.verifyPayment({
        order_id: order.id,
        payment_reference: paymentReference,
        payment_status: "SUCCESSFUL",
        payment_method: paymentMethod,
      });

      setPaymentState("SUCCESSFUL");

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (onPaymentSuccess) {
        onPaymentSuccess(verifyRes);
      }
    } catch (err) {
      setPaymentState("FAILED");
      setErrorMessage(err.message || "Payment verification failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Secure Payment Gateway</h3>
              <p className="text-[10px] text-slate-400">Order #{order.order_number}</p>
            </div>
          </div>
          {paymentState !== "PROCESSING" && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content based on state */}
        <div className="p-6">
          
          {/* PENDING / SELECT PAYMENT METHOD */}
          {paymentState === "PENDING" && (
            <div className="space-y-5">
              <div className="text-center pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Total Payable</span>
                <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                  ₹{order.total_amount}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Payment Method:
                </label>

                {/* Option 1: Instant UPI */}
                <div
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === "UPI"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Instant UPI (GPay / PhonePe / Paytm)</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">Fastest</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Zero extra fees • Instant confirmation</p>
                  </div>
                </div>

                {/* Option 2: Campus Wallet */}
                <div
                  onClick={() => setPaymentMethod("CAMPUS_WALLET")}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === "CAMPUS_WALLET"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">College Smart Card / Wallet</span>
                      <span className="text-[10px] text-slate-400 font-medium">Bal: ₹650</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Deducts directly from Student ID RFID card</p>
                  </div>
                </div>

                {/* Option 3: Debit/Credit Card */}
                <div
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === "CARD"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900">Debit / Credit Card / NetBanking</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Authorize & Pay ₹{order.total_amount}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Developer / Tester Failure flow button */}
                <button
                  type="button"
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-1.5 text-[11px] text-slate-400 hover:text-rose-600 transition text-center underline"
                >
                  Simulate Bank Payment Failure (Test Edge Case)
                </button>
              </div>
            </div>
          )}

          {/* PROCESSING STATE */}
          {paymentState === "PROCESSING" && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Verifying Transaction</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Communicating with payment gateway and assigning canteen token number...
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                Ref: {paymentReference}
              </div>
            </div>
          )}

          {/* SUCCESSFUL STATE */}
          {paymentState === "SUCCESSFUL" && (
            <div className="py-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Payment Verified ✓
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-0.5">
                  Order Confirmed!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Your order has been sent to ChatSpot Canteen kitchen.
                </p>
              </div>

              {/* Massive Token Number Display */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-500/40 rounded-2xl">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
                  Your Unique Pickup Token
                </span>
                <div className="text-4xl font-black text-slate-950 font-display tracking-tight my-1">
                  {order.token_number}
                </div>
                <span className="text-xs text-emerald-700 font-medium">
                  Order #{order.order_number} • Counter 1
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Please collect your food only after your order is marked <strong>READY</strong>.
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-campus-navy hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Track Order Live Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* FAILED STATE */}
          {paymentState === "FAILED" && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900">Payment Failed</h4>
                <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>
                <p className="text-xs text-slate-500 mt-1">
                  No money was deducted. You can try a different payment method.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setPaymentState("PENDING")}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                >
                  Retry Payment
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
