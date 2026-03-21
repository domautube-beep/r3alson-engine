import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-4 border-b" style={{ borderColor: "#2A2A4A" }}>
        <Link href="/" className="mr-3 text-lg" style={{ color: "#9CA3AF" }}>&#8592;</Link>
        <h1 className="text-lg font-bold">설정</h1>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* 아티스트 정보 */}
        <section className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
          <h2 className="font-semibold mb-4">아티스트 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: "#9CA3AF" }}>아티스트명</label>
              <input
                type="text"
                defaultValue="R3ALSON"
                className="w-full p-3 rounded-xl border text-sm"
                style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: "#9CA3AF" }}>주요 장르</label>
              <input
                type="text"
                defaultValue="Lo-Fi, R&B, Dark Ambient"
                className="w-full p-3 rounded-xl border text-sm"
                style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
              />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: "#9CA3AF" }}>가사 언어</label>
              <select
                defaultValue="en"
                className="w-full p-3 rounded-xl border text-sm"
                style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
              >
                <option value="en">영어</option>
                <option value="ko">한국어</option>
                <option value="both">영어 + 한국어</option>
              </select>
            </div>
          </div>
        </section>

        {/* 앱 정보 */}
        <section className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
          <h2 className="font-semibold mb-2">R3ALSON Engine</h2>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>v1.0.0 MVP</p>
          <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
            데이터 기반 AI 음악 히트메이커. 트렌드 분석 + 수노 프롬프트 최적화 + 가사 생성 + SEO 메타데이터.
          </p>
        </section>
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
        <Link href="/history" className="flex flex-col items-center gap-1" style={{ color: "#9CA3AF" }}>
          <span className="text-lg">{"\uD83D\uDCCB"}</span>
          <span className="text-[10px]">히스토리</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1" style={{ color: "#8B5CF6" }}>
          <span className="text-lg">{"\u2699\uFE0F"}</span>
          <span className="text-[10px]">설정</span>
        </Link>
      </nav>
    </div>
  );
}
