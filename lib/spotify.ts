// Spotify Web API 클라이언트
// Client Credentials Flow 사용 — 유저 로그인 불필요, 서버 간 인증

var SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
var SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// 장르별 대표 플레이리스트 ID 목록
// Spotify 공식 플레이리스트 + 인기 큐레이션 플레이리스트로 구성
var GENRE_PLAYLISTS: Record<string, string[]> = {
  "Dark Ambient": [
    "37i9dQZF1DX3Ogo9pFvBkY", // Dark & Stormy
    "37i9dQZF1DWVFeEut75IAL", // Atmospheric Calm
    "37i9dQZF1DX4wta20PHG0o", // Night Ambient
  ],
  "Lo-Fi Hip Hop": [
    "37i9dQZF1DWWQRwui0ExPn", // lofi beats
    "37i9dQZF1DX4sWSpwq3LiO", // Peaceful Piano
    "37i9dQZF1DX8Uebhn9wzrS", // Chill Lofi Study Beats
  ],
  "Ethereal Pop": [
    "37i9dQZF1DX4E3UdUs7fUx", // Ethereal
    "37i9dQZF1DWTx0xog3gf2O", // Dream Pop
    "37i9dQZF1DX1rVvRgjX59F", // Bedroom Pop
  ],
  "Study / Deep Focus": [
    "37i9dQZF1DWZeKCadgRdKQ", // Deep Focus
    "37i9dQZF1DX9sIqqvKsjEu", // Intense Studying
    "37i9dQZF1DX8NTLI2TtZa6", // Focus Flow
  ],
  "Cinematic Orchestral": [
    "37i9dQZF1DX4OzrY981I1W", // Cinematic Soundscapes
    "37i9dQZF1DWZBCPUIUs2iR", // Epic Orchestra
    "37i9dQZF1DWVZu4bSuGnTt", // Movie Soundtracks
  ],
  "Synthwave": [
    "37i9dQZF1DX6J5NfMJS675", // Synthwave Essentials
    "37i9dQZF1DX16zBqzmqNcy", // Retro Wave
    "37i9dQZF1DWUhcGhOcfANL", // Electric Afternoon
  ],
};

// Spotify Access Token 타입 정의
interface SpotifyToken {
  access_token: string;
  expires_at: number; // Unix timestamp (밀리초)
}

// 모듈 레벨 토큰 캐시 (서버 메모리에 저장)
var cachedToken: SpotifyToken | null = null;

// Spotify Client Credentials 토큰 발급/갱신
export async function getSpotifyToken(): Promise<string | null> {
  var clientId = process.env.SPOTIFY_CLIENT_ID;
  var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // 환경변수 미설정 시 null 반환
  if (!clientId || !clientSecret) {
    return null;
  }

  // 토큰이 유효하면 재사용 (만료 60초 전부터 갱신)
  var now = Date.now();
  if (cachedToken && cachedToken.expires_at - 60000 > now) {
    return cachedToken.access_token;
  }

  try {
    var credentials = Buffer.from(clientId + ":" + clientSecret).toString("base64");

    var res = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + credentials,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!res.ok) {
      console.error("[Spotify] 토큰 발급 실패:", res.status);
      return null;
    }

    var data = await res.json();

    cachedToken = {
      access_token: data.access_token,
      // expires_in은 초 단위 → 밀리초로 변환
      expires_at: Date.now() + data.expires_in * 1000,
    };

    return cachedToken.access_token;
  } catch (err) {
    console.error("[Spotify] 토큰 발급 오류:", err);
    return null;
  }
}

// 플레이리스트 정보(팔로워 수, 트랙 수) 조회
async function fetchPlaylistInfo(
  token: string,
  playlistId: string
): Promise<{ followers: number; trackCount: number } | null> {
  try {
    var res = await fetch(
      SPOTIFY_API_BASE + "/playlists/" + playlistId + "?fields=followers(total),tracks(total)",
      {
        headers: { Authorization: "Bearer " + token },
      }
    );

    if (!res.ok) return null;

    var data = await res.json();
    return {
      followers: data.followers?.total || 0,
      trackCount: data.tracks?.total || 0,
    };
  } catch {
    return null;
  }
}

// 장르별 최신 릴리즈 검색 (popularity 지수 수집)
async function fetchGenrePopularity(
  token: string,
  genre: string
): Promise<{ avgPopularity: number; releaseCount: number } | null> {
  try {
    // 장르명을 검색 쿼리에 맞게 변환
    var query = encodeURIComponent("genre:" + genre.toLowerCase().replace(" / ", " "));

    var res = await fetch(
      SPOTIFY_API_BASE + "/search?q=" + query + "&type=track&limit=20&market=US",
      {
        headers: { Authorization: "Bearer " + token },
      }
    );

    if (!res.ok) return null;

    var data = await res.json();
    var tracks: Array<{ popularity: number }> = data.tracks?.items || [];

    if (tracks.length === 0) return { avgPopularity: 0, releaseCount: 0 };

    var totalPopularity = tracks.reduce(function (sum: number, track: { popularity: number }) {
      return sum + (track.popularity || 0);
    }, 0);

    return {
      avgPopularity: Math.round(totalPopularity / tracks.length),
      releaseCount: data.tracks?.total || 0,
    };
  } catch {
    return null;
  }
}

// 장르 트렌드 데이터 타입
export interface SpotifyTrendData {
  genre: string;
  growth: number;           // 성장률 (popularity 기반, %)
  listeners: string;        // 추정 리스너 수 (팔로워 합산)
  avgBpm: string;           // 기존 JSON에서 유지
  mood: string[];           // 기존 JSON에서 유지
  tip: string;              // 기존 JSON에서 유지
  difficulty: string;       // 기존 JSON에서 유지
  spotifyPopularity: number; // Spotify popularity 지수 (0-100)
  dataSource: "spotify" | "fallback";
}

// 리스너 수를 읽기 쉬운 형식으로 변환
function formatListeners(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return String(count);
}

// popularity 지수를 성장률(%)로 변환
// 기준: 50 = 0%, 70+ = +10%, 30- = -10% 등으로 정규화
function popularityToGrowth(popularity: number): number {
  // 50을 기준점으로 삼아 ±20 범위로 정규화
  var growth = Math.round((popularity - 50) * 0.4);
  // -20 ~ +20 사이로 클램프
  return Math.max(-20, Math.min(20, growth));
}

// 장르 1개의 실시간 트렌드 데이터 수집
async function fetchGenreTrendData(
  token: string,
  genre: string,
  fallbackData: SpotifyTrendData
): Promise<SpotifyTrendData> {
  var playlistIds = GENRE_PLAYLISTS[genre] || [];

  // 플레이리스트 팔로워 합산
  var totalFollowers = 0;
  var successCount = 0;

  for (var i = 0; i < playlistIds.length; i++) {
    var info = await fetchPlaylistInfo(token, playlistIds[i]);
    if (info) {
      totalFollowers += info.followers;
      successCount++;
    }
  }

  // popularity 지수 수집
  var popularityData = await fetchGenrePopularity(token, genre);

  if (successCount === 0 && !popularityData) {
    // Spotify 데이터 수집 실패 → 폴백 유지
    return { ...fallbackData, dataSource: "fallback" };
  }

  var avgPopularity = popularityData?.avgPopularity || 50;
  var growth = popularityToGrowth(avgPopularity);

  return {
    ...fallbackData,
    growth: growth,
    listeners: successCount > 0 ? formatListeners(totalFollowers) : fallbackData.listeners,
    spotifyPopularity: avgPopularity,
    dataSource: "spotify",
  };
}

// 전체 장르 트렌드 수집 (메인 함수)
export async function fetchSpotifyTrends(
  fallbackTrends: SpotifyTrendData[]
): Promise<{ trends: SpotifyTrendData[]; isLive: boolean }> {
  var token = await getSpotifyToken();

  // API 키 없으면 폴백 반환
  if (!token) {
    return {
      trends: fallbackTrends.map(function (t) {
        return { ...t, dataSource: "fallback" as const };
      }),
      isLive: false,
    };
  }

  var results: SpotifyTrendData[] = [];

  for (var i = 0; i < fallbackTrends.length; i++) {
    var genre = fallbackTrends[i].genre;
    var trendData = await fetchGenreTrendData(token, genre, fallbackTrends[i]);
    results.push(trendData);
  }

  // growth 기준 내림차순 정렬
  results.sort(function (a, b) {
    return b.growth - a.growth;
  });

  return { trends: results, isLive: true };
}
