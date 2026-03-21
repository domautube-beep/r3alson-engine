import { NextRequest, NextResponse } from "next/server";

// 수노 프롬프트 최적화 엔진
function optimizePrompt(genre: string, moods: string[], bpm: number, vocal: string, instruments: string[]): string {
  // 7재료 공식: [장르]+[템포]+[무드]+[악기]+[보컬]+[분위기]+[길이]
  var moodStr = moods.join(", ").toLowerCase();
  var genreLower = genre.toLowerCase();

  // 장르별 기본 악기 (사용자가 선택 안 했을 때 폴백)
  var defaultInstrumentMap: Record<string, string> = {
    "dark ambient": "atmospheric pads, distant reverb, drone bass, field recordings",
    "lo-fi hip hop": "vinyl crackle, jazz piano samples, mellow drum loops, warm bass",
    "ethereal pop": "shimmering synths, reverb vocals, soft drums, ethereal pads",
    "study / deep focus": "minimal piano, soft ambient textures, gentle strings",
    "cinematic orchestral": "full orchestra, strings, brass, epic percussion, choir",
    "synthwave": "analog synths, arpeggios, gated reverb drums, retro bass",
    "trap": "808 bass, trap hi-hats, dark synths, rolling snares",
    "r&b": "smooth keys, warm bass, soft drums, lush pads",
    "indie folk": "acoustic guitar, fingerpicking, soft percussion, harmonica",
    "jazz": "piano, upright bass, brushed drums, saxophone"
  };

  // 사용자 선택 악기 > 기본 악기
  var instStr = instruments.length > 0
    ? instruments.join(", ").toLowerCase()
    : (defaultInstrumentMap[genreLower] || "atmospheric pads, gentle melody");

  // 보컬 처리
  var vocalStr = vocal ? vocal.toLowerCase() : "";

  // 수노 최적화: 장르를 먼저, 무드를 뒤에
  var parts = [genreLower, moodStr, bpm + " BPM", instStr];
  if (vocalStr) parts.push(vocalStr);
  parts.push("2:45");

  return parts.join(", ");
}

// ===== 금지 단어 시스템 =====
// 가사에 절대 사용하지 않는 단어 + 유사어/관련어
var BANNED_WORDS: { word: string; similar: string[]; replacement: string }[] = [
  {
    word: "neon",
    similar: ["neons", "neon-lit", "neon-soaked", "neon glow", "neon sign", "neon light", "fluorescent"],
    replacement: "pale"
  },
  {
    word: "번져",
    similar: ["번지다", "번진", "번지는", "번져가", "번져서", "퍼져", "퍼지다", "퍼진", "스며들어", "흘러내려"],
    replacement: "사라져"
  }
];

// 금지 단어 필터 — 가사에서 금지 단어와 유사어를 모두 대체
function filterBannedWords(lyrics: string): string {
  var filtered = lyrics;

  for (var i = 0; i < BANNED_WORDS.length; i++) {
    var ban = BANNED_WORDS[i];
    // 메인 단어 대체
    var mainRegex = new RegExp(ban.word, "gi");
    filtered = filtered.replace(mainRegex, ban.replacement);

    // 유사어 대체
    for (var j = 0; j < ban.similar.length; j++) {
      var simRegex = new RegExp(ban.similar[j], "gi");
      filtered = filtered.replace(simRegex, ban.replacement);
    }
  }

  return filtered;
}

// 금지 단어 검증 — 필터 후에도 남아있는지 최종 확인
function validateLyrics(lyrics: string): { clean: boolean; found: string[] } {
  var found: string[] = [];

  for (var i = 0; i < BANNED_WORDS.length; i++) {
    var ban = BANNED_WORDS[i];
    if (lyrics.toLowerCase().indexOf(ban.word.toLowerCase()) !== -1) {
      found.push(ban.word);
    }
    for (var j = 0; j < ban.similar.length; j++) {
      if (lyrics.toLowerCase().indexOf(ban.similar[j].toLowerCase()) !== -1) {
        found.push(ban.similar[j]);
      }
    }
  }

  return { clean: found.length === 0, found: found };
}

// 데모 가사 생성 (Claude API 연동 전 임시)
function generateDemoLyrics(genre: string, moods: string[], theme: string): string {
  var moodLower = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";

  if (!theme) {
    theme = "midnight thoughts";
  }

  // 장르+무드별 가사 템플릿
  var lyrics = "[Verse 1]\n";

  if (moodLower === "melancholic" || moodLower === "dark" || moodLower === "eerie") {
    lyrics += "empty streets below my window\nshadows dancing with the rain\nevery echo tells a story\nof a love I can't explain\n\n";
    lyrics += "[Chorus]\nfade into the hollow night\nwhere the stars forget to shine\nI'll be waiting in the silence\nat the edge of space and time\n\n";
    lyrics += "[Verse 2]\ndim lights through foggy glass\nwhispers carried by the wind\nevery moment feels like falling\nthrough a dream that never ends\n\n";
    lyrics += "[Chorus]\nfade into the hollow night\nwhere the stars forget to shine\nI'll be waiting in the silence\nat the edge of space and time\n\n";
    lyrics += "[Bridge]\nmaybe tomorrow brings the answer\nmaybe silence is the key\nin this ocean of forever\nyou're the only thing I see\n\n";
    lyrics += "[Outro]\nfade away... fade away...\ninto the hollow night";
  } else if (moodLower === "chill" || moodLower === "peaceful" || moodLower === "dreamy") {
    lyrics += "golden light through morning haze\ncoffee steam and quiet days\nno rush no noise just breathing slow\nletting all the worries go\n\n";
    lyrics += "[Chorus]\nfloating on a gentle breeze\nunder soft and swaying trees\nthis is where I want to be\njust the sky the earth and me\n\n";
    lyrics += "[Verse 2]\nraindrops tapping on the glass\nmoments meant to always last\nbook in hand and thoughts drift free\nthis is my serenity\n\n";
    lyrics += "[Chorus]\nfloating on a gentle breeze\nunder soft and swaying trees\nthis is where I want to be\njust the sky the earth and me";
  } else {
    lyrics += "running through the city lights\nchasing stars through endless nights\nevery beat a brand new start\nmusic playing in my heart\n\n";
    lyrics += "[Chorus]\nwe are the dreamers of the dawn\nkeep on moving keep on strong\nnothing's gonna hold us down\nwe own this sound we own this town\n\n";
    lyrics += "[Verse 2]\nturning pages writing songs\nfinding where we both belong\nlouder than the thunder cries\nwe're alive we're gonna rise\n\n";
    lyrics += "[Chorus]\nwe are the dreamers of the dawn\nkeep on moving keep on strong\nnothing's gonna hold us down\nwe own this sound we own this town";
  }

  return lyrics;
}

// 데모 제목 생성
function generateDemoTitle(genre: string, moods: string[]): string {
  var titles: Record<string, string[]> = {
    "melancholic": ["Hollow Echo", "3AM Reverie", "The Last Signal", "Fade to Silence"],
    "chill": ["Coffee Clouds", "Sunday Drift", "Golden Haze", "Morning Calm"],
    "dreamy": ["Velvet Sky", "Moonlit Waves", "Pastel Dreams", "Floating"],
    "eerie": ["Shadow Frequency", "Void Signal", "Dark Pulse", "Ghost Circuit"],
    "nostalgic": ["Polaroid Days", "Rewind", "Cassette Memories", "Old Film"],
    "cinematic": ["Opening Credits", "Final Scene", "The Arrival", "Horizon Line"],
    "energetic": ["Midnight Rush", "Full Throttle", "Electric Pulse", "Overdrive"]
  };

  var moodKey = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var options = titles[moodKey] || titles["melancholic"];
  return options[Math.floor(Math.random() * options.length)];
}

export async function POST(request: NextRequest) {
  var body = await request.json();
  var { genre, moods, bpm, vocal, instruments, lyricsMode, lyricsTheme } = body;

  // 프롬프트 생성 (수노 최적화 — 보컬/악기 포함)
  var prompt = optimizePrompt(genre, moods, bpm, vocal || "", instruments || []);

  // 가사 생성
  var lyrics = "";
  if (lyricsMode === "ai" || lyricsMode === "hybrid") {
    // TODO: Claude API 연동 시 여기를 교체
    lyrics = generateDemoLyrics(genre, moods, lyricsTheme);

    // 금지 단어 필터 적용
    lyrics = filterBannedWords(lyrics);

    // 최종 검증
    var validation = validateLyrics(lyrics);
    if (!validation.clean) {
      // 혹시 남아있으면 한 번 더 필터
      lyrics = filterBannedWords(lyrics);
    }
  }

  // 제목 + 태그 생성 (금지 단어 필터 적용)
  var title = filterBannedWords(generateDemoTitle(genre, moods));
  var genreTag = genre.toLowerCase().replace(/ /g, "");
  var moodTags = moods.map(function (m: string) { return "#" + m.toLowerCase(); }).join(" ");
  var tags = "#" + genreTag + " " + moodTags + " #newmusic #spotify #aimusic #r3alson";

  return NextResponse.json({
    prompt: prompt,
    lyrics: lyrics,
    title: title,
    tags: tags
  });
}
