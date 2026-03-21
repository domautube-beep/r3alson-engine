import Link from "next/link";
import trendsData from "@/data/trends.json";

export default function Home() {
  var trends = trendsData.trends;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "#2A2A4A" }}>
        <div>
          <h1 className="text-xl font-bold" style={{ background: "linear-gradient(to right, #8B5CF6, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            R3ALSON Engine
          </h1>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>AI 음악 히트메이커</p>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "#1A1A2E", color: "#9CA3AF" }}
        >
          &#9881;
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-4 py-6 space-y-6 pb-40">
        {/* 트렌드 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">이번 주 트렌드</h2>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>
              {trendsData.updatedAt} 업데이트
            </span>
          </div>

          <div className="space-y-3">
            {trends.map(function (trend, index) {
              var isPositive = trend.growth > 0;
              var barWidth = Math.min(Math.abs(trend.growth) * 5, 100);
              var emoji = index === 0 ? "\uD83D\uDD25" : (isPositive ? "\uD83D\uDCC8" : "\u2796");

              return (
                <div
                  key={trend.genre}
                  className="rounded-2xl p-4 border transition-colors"
                  style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <span className="font-semibold">{trend.genre}</span>
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: isPositive ? "#10B981" : "#6B7280" }}
                    >
                      {isPositive ? "+" : ""}{trend.growth}%
                    </span>
                  </div>

                  {/* 성장 바 */}
                  <div className="h-1.5 rounded-full mb-2" style={{ backgroundColor: "#0A0A0A" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: barWidth + "%",
                        background: isPositive ? "linear-gradient(to right, #8B5CF6, #EC4899)" : "#4B5563"
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs" style={{ color: "#9CA3AF" }}>
                    <span>청취자 {trend.listeners}</span>
                    <span>BPM {trend.avgBpm}</span>
                    <span>{trend.difficulty}</span>
                  </div>

                  {/* 무드 태그 */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {trend.mood.map(function (m) {
                      return (
                        <span
                          key={m}
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: "rgba(139, 92, 246, 0.1)",
                            color: "#8B5CF6",
                            border: "1px solid rgba(139, 92, 246, 0.2)"
                          }}
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 추천 */}
        <section
          className="rounded-2xl p-4 border"
          style={{
            background: "linear-gradient(to right, rgba(139,92,246,0.1), rgba(236,72,153,0.1))",
            borderColor: "rgba(139, 92, 246, 0.2)"
          }}
        >
          <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>AI 추천</p>
          <p className="font-semibold">
            Dark Ambient가 지금 가장 뜨고 있어요
          </p>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
            Melancholic + Cinematic 무드와 어울리고, 진입 난이도도 낮아요
          </p>
        </section>
      </main>

      {/* 플로팅 CTA */}
      <div className="fixed bottom-20 left-4 right-4 z-10">
        <Link
          href="/create"
          className="flex items-center justify-center w-full py-4 rounded-2xl font-bold text-white text-lg"
          style={{
            background: "linear-gradient(to right, #8B5CF6, #EC4899)",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.3)"
          }}
        >
          + 새 곡 만들기
        </Link>
      </div>

      {/* 하단 탭바 */}
      <nav
        className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-around z-20 border-t"
        style={{ backgroundColor: "#0A0A0A", borderColor: "#2A2A4A" }}
      >
        <Link href="/" className="flex flex-col items-center gap-1" style={{ color: "#8B5CF6" }}>
          <span className="text-lg">{"\uD83C\uDFE0"}</span>
          <span className="text-[10px]">트렌드</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-1" style={{ color: "#9CA3AF" }}>
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
