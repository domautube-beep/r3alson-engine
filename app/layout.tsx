import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HitCraft — AI 음악 히트메이커",
  description: "데이터 기반 수노 프롬프트 + 가사 + 메타데이터 생성. 데이터 기반으로 돈 되는 곡을 만드는 AI 엔진.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full dark">
      <head>
        {/* Apple SF Pro 시스템 폰트 — 별도 로딩 불필요, CSS에서 -apple-system 사용 */}
        {/* Noto Sans KR 제거: 불필요한 로딩 → 시스템 폰트가 더 빠르고 Apple다움 */}
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          background: "#000000",
          color: "#FFFFFF",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif"
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
