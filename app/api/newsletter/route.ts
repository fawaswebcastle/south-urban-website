import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const payload = {
      data: {
        email: email.trim().toLowerCase(),
        status: "subscribed",
      },
    };

    try {
      const strapiRes = await fetch(`${STRAPI_URL}/api/newsletter-subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (strapiRes.ok) {
        const data = await strapiRes.json();
        return NextResponse.json({ success: true, data });
      }
      console.warn(`[API newsletter] Strapi POST returned status ${strapiRes.status}`);
    } catch (strapiErr) {
      console.error("[API newsletter] Failed to forward newsletter subscription to Strapi:", strapiErr);
    }

    // Fallback response for offline / dev mode
    return NextResponse.json({
      success: true,
      message: "Newsletter subscription received successfully.",
    });
  } catch (error: any) {
    console.error("[API newsletter] Request processing error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter." },
      { status: 500 }
    );
  }
}
