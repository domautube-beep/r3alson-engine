import Link from "next/link";
import trendsData from "@/data/trends.json";
import { ApiKeyBanner } from "@/components/api-key-banner";

export default function Home() {
  var trends = trendsData.trends;

  return (
    <div className="flex flex-col min-h-screen bg-glow">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 py-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient">
            HitCraft
          </h1>
          <p className="text-[11px] tracking-widest uppercase" style={{ color: "#4A4A5E" }}>
            AI Music Hit Maker
          </p>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: "#111118", color: "#7A7A8E" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>
        </Link>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-5 pb-44 relative z-10">

        {/* API 키 미설정 배너 */}
        <ApiKeyBanner />

        {/* 히어로 추천 카드 */}
        <section className="mb-8 fade-in">
          <div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.1) 50%, rgba(139,92,246,0.05) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.15)"
            }}
          >
            {/* 배경 글로우 */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
              style={{ background: "rgba(139, 92, 246, 0.15)" }}
            />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "#8B5CF6" }}>
                이번 주 추천
              </p>
              <h2 className="text-xl font-bold mb-2">Dark Ambient</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#7A7A8E" }}>
                +18% 성장 중. Melancholic + Cinematic 무드.
                <br />진입 난이도 낮고, 기능성 음악 시장에서 강세.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="mood-chip">Melancholic</span>
                <span className="mood-chip">Eerie</span>
                <span className="mood-chip">Cinematic</span>
              </div>
            </div>
          </div>
        </section>

        {/* 트렌드 리스트 */}
        <section>
          <h3 className="text-xs uppercase tracking-widest mb-4" style={{ color: "#4A4A5E" }}>
            장르 트렌드
          </h3>

          <div className="space-y-2.5">
            {trends.map(function (trend, index) {
              var isPositive = trend.growth > 0;
              var barWidth = Math.min(Math.abs(trend.growth) * 4.5, 100);
              var emoji = index === 0 ? "\uD83D\uDD25" : (isPositive ? "\uD83D\uDCC8" : "");
              var delayClass = "fade-in stagger-" + (index + 1);

              return (
                <div
                  key={trend.genre}
                  className={"glass-card p-4 cursor-pointer " + delayClass}
                  style={{ animationFillMode: "both" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {emoji && <span className="text-sm">{emoji}</span>}
                      <span className="font-semibold text-[15px]">{trend.genre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isPositive ? "rgba(52, 211, 153, 0.1)" : "rgba(122, 122, 142, 0.1)",
                          color: isPositive ? "#34D399" : "#7A7A8E"
                        }}
                      >
                        {isPositive ? "+" : ""}{trend.growth}%
                      </span>
                    </div>
                  </div>

                  {/* 트렌드 바 */}
                  <div className="h-[3px] rounded-full mb-3" style={{ backgroundColor: "rgba(30, 30, 46, 0.5)" }}>
                    <div
                      className="h-full rounded-full trend-bar"
                      style={{
                        width: barWidth + "%",
                        background: isPositive
                          ? "linear-gradient(90deg, #8B5CF6, #EC4899)"
                          : "#3F3F50"
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {trend.mood.slice(0, 3).map(function (m) {
                        return <span key={m} className="mood-chip">{m}</span>;
                      })}
                    </div>
                    <span className="text-[11px]" style={{ color: "#4A4A5E" }}>
                      {trend.listeners} listeners
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 플로팅 CTA */}
      <div className="fixed bottom-[76px] left-5 right-5 z-30">
        <Link
          href="/create"
          className="glow-btn flex items-center justify-center w-full py-4 rounded-2xl font-bold text-white text-[15px] tracking-wide"
        >
          + 새 곡 만들기
        </Link>
      </div>

      {/* 하단 탭바 */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-3"
        style={{
          backgroundColor: "rgba(5, 5, 8, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(30, 30, 46, 0.5)"
        }}
      >
        <Link href="/" className="flex flex-col items-center gap-0.5" style={{ color: "#8B5CF6" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"/></svg>
          <span className="text-[10px] font-medium">트렌드</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h4"/></svg>
          <span className="text-[10px] font-medium">히스토리</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span className="text-[10px] font-medium">설정</span>
        </Link>
      </nav>
    </div>
  );
}
