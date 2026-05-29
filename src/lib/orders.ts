import { connectDB } from "@/src/lib/db";
import orderModel from "@/src/models/Order";
import userModel from "@/src/models/User";
import productModel from "@/src/models/Product";
import shippingMethodModel from "@/src/models/ShippingMethod";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { evaluateCoupon } from "@/src/lib/coupon";
import { MAIL_FROM, mailTo } from "@/src/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

export type OrderItemInput = {
  product: string;
  name?: string;
  image?: string | null;
  price?: number;
  quantity: number;
};

export type ShippingAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

// ── Stock helpers ──────────────────────────────────────────────────────────

/** Decrement stock after a confirmed payment (floored at 0 — never reject). */
export async function reduceStockAfterPayment(
  items: { product: string; quantity: number }[],
) {
  for (const item of items) {
    await productModel.updateOne({ _id: item.product }, [
      { $set: { stock: { $max: [0, { $subtract: ["$stock", item.quantity] }] } } },
    ]);
  }
}

// ── Server-authoritative pricing ─────────────────────────────────────────────

/**
 * Rebuild order lines + totals from the DB. The client only says WHICH products
 * and HOW MANY — never the price. Coupon and shipping are re-validated too.
 */
export async function recomputeOrderPricing(
  items: OrderItemInput[],
  shippingCostFromClient: number,
  couponCode?: string | null,
) {
  await connectDB();
  const ids = items.map((i) => i.product);
  const products = await productModel
    .find({ _id: { $in: ids } })
    .select("name price image")
    .lean();
  const byId = new Map(products.map((p: any) => [p._id.toString(), p]));

  const lines = items.map((i) => {
    const p = byId.get(i.product);
    if (!p) throw new Error("One or more items are no longer available.");
    const quantity = Math.max(1, Math.floor(i.quantity));
    return {
      product: i.product,
      name: p.name,
      image: p.image ?? null,
      price: p.price,
      quantity,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);

  let discount = 0;
  let appliedCode: string | null = null;
  if (couponCode) {
    const result = await evaluateCoupon(couponCode, subtotal);
    if (result.ok) {
      discount = result.discount;
      appliedCode = result.code;
    }
  }

  const methods = await shippingMethodModel.find({ active: true }).select("cost").lean();
  const allowedCosts = methods.map((m: any) => m.cost);
  let shippingCost: number;
  if (allowedCosts.includes(shippingCostFromClient)) shippingCost = shippingCostFromClient;
  else if (allowedCosts.length > 0) shippingCost = Math.min(...allowedCosts);
  else shippingCost = Math.max(0, shippingCostFromClient);

  const totalAmount = Math.max(0, subtotal - discount) + shippingCost;
  return { lines, subtotal, discount, couponCode: appliedCode, shippingCost, totalAmount };
}

export function formatOrder(order: any) {
  return {
    ...order._doc,
    id: order._id.toString(),
    user: order.user?.toString() ?? null,
    createdAt: order.createdAt?.toISOString?.() ?? null,
    updatedAt: order.updatedAt?.toISOString?.() ?? null,
    paidAt: order.paidAt?.toISOString?.() ?? null,
    deliveredAt: order.deliveredAt?.toISOString?.() ?? null,
  };
}

// ── Emails ───────────────────────────────────────────────────────────────────

function sendWelcomeEmail(name: string, email: string, password: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  resend.emails
    .send({
      from: MAIL_FROM,
      to: mailTo(email),
      subject: "Your account details",
      html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Hi ${name},</h2>
        <p>An account was automatically created for you when you placed your order.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong>
          <code style="background:#f4f4f4;padding:4px 8px;border-radius:4px;">${password}</code>
        </p>
        <p>Please log in and change your password after your first login.</p>
        ${siteUrl ? `<a href="${siteUrl}/login" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;font-weight:bold;">Log In Now</a>` : ""}
      </div>`,
    })
    .catch((err) => console.error("Welcome email error:", err));
}

function sendOrderConfirmation(order: any, email: string) {
  const rows = (order.items ?? [])
    .map(
      (i: any) =>
        `<tr><td style="padding:6px 0;">${i.name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right;">₦${(i.price * i.quantity).toLocaleString()}</td></tr>`,
    )
    .join("");

  resend.emails
    .send({
      from: MAIL_FROM,
      to: mailTo(email),
      subject: `Order confirmed — ${order.paymentReference ?? order._id}`,
      html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto;">
        <h2>Thank you for your order!</h2>
        <p>We've received your payment and are getting your order ready.</p>
        <p style="color:#666;font-size:13px;">Reference: <strong>${order.paymentReference ?? order._id}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
          ${rows}
          <tr><td style="padding-top:10px;border-top:1px solid #eee;">Subtotal</td><td style="padding-top:10px;border-top:1px solid #eee;text-align:right;">₦${order.subtotal.toLocaleString()}</td></tr>
          ${order.discount > 0 ? `<tr><td style="color:#16a34a;">Discount${order.couponCode ? ` (${order.couponCode})` : ""}</td><td style="color:#16a34a;text-align:right;">-₦${order.discount.toLocaleString()}</td></tr>` : ""}
          <tr><td>Shipping</td><td style="text-align:right;">₦${order.shippingCost.toLocaleString()}</td></tr>
          <tr><td style="font-weight:bold;padding-top:6px;">Total</td><td style="font-weight:bold;text-align:right;padding-top:6px;">₦${order.totalAmount.toLocaleString()}</td></tr>
        </table>
        <p style="font-size:13px;color:#666;">Shipping to: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state}</p>
      </div>`,
    })
    .catch((err) => console.error("Order email error:", err));
}

// ── Guest user creation ──────────────────────────────────────────────────────

async function ensureUser(
  shippingAddress: ShippingAddress,
  contextUserId?: string | null,
): Promise<string | null> {
  if (contextUserId) return contextUserId;
  if (!shippingAddress?.email) return null;

  let user = await userModel.findOne({ email: shippingAddress.email });
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    user = await userModel.create({
      name: shippingAddress.name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      password: hashedPassword,
      role: "user",
    });
    sendWelcomeEmail(shippingAddress.name, shippingAddress.email, randomPassword);
  }
  return user._id.toString();
}

// ── The single source of truth for finalizing a PAID order ───────────────────

export type FinalizeInput = {
  reference: string;
  paidAmountKobo: number;
  shippingAddress: ShippingAddress;
  items: OrderItemInput[];
  shippingCost: number;
  couponCode?: string | null;
  contextUserId?: string | null;
};

/**
 * Idempotent + race-safe (unique index on paymentReference). Verifies the
 * actually-paid amount against the server-recomputed total, creates the order,
 * decrements stock, and emails a confirmation. Used by BOTH the GraphQL
 * verify mutation and the Paystack webhook.
 */
export async function finalizePaidOrder(
  input: FinalizeInput,
): Promise<{ order: any; created: boolean }> {
  await connectDB();

  const existing = await orderModel.findOne({ paymentReference: input.reference });
  if (existing) return { order: existing, created: false };

  const pricing = await recomputeOrderPricing(
    input.items,
    input.shippingCost,
    input.couponCode,
  );

  const expectedKobo = Math.round(pricing.totalAmount * 100);
  if (input.paidAmountKobo !== expectedKobo) {
    throw new Error(
      "Paid amount does not match the order total. Please contact support with your reference.",
    );
  }

  const userId = await ensureUser(input.shippingAddress, input.contextUserId);

  let order;
  try {
    order = await orderModel.create({
      user: userId,
      items: pricing.lines,
      shippingAddress: input.shippingAddress,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      couponCode: pricing.couponCode,
      shippingCost: pricing.shippingCost,
      totalAmount: pricing.totalAmount,
      paymentMethod: "Paystack",
      paymentReference: input.reference,
      isPaid: true,
      paidAt: new Date(),
      status: "Processing",
    });
  } catch (err: any) {
    // Race: the webhook and the success page both finalized at once. The
    // unique index on paymentReference rejected the 2nd insert — return the
    // order the other path created, and DON'T decrement stock again.
    if (err?.code === 11000) {
      const winner = await orderModel.findOne({ paymentReference: input.reference });
      if (winner) return { order: winner, created: false };
    }
    throw err;
  }

  await reduceStockAfterPayment(pricing.lines);
  sendOrderConfirmation(order, input.shippingAddress.email);

  return { order, created: true };
}
