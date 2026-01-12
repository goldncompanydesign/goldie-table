import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "회사 자리표",
  description: "회사 사무실 자리표 편집기",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
