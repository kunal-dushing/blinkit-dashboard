import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blinkit Outlet Insights",
  description: "Sales and outlet performance dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
