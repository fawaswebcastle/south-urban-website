import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "South Urban — Agro Multi State Co-operative Society Ltd.",
  description:
    "A member-owned agro multi-state cooperative society serving farming communities across Kerala and Tamil Nadu with credit, inputs, marketing and training.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      {/* Header and footer are in app/(site)/layout.tsx, so /admin does not
          inherit the public site's chrome. */}
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">
        {children}
      </body>
    </html>
  );
}

