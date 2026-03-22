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
async function loadTrends(): Promise<TrendsResponse | null> {
  try {
    var baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    var res = await fetch(baseUrl + "/api/trends", {
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
  var trends: TrendItem[] = data?.trends || [];
  var isLive = data?.isLive || false;
  var topTrend = trends[0] || null;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#000000" }}>

      {/* ── 헤더 (Apple Navigation Bar 스타일) ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between"
        style={{
          padding: "12px 20px 10px 20px",
          backgroundColor: "rgba(0, 0, 0, 0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "0.5px solid rgba(84, 84, 88, 0.65)"
        }}
      >
        {/* Large Title 스타일 */}
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              color: "#FFFFFF",
              lineHeight: "1.2"
            }}
          >
            HitCraft
          </h1>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "400",
              color: "rgba(235, 235, 245, 0.4)",
              letterSpacing: "0.03em",
              marginTop: "1px"
            }}
          >
            AI Music Hit Maker
          </p>
        </div>

        {/* 설정 버튼 — SF Symbol 스타일의 미니멀 아이콘 버튼 */}
        <Link
          href="/settings"
          className="flex items-center justify-center"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(120, 120, 128, 0.24)",
            color: "rgba(235, 235, 245, 0.6)"
          }}
          aria-label="설정"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
          </svg>
        </Link>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main style={{ flex: 1, padding: "0 0 140px 0" }}>

        {/* API 키 미설정 배너 */}
        <div style={{ padding: "16px 20px 0 20px" }}>
          <ApiKeyBanner />
        </div>

        {/* Spotify 연결 상태 배너 — Apple 인라인 알림 스타일 */}
        {!isLive && (
          <div
            style={{
              margin: "12px 20px 0 20px",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(120, 120, 128, 0.18)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(235,235,245,0.4)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: "13px", color: "rgba(235, 235, 245, 0.5)", lineHeight: "1.4" }}>
              샘플 데이터 표시 중.{" "}
              <span style={{ color: "#8B5CF6" }}>SPOTIFY_CLIENT_ID</span> 설정 시 실시간 전환
            </p>
          </div>
        )}

        {isLive && (
          <div
            style={{
              margin: "12px 20px 0 20px",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(48, 209, 88, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#30D158",
                flexShrink: 0
              }}
            />
            <p style={{ fontSize: "13px", color: "#30D158", fontWeight: "500" }}>
              Spotify 실시간 연결 · 24시간마다 갱신
            </p>
          </div>
        )}

        {/* ── 히어로 카드: 이번 주 추천 ── */}
        {topTrend && (
          <section style={{ padding: "24px 20px 0 20px" }} className="fade-in">

            {/* 섹션 레이블 — Apple 스타일 */}
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(235, 235, 245, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "10px"
              }}
            >
              이번 주 추천
            </p>

            {/* 카드 — Apple 그룹 배경 #1C1C1E */}
            <div
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: "16px",
                padding: "20px",
                overflow: "hidden",
                position: "relative"
              }}
            >
              {/* accent 세로 라인 (Apple Music 현재 재생 중 스타일) */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: 0,
                  width: "3px",
                  height: "40px",
                  backgroundColor: "#8B5CF6",
                  borderRadius: "0 2px 2px 0"
                }}
              />

              <div style={{ paddingLeft: "4px" }}>
                {/* 성장률 */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: topTrend.growth > 0 ? "#30D158" : "rgba(235,235,245,0.4)",
                      fontVariantNumeric: "tabular-nums"
                    }}
                  >
                    {topTrend.growth > 0 ? "+" : ""}{topTrend.growth}%
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(235, 235, 245, 0.4)" }}>
                    성장 중
                  </span>
                  {topTrend.dataSource === "spotify" && topTrend.spotifyPopularity !== undefined && (
                    <span
                      className="apple-badge"
                      style={{
                        backgroundColor: "rgba(30, 215, 96, 0.12)",
                        color: "#30D158",
                        marginLeft: "auto"
                      }}
                    >
                      {topTrend.spotifyPopularity}/100
                    </span>
                  )}
                </div>

                {/* 장르명 — Title 2 */}
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    letterSpacing: "-0.3px",
                    marginBottom: "8px"
                  }}
                >
                  {topTrend.genre}
                </h2>

                {/* 설명 — Body */}
                <p
                  style={{
                    fontSize: "15px",
                    color: "rgba(235, 235, 245, 0.6)",
                    lineHeight: "1.5",
                    marginBottom: "14px"
                  }}
                >
                  {topTrend.mood.slice(0, 2).join(" · ")} 무드. {topTrend.tip}
                </p>

                {/* 무드 태그 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {topTrend.mood.slice(0, 3).map(function (m) {
                    return (
                      <span key={m} className="mood-chip">
                        {m}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 빈 상태 ── */}
        {trends.length === 0 && (
          <section style={{ padding: "24px 20px 0 20px" }} className="fade-in">
            <div
              style={{
                backgroundColor: "#1C1C1E",
                borderRadius: "16px",
                padding: "40px 20px",
                textAlign: "center"
              }}
            >
              <p style={{ fontSize: "15px", color: "rgba(235, 235, 245, 0.3)", lineHeight: "1.6" }}>
                트렌드 데이터를 불러오는 중입니다.
                <br />잠시 후 새로고침 해주세요.
              </p>
            </div>
          </section>
        )}

        {/* ── 장르 트렌드 리스트 (Apple Music 트랙 리스트 스타일) ── */}
        {trends.length > 0 && (
          <section style={{ padding: "28px 0 0 0" }}>

            {/* 섹션 레이블 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                marginBottom: "10px"
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "rgba(235, 235, 245, 0.5)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                }}
              >
                장르 트렌드
              </p>
              {isLive && (
                <span style={{ fontSize: "12px", color: "rgba(235, 235, 245, 0.3)" }}>
                  실시간
                </span>
              )}
            </div>

            {/* 리스트 컨테이너 — Apple Inset Grouped 스타일 */}
            <div
              style={{
                margin: "0 20px",
                backgroundColor: "#1C1C1E",
                borderRadius: "16px",
                overflow: "hidden"
              }}
            >
              {trends.map(function (trend, index) {
                var isPositive = trend.growth > 0;
                var barWidth = Math.min(Math.abs(trend.growth) * 4.5, 100);
                var isFirst = index === 0;
                var isLast = index === trends.length - 1;
                var delayClass = "fade-in stagger-" + Math.min(index + 1, 5);

                return (
                  <div
                    key={trend.genre}
                    className={delayClass}
                    style={{ animationFillMode: "both" }}
                  >
                    {/* 리스트 아이템 */}
                    <div
                      className="apple-list-item"
                      style={{
                        padding: "14px 16px",
                        cursor: "pointer"
                      }}
                    >
                      {/* 상단 행: 번호 + 장르명 + 성장률 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {/* 순위 번호 */}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "500",
                              color: isFirst ? "#8B5CF6" : "rgba(235, 235, 245, 0.3)",
                              minWidth: "16px",
                              textAlign: "center",
                              fontVariantNumeric: "tabular-nums"
                            }}
                          >
                            {index + 1}
                          </span>
                          <span
                            style={{
                              fontSize: "17px",
                              fontWeight: isFirst ? "600" : "400",
                              color: "#FFFFFF",
                              letterSpacing: "-0.2px"
                            }}
                          >
                            {trend.genre}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {/* Spotify popularity */}
                          {trend.dataSource === "spotify" && trend.spotifyPopularity !== undefined && (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "rgba(30, 215, 96, 0.7)"
                              }}
                            >
                              {trend.spotifyPopularity}
                            </span>
                          )}
                          {/* 성장률 */}
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: isPositive ? "#30D158" : "rgba(235, 235, 245, 0.4)",
                              fontVariantNumeric: "tabular-nums"
                            }}
                          >
                            {isPositive ? "+" : ""}{trend.growth}%
                          </span>
                        </div>
                      </div>

                      {/* 트렌드 바 — 단색 accent */}
                      <div
                        style={{
                          height: "2px",
                          borderRadius: "1px",
                          backgroundColor: "rgba(84, 84, 88, 0.4)",
                          marginBottom: "10px"
                        }}
                      >
                        <div
                          className="trend-bar"
                          style={{
                            height: "100%",
                            borderRadius: "1px",
                            width: barWidth + "%",
                            backgroundColor: isPositive ? "#8B5CF6" : "rgba(84, 84, 88, 0.6)"
                          }}
                        />
                      </div>

                      {/* 하단 행: 무드 태그 + listeners */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          {trend.mood.slice(0, 2).map(function (m) {
                            return (
                              <span key={m} className="mood-chip" style={{ fontSize: "12px", padding: "3px 9px" }}>
                                {m}
                              </span>
                            );
                          })}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "rgba(235, 235, 245, 0.3)",
                            whiteSpace: "nowrap",
                            marginLeft: "8px"
                          }}
                        >
                          {trend.listeners}
                        </span>
                      </div>
                    </div>

                    {/* Apple 구분선 — 마지막 아이템 제외 */}
                    {!isLast && (
                      <div className="apple-list-separator" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ── 플로팅 CTA 버튼 (탭바 위) — Apple filled button ── */}
      <div
        style={{
          position: "fixed",
          bottom: "calc(64px + env(safe-area-inset-bottom, 0px) + 12px)",
          left: "20px",
          right: "20px",
          zIndex: "30"
        }}
      >
        <Link
          href="/create"
          className="glow-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "50px",
            borderRadius: "14px",
            fontSize: "17px",
            fontWeight: "600",
            letterSpacing: "-0.3px",
            color: "#FFFFFF",
            textDecoration: "none",
            /* Apple 버튼 그림자 — 아주 은은하게 */
            boxShadow: "0 2px 12px rgba(139, 92, 246, 0.3)"
          }}
        >
          새 곡 만들기
        </Link>
      </div>

      {/* 하단 탭바 */}
      <BottomNav />
    </div>
  );
}
