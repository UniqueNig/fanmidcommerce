"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import { CheckCircle, ArrowRight, Loader2, XCircle } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

const VERIFY_AND_CREATE_ORDER = `
  mutation VerifyPaymentAndCreateOrder(
    $reference: String!
    $items: [OrderItemInput!]!
    $shippingAddress: ShippingAddressInput!
    $subtotal: Float!
    $shippingCost: Float!
    $totalAmount: Float!
  ) {
    verifyPaymentAndCreateOrder(
      reference: $reference
      items: $items
      shippingAddress: $shippingAddress
      subtotal: $subtotal
      shippingCost: $shippingCost
      totalAmount: $totalAmount
    ) {
      id
      status
    }
  }
`;

type Status = "verifying" | "success" | "error";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setErrorMsg("No payment reference found.");
      return;
    }

    const pending = localStorage.getItem("pending_order");
    if (!pending) {
      // Already processed or direct navigation — just show success
      setStatus("success");
      return;
    }

    const order = JSON.parse(pending);

    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        query: VERIFY_AND_CREATE_ORDER,
        variables: {
          reference: ref,
          items: order.items,
          shippingAddress: order.shippingAddress,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          totalAmount: order.totalAmount,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) throw new Error(data.errors[0].message);
        localStorage.removeItem("pending_order");
        clearCart();
        setStatus("success");
      })
      .catch((err) => {
        console.error("Order finalization failed:", err);
        setErrorMsg(err.message ?? "Something went wrong. Please contact support.");
        setStatus("error");
      });
  }, [ref]);

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">

        {/* Verifying */}
        {status === "verifying" && (
          <>
            <Loader2 size={64} className="animate-spin" style={{ color: "var(--accent)" }} />
            <div>
              <h1 className="text-3xl font-black font-['Playfair_Display'] mb-2" style={{ color: "var(--text-primary)" }}>
                Confirming your order...
              </h1>
              <p className="text-sm font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
                Please don't close this page.
              </p>
            </div>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <CheckCircle size={72} style={{ color: "#22c55e" }} />
            <div>
              <h1 className="text-4xl font-black font-['Playfair_Display'] mb-2" style={{ color: "var(--text-primary)" }}>
                Order Confirmed!
              </h1>
              <p className="text-sm font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
                Thank you for your purchase. We'll process your order shortly.
              </p>
            </div>

            {ref && (
              <div className="px-6 py-4 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}>
                <p className="text-[10px] tracking-widest uppercase font-['DM_Sans'] mb-1" style={{ color: "var(--text-muted)" }}>
                  Payment Reference
                </p>
                <p className="text-sm font-bold font-['DM_Sans'] font-mono" style={{ color: "var(--accent)" }}>
                  {ref}
                </p>
              </div>
            )}

            <p className="text-xs font-['DM_Sans'] max-w-sm" style={{ color: "var(--text-secondary)" }}>
              A confirmation will be sent to your email. You can track your order in your dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                Continue Shopping <ArrowRight size={14} />
              </Link>
              <Link href="/dashboard"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] border hover:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                My Orders
              </Link>
            </div>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <XCircle size={72} style={{ color: "#ef4444" }} />
            <div>
              <h1 className="text-3xl font-black font-['Playfair_Display'] mb-2" style={{ color: "var(--text-primary)" }}>
                Something went wrong
              </h1>
              <p className="text-sm font-['DM_Sans'] max-w-sm" style={{ color: "var(--text-muted)" }}>
                {errorMsg || "Your payment may have gone through. Please contact support with your reference."}
              </p>
            </div>

            {ref && (
              <div className="px-6 py-4 border" style={{ borderColor: "var(--border)", backgroundColor: "var(--card-bg)" }}>
                <p className="text-[10px] tracking-widest uppercase font-['DM_Sans'] mb-1" style={{ color: "var(--text-muted)" }}>
                  Payment Reference
                </p>
                <p className="text-sm font-bold font-['DM_Sans'] font-mono" style={{ color: "var(--accent)" }}>
                  {ref}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] border hover:opacity-70 transition-opacity"
                style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
                Back to Shop
              </Link>
              <a href="mailto:support@fanmid.com"
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                Contact Support
              </a>
            </div>
          </>
        )}

      </div>
    </main>
  );
}