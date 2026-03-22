import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
    <html lang="ko" className={"h-full antialiased dark " + notoSansKR.className}>
      <body className="min-h-full flex flex-col bg-[#050508] text-[#F0F0F5]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
