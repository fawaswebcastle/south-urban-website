import { NextResponse } from "next/server";

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 },
      );
    }

    const payload = {
      data: {
        name,
        email,
        subject: subject || "Website Contact Form Enquiry",
        message,
        status: "new",
      },
    };

    console.log(payload, "payload");

    try {
      const strapiRes = await fetch(`${STRAPI_URL}/api/enquiries`, {
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
      console.warn(
        `[API enquiries] Strapi POST returned status ${strapiRes.status}`,
      );
    } catch (strapiErr) {
      console.error(
        "[API enquiries] Failed to forward enquiry to Strapi:",
        strapiErr,
      );
    }

    // Fallback response for offline / dev mode
    return NextResponse.json({
      success: true,
      message: "Enquiry received successfully.",
    });
  } catch (error: any) {
    console.error("[API enquiries] Request processing error:", error);
    return NextResponse.json(
      { error: "Failed to process enquiry." },
      { status: 500 },
    );
  }
}
