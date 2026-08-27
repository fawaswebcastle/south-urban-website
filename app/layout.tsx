import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "South Urban — Agro Multi State Co-operative Society Ltd.",
  description:
    "A member-owned agro multi-state cooperative society serving farming communities across Kerala and Tamil Nadu with credit, inputs, marketing and training.",
  icons: {
    icon: "/logo_icon.png",
    shortcut: "/logo_icon.png",
    apple: "/logo_icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" type="image/png" href="/logo_icon.png" />
        <link rel="apple-touch-icon" href="/logo_icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Header and footer are in app/(site)/layout.tsx, so /admin does not
          inherit the public site's chrome. */}
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">
        {children}
      </body>
    </html>
  );
}

