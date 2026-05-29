import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import subscriberModel from "@/src/models/Subscriber";
import { rateLimit, clientIp } from "@/src/lib/rateLimit";

// Basic email shape check.
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  try {
    const { email, website } = await req.json();

    // Honeypot — silently accept bot submissions without storing them.
    if (website) return NextResponse.json({ ok: true });

    if (!rateLimit(`subscribe:${clientIp(req)}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    if (!email || !isEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }

    await connectDB();

    // Upsert so re-subscribing is idempotent (no duplicate-key error).
    await subscriberModel.updateOne(
      { email: email.toLowerCase().trim() },
      { $setOnInsert: { email: email.toLowerCase().trim() } },
      { upsert: true },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
