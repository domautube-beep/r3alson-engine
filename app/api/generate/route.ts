import { NextRequest, NextResponse } from "next/server";

// 수노 프롬프트 최적화 엔진
function optimizePrompt(genre: string, moods: string[], bpm: number): string {
  // 7재료 공식: [장르]+[템포]+[무드]+[악기]+[보컬]+[분위기]+[길이]
  var moodStr = moods.join(", ").toLowerCase();
  var genreLower = genre.toLowerCase();

  // 장르별 최적 악기/스타일 매핑
  var instrumentMap: Record<string, string> = {
    "dark ambient": "atmospheric pads, distant reverb, drone bass, field recordings",
    "lo-fi hip hop": "vinyl crackle, jazz piano samples, mellow drum loops, warm bass",
    "ethereal pop": "shimmering synths, reverb vocals, soft drums, ethereal pads",
    "study / deep focus": "minimal piano, soft ambient textures, gentle strings",
    "cinematic orchestral": "full orchestra, strings, brass, epic percussion, choir",
    "synthwave": "analog synths, arpeggios, gated reverb drums, retro bass"
  };

  var instruments = instrumentMap[genreLower] || "atmospheric pads, gentle melody";

  // 수노 최적화: 장르를 먼저, 무드를 뒤에, 구체적 디스크립터 사용
  var parts = [
    genreLower,
    moodStr,
    bpm + " BPM",
    instruments,
    "2:45"
  ];

  return parts.join(", ");
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
    lyrics += "[Verse 2]\nneon lights through foggy glass\nwhispers carried by the wind\nevery moment feels like falling\nthrough a dream that never ends\n\n";
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
    "energetic": ["Neon Rush", "Full Throttle", "Electric Pulse", "Overdrive"]
  };

  var moodKey = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var options = titles[moodKey] || titles["melancholic"];
  return options[Math.floor(Math.random() * options.length)];
}

export async function POST(request: NextRequest) {
  var body = await request.json();
  var { genre, moods, bpm, lyricsMode, lyricsTheme } = body;

  // 프롬프트 생성 (수노 최적화)
  var prompt = optimizePrompt(genre, moods, bpm);

  // 가사 생성
  var lyrics = "";
  if (lyricsMode === "ai" || lyricsMode === "hybrid") {
    // TODO: Claude API 연동 시 여기를 교체
    lyrics = generateDemoLyrics(genre, moods, lyricsTheme);
  }

  // 제목 + 태그 생성
  var title = generateDemoTitle(genre, moods);
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
