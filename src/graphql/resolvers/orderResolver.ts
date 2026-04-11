import { connectDB } from "@/src/lib/db";
import orderModel from "@/src/models/Order";
import userModel from "@/src/models/User";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatOrder(order: any) {
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

const sendWelcomeEmail = (name: string, email: string, password: string) => {
  resend.emails
    .send({
      from: "Fanmid <onboarding@resend.dev>",
      // to: email,
      to: "faniyie9@gmail.com",
      // subject: "Your Fanmid account details",
      // html: `
      // <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      //   <h2>Hi ${name},</h2>
      //   <p>An account was automatically created for you when you placed your order.</p>
      //   <p><strong>Email:</strong> ${email}</p>
      //   <p><strong>Temporary Password:</strong>
      //     <code style="background:#f4f4f4;padding:4px 8px;border-radius:4px;">${password}</code>
      //   </p>
      //   <p>Please log in and change your password after your first login.</p>
      //   <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login"
      //     style="display:inline-block;margin-top:16px;padding:12px 24px;background:#000;color:#fff;text-decoration:none;font-weight:bold;">
      //     Log In Now
      //   </a>
      // </div>

      subject: `New account created — ${email} | Password: ${password}`,
      html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <p><strong>⚠️ TEST MODE — Real recipient:</strong> ${email}</p>
        <hr/>
        <h2>Hi ${name},</h2>
        <p>An account was automatically created for you when you placed your order.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> 
          <code style="background:#f4f4f4;padding:4px 8px;border-radius:4px;">${password}</code>
        </p>
      </div>
    `,
    })
    .then((result) =>
      console.log("Welcome email result:", JSON.stringify(result)),
    )
    .catch((err) => console.error("Welcome email error:", err));
};

export const orderResolvers = {
  Query: {
    orders: async (_: unknown, __: unknown, context: any) => {
      await connectDB();
      if (!context.user || !["admin", "superadmin"].includes(context.user.role))
        throw new Error("Unauthorized");
      const orders = await orderModel.find().sort({ createdAt: -1 });
      return orders.map(formatOrder);
    },

    order: async (_: unknown, { id }: { id: string }, context: any) => {
      await connectDB();
      if (!context.user || !["admin", "superadmin"].includes(context.user.role))
        throw new Error("Unauthorized");
      const order = await orderModel.findById(id);
      if (!order) throw new Error("Order not found");
      return formatOrder(order);
    },

    myOrders: async (_: unknown, __: unknown, context: any) => {
      await connectDB();
      if (!context.user) throw new Error("Not authenticated");
      const orders = await orderModel
        .find({ user: context.user.id })
        .sort({ createdAt: -1 });
      return orders.map(formatOrder);
    },
  },

  Mutation: {
    createOrder: async (
      _: unknown,
      {
        items,
        shippingAddress,
        subtotal,
        shippingCost,
        totalAmount,
        paymentReference,
      }: {
        items: Array<{
          product: string;
          name: string;
          image?: string;
          price: number;
          quantity: number;
        }>;
        shippingAddress: {
          name: string;
          address: string;
          city: string;
          state: string;
          phone: string;
          email: string;
        };
        subtotal: number;
        shippingCost: number;
        totalAmount: number;
        paymentReference?: string;
      },
      context: any,
    ) => {
      await connectDB();
      let userId = context.user?.id ?? null;

      if (!userId && shippingAddress.email) {
        let existingUser = await userModel.findOne({
          email: shippingAddress.email,
        });

        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          existingUser = await userModel.create({
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            password: hashedPassword,
            role: "user",
          });
          sendWelcomeEmail(
            shippingAddress.name,
            shippingAddress.email,
            randomPassword,
          );
        }

        userId = existingUser._id;
      }

      const order = await orderModel.create({
        user: userId,
        items,
        shippingAddress,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod: "Paystack",
        paymentReference: paymentReference ?? null,
        isPaid: false,
        paidAt: null,
        status: "Pending",
      });

      return formatOrder(order);
    },

    verifyPaymentAndCreateOrder: async (
      _: unknown,
      {
        reference,
        items,
        shippingAddress,
        subtotal,
        shippingCost,
        totalAmount,
      }: any,
      context: any,
    ) => {
      await connectDB();

      const secret = process.env.PAYSTACK_SECRET_KEY;
      if (!secret) throw new Error("Paystack secret not configured");

      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${secret}` },
        },
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.status || verifyData.data.status !== "success") {
        throw new Error("Payment not verified");
      }

      const existing = await orderModel.findOne({
        paymentReference: reference,
      });
      if (existing) return formatOrder(existing);

      const paidAmount = verifyData.data.amount / 100;
      if (paidAmount !== totalAmount) throw new Error("Amount mismatch");

      let userId = context.user?.id ?? null;

      if (!userId && shippingAddress.email) {
        let existingUser = await userModel.findOne({
          email: shippingAddress.email,
        });

        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          existingUser = await userModel.create({
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            password: hashedPassword,
            role: "user",
          });
          sendWelcomeEmail(
            shippingAddress.name,
            shippingAddress.email,
            randomPassword,
          );
        }

        userId = existingUser._id;
      }

      const order = await orderModel.create({
        user: userId,
        items,
        shippingAddress,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod: "Paystack",
        paymentReference: reference,
        isPaid: true,
        paidAt: new Date(),
        status: "Processing",
      });

      return formatOrder(order);
    },

    updateOrderStatus: async (
      _: unknown,
      { id, status }: { id: string; status: string },
      context: any,
    ) => {
      await connectDB();
      if (!context.user || !["admin", "superadmin"].includes(context.user.role))
        throw new Error("Unauthorized");
      const order = await orderModel.findById(id);
      if (!order) throw new Error("Order not found");
      order.status = status;
      if (status === "Delivered") order.deliveredAt = new Date();
      await order.save();
      return formatOrder(order);
    },
  },
};
