import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goldie Agent Scheduler",
  description: "Gold market daily report automation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
