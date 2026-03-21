import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R3ALSON Engine — AI 음악 히트메이커",
  description: "데이터 기반 수노 프롬프트 + 가사 + 메타데이터 생성. 돈 되는 곡을 만드는 AI 엔진.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased dark">
      <body
        className="min-h-full flex flex-col bg-[#0A0A0A] text-[#E5E5E5]"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
