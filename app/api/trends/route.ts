// 트렌드 데이터 API 엔드포인트
// GET /api/trends
// - SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET 설정 시: 실시간 Spotify 데이터
// - 미설정 시: data/trends.json 폴백 데이터 반환
// 24시간 캐시 (unstable_cache 사용)

import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchSpotifyTrends } from "@/lib/spotify";
import type { SpotifyTrendData } from "@/lib/spotify";
import trendsJson from "@/data/trends.json";

// 폴백 데이터를 SpotifyTrendData 형식으로 변환
function buildFallbackTrends(): SpotifyTrendData[] {
  return trendsJson.trends.map(function (t) {
    return {
      genre: t.genre,
      growth: t.growth,
      listeners: t.listeners,
      avgBpm: t.avgBpm,
      mood: t.mood,
      tip: t.tip,
      difficulty: t.difficulty,
      spotifyPopularity: 50, // 폴백이므로 중간값
      dataSource: "fallback" as const,
    };
  });
}

// 24시간 캐시로 감싼 트렌드 조회 함수
// unstable_cache: 서버 메모리에 결과를 저장, revalidate 초 이후 재조회
var getCachedTrends = unstable_cache(
  async function () {
    var fallback = buildFallbackTrends();
    var result = await fetchSpotifyTrends(fallback);
    return result;
  },
  ["spotify-trends"],
  {
    revalidate: 86400, // 24시간 (초 단위)
    tags: ["trends"],
  }
);

export async function GET() {
  try {
    var result = await getCachedTrends();

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      isLive: result.isLive,
      dataSource: result.isLive ? "spotify" : "fallback",
      message: result.isLive
        ? "Spotify 실시간 데이터"
        : "Spotify API 키를 .env.local에 설정하면 실시간 데이터를 볼 수 있습니다",
      trends: result.trends,
      topPromptPatterns: trendsJson.topPromptPatterns,
    });
  } catch (err) {
    console.error("[/api/trends] 오류:", err);

    // 오류 시 폴백 JSON 직접 반환
    return NextResponse.json(
      {
        updatedAt: trendsJson.updatedAt,
        isLive: false,
        dataSource: "fallback",
        message: "데이터 로드 중 오류가 발생했습니다. 캐시된 데이터를 표시합니다.",
        trends: buildFallbackTrends(),
        topPromptPatterns: trendsJson.topPromptPatterns,
      },
      { status: 200 } // 에러여도 200 반환 — UI는 항상 데이터를 받아야 함
    );
  }
}
