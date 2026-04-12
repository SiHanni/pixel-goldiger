import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Goldiger — 광부키우기",
  description: "귀여운 픽셀 방치형 광부 키우기 게임",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, overflow: "hidden", backgroundColor: "#000" }}>
        {children}
      </body>
    </html>
  );
}
