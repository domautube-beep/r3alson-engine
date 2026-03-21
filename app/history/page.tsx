import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-4 border-b" style={{ borderColor: "#2A2A4A" }}>
        <Link href="/" className="mr-3 text-lg" style={{ color: "#9CA3AF" }}>&#8592;</Link>
        <h1 className="text-lg font-bold">히스토리</h1>
      </header>

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">{"\uD83C\uDFB5"}</span>
          <p className="font-semibold text-lg mb-2">아직 만든 곡이 없어요</p>
          <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
            첫 곡을 만들면 여기에 기록됩니다
          </p>
          <Link
            href="/create"
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: "linear-gradient(to right, #8B5CF6, #EC4899)" }}
          >
            첫 곡 만들기
          </Link>
        </div>
      </main>

      {/* 하단 탭바 */}
      <nav
        className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-around z-20 border-t"
        style={{ backgroundColor: "#0A0A0A", borderColor: "#2A2A4A" }}
      >
        <Link href="/" className="flex flex-col items-center gap-1" style={{ color: "#9CA3AF" }}>
          <span className="text-lg">{"\uD83C\uDFE0"}</span>
          <span className="text-[10px]">트렌드</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1" style={{ color: "#8B5CF6" }}>
          <span className="text-lg">{"\uD83D\uDCCB"}</span>
          <span className="text-[10px]">히스토리</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1" style={{ color: "#9CA3AF" }}>
          <span className="text-lg">{"\u2699\uFE0F"}</span>
          <span className="text-[10px]">설정</span>
        </Link>
      </nav>
    </div>
  );
}
