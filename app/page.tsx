import Link from "next/link";
import { ApiKeyBanner } from "@/components/api-key-banner";
import { BottomNav } from "@/components/bottom-nav";

// 트렌드 데이터 타입
interface TrendItem {
  genre: string;
  growth: number;
  listeners: string;
  avgBpm: string;
  mood: string[];
  tip: string;
  difficulty: string;
  spotifyPopularity?: number;
  dataSource?: "spotify" | "fallback";
}

interface TrendsResponse {
  updatedAt: string;
  isLive: boolean;
  dataSource: string;
  message: string;
  trends: TrendItem[];
}

// /api/trends에서 트렌드 데이터를 가져오는 서버 함수
// 실패 시 null 반환 → UI에서 폴백 메시지 표시
async function loadTrends(): Promise<TrendsResponse | null> {
  try {
    // 서버 컴포넌트에서 자체 API 호출 시 절대 URL 필요
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    var res = await fetch(baseUrl + "/api/trends", {
      // 24시간 캐시 (Next.js fetch 캐시)
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  var data = await loadTrends();

  // API 완전 실패 시 빈 배열로 처리
  var trends: TrendItem[] = data?.trends || [];
  var isLive = data?.isLive || false;
  var topTrend = trends[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-glow">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-5 py-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gradient">
            HitCraft
          </h1>
          <p className="text-[11px] tracking-widest uppercase" style={{ color: "#6E6E88" }}>
            AI Music Hit Maker
          </p>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ backgroundColor: "#1A1A28", color: "#A0A0B8" }}
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

        {/* Spotify API 미연결 안내 배너 */}
        {!isLive && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-xs"
            style={{
              backgroundColor: "rgba(139, 92, 246, 0.06)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
              color: "#6E6E88",
            }}
          >
            <span style={{ color: "#8B5CF6" }}>현재 샘플 데이터</span>
            {" "}표시 중. .env.local에 SPOTIFY_CLIENT_ID와 SPOTIFY_CLIENT_SECRET를 설정하면 실시간 트렌드가 활성화됩니다.
          </div>
        )}

        {/* Spotify 실시간 연결 표시 */}
        {isLive && (
          <div
            className="mb-4 px-4 py-3 rounded-2xl text-xs flex items-center gap-2"
            style={{
              backgroundColor: "rgba(52, 211, 153, 0.06)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              color: "#34D399",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: "#34D399" }}
            />
            Spotify 실시간 데이터 연결됨 · 24시간마다 갱신
          </div>
        )}

        {/* 히어로 추천 카드 */}
        {topTrend && (
          <section className="mb-8 fade-in">
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(236,72,153,0.12) 50%, rgba(139,92,246,0.08) 100%)",
                border: "1px solid rgba(139, 92, 246, 0.28)"
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
                <h2 className="text-xl font-bold mb-2">{topTrend.genre}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#A0A0B8" }}>
                  {topTrend.growth > 0 ? "+" : ""}{topTrend.growth}% 성장 중. {topTrend.mood.slice(0, 2).join(" + ")} 무드.
                  <br />{topTrend.tip}
                </p>
                <div className="flex gap-2 mt-4">
                  {topTrend.mood.slice(0, 3).map(function (m) {
                    return <span key={m} className="mood-chip">{m}</span>;
                  })}
                </div>
                {/* Spotify 데이터일 때 popularity 뱃지 표시 */}
                {topTrend.dataSource === "spotify" && topTrend.spotifyPopularity !== undefined && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-[10px]" style={{ color: "#6E6E88" }}>Spotify Popularity</span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(30, 215, 96, 0.12)", color: "#1ED760" }}
                    >
                      {topTrend.spotifyPopularity}/100
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 데이터 없을 때 빈 상태 */}
        {trends.length === 0 && (
          <section className="mb-8 fade-in">
            <div
              className="rounded-3xl p-6 text-center"
              style={{
                backgroundColor: "#1A1A28",
                border: "1px solid #2A2A3E",
              }}
            >
              <p className="text-sm" style={{ color: "#6E6E88" }}>
                트렌드 데이터를 불러오는 중입니다.
                <br />잠시 후 새로고침 해주세요.
              </p>
            </div>
          </section>
        )}

        {/* 트렌드 리스트 */}
        {trends.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest" style={{ color: "#6E6E88" }}>
                장르 트렌드
              </h3>
              {isLive && (
                <span className="text-[10px]" style={{ color: "#6E6E88" }}>
                  실시간
                </span>
              )}
            </div>

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
                        {/* Spotify popularity 뱃지 (실시간 데이터일 때) */}
                        {trend.dataSource === "spotify" && trend.spotifyPopularity !== undefined && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "rgba(30, 215, 96, 0.08)", color: "#1ED760" }}
                          >
                            {trend.spotifyPopularity}
                          </span>
                        )}
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: isPositive ? "rgba(52, 211, 153, 0.1)" : "rgba(122, 122, 142, 0.1)",
                            color: isPositive ? "#34D399" : "#A0A0B8"
                          }}
                        >
                          {isPositive ? "+" : ""}{trend.growth}%
                        </span>
                      </div>
                    </div>

                    {/* 트렌드 바 */}
                    <div className="h-[3px] rounded-full mb-3" style={{ backgroundColor: "#2A2A3E" }}>
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
                      <span className="text-[11px]" style={{ color: "#6E6E88" }}>
                        {trend.listeners} listeners
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
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

      {/* 하단 탭바 + AI 상태 */}
      <BottomNav />
    </div>
  );
}
