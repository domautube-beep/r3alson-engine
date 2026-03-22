import { NextRequest, NextResponse } from "next/server";
import { LYRICS_SYSTEM_PROMPT, filterBannedWords, validateLyrics, buildLyricsPrompt } from "@/lib/lyrics-engine";
import { generateStylePrompt, SUNO_SYSTEM_PROMPT, buildFullSunoPrompt } from "@/lib/suno-prompt-engine";
import { callClaude, validateApiKeyFormat } from "@/lib/claude";

// ===== 데모 가사 (엔진 규칙 준수) =====
// DIRECT MODE / Scene Lock / Hook 2회 / () adlib / Show-don't-tell / Line 2-8 syllables
function generateDemoLyrics(genre: string, moods: string[], theme: string): string {
  var moodLower = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var isRap = genre.toLowerCase().indexOf("hip") !== -1 || genre.toLowerCase().indexOf("rap") !== -1 || genre.toLowerCase().indexOf("trap") !== -1 || genre.toLowerCase().indexOf("drill") !== -1;

  if (isRap) {
    return [
      "[Verse]",
      "step out the door",
      "cold air hit different",
      "watch on my wrist",
      "but I'm runnin out of minutes",
      "phone buzzin low",
      "same name I been missin",
      "told her I'd change",
      "guess that was fiction",
      "",
      "[Pre-Chorus]",
      "she left the key",
      "on the counter by the sink",
      "water still runnin",
      "I just stand and think",
      "",
      "[Hook]",
      "I don't chase (nah)",
      "I don't chase (uh-huh)",
      "but I keep your ghost",
      "in my empty space (yeah)",
      "I don't chase (nah)",
      "I don't chase",
      "but the door still open",
      "just in case",
      "",
      "[Verse]",
      "two cups on the table",
      "one been there for weeks",
      "your jacket on the chair",
      "still smellin like your streets",
      "I could throw it out",
      "but I hang it up instead",
      "actin like you comin back",
      "to lay beside my bed",
      "",
      "[Pre-Chorus]",
      "the faucet drips",
      "I let it count the time",
      "each drop a word",
      "I never said out loud",
      "",
      "[Hook]",
      "I don't chase (nah)",
      "I don't chase (uh-huh)",
      "but I keep your ghost",
      "in my empty space (yeah)",
      "I don't chase (nah)",
      "I don't chase",
      "but the door still open",
      "just in case",
      "",
      "[Bridge]",
      "maybe I should turn",
      "the handle and walk through",
      "pack the cup away",
      "let the water stop for you",
      "but my hand just rests",
      "on the frame and holds",
      "some doors close quiet",
      "some stay on hold",
      "",
      "[Hook]",
      "I don't chase (ooh)",
      "I don't chase",
      "but the door still open",
      "just in case (yeah)",
      "",
      "[Outro]",
      "(mm, mm)",
      "just in case"
    ].join("\n");
  }

  if (moodLower === "melancholic" || moodLower === "dark" || moodLower === "eerie" || moodLower === "haunting" || moodLower === "somber") {
    return [
      "[Verse]",
      "shoes by the door",
      "haven't moved in days",
      "coffee going cold",
      "on the window frame",
      "your voice in the hall",
      "just the pipes again",
      "I keep still",
      "like if I move you'll fade",
      "",
      "[Pre-Chorus]",
      "the radiator clicks",
      "three times then stops",
      "same rhythm you would knock",
      "before you turned the lock",
      "",
      "[Hook]",
      "hollow rooms (oh-oh)",
      "hollow rooms",
      "I built a home",
      "from what you left behind (ah)",
      "hollow rooms (oh-oh)",
      "hollow rooms",
      "the silence here",
      "still sounds like you and I",
      "",
      "[Verse]",
      "your book face down",
      "page forty-two",
      "I haven't touched it once",
      "that's your place to lose",
      "dust on the shelf",
      "drawing lines in gray",
      "I trace your name",
      "then wipe it all away",
      "",
      "[Pre-Chorus]",
      "the curtain moves",
      "I swear I feel the pull",
      "but it's just the draft",
      "crawling through the walls",
      "",
      "[Hook]",
      "hollow rooms (oh-oh)",
      "hollow rooms",
      "I built a home",
      "from what you left behind (ah)",
      "hollow rooms (oh-oh)",
      "hollow rooms",
      "the silence here",
      "still sounds like you and I",
      "",
      "[Bridge]",
      "I could paint the walls",
      "move the chair you loved",
      "fill the shelf with things",
      "that don't remind me of us",
      "but I just sit down",
      "where you used to be",
      "let the quiet hold me",
      "like a memory",
      "",
      "[Outro]",
      "hollow rooms (mm)",
      "(oh-oh)",
      "still sounds like you"
    ].join("\n");
  }

  if (moodLower === "chill" || moodLower === "peaceful" || moodLower === "dreamy" || moodLower === "calm" || moodLower === "serene") {
    return [
      "[Verse]",
      "bare feet on tile",
      "morning just arrived",
      "steam curls from the cup",
      "I hold it with both hands",
      "curtain pulls the light",
      "soft across the floor",
      "no alarm today",
      "just the birds outside my door",
      "",
      "[Pre-Chorus]",
      "the kettle sighs",
      "I pour another round",
      "sit where the sun hits",
      "let the warmth sit down",
      "",
      "[Hook]",
      "easy morning (ooh)",
      "easy morning",
      "no rush no sound",
      "just the light coming in (ah)",
      "easy morning (ooh)",
      "easy morning",
      "the whole world waits",
      "while I just breathe again",
      "",
      "[Verse]",
      "book open wide",
      "page I read twice",
      "not the words I need",
      "just the weight feels right",
      "cat on the sill",
      "watching something small",
      "we don't talk about it",
      "we just let it fall",
      "",
      "[Pre-Chorus]",
      "the clock ticks soft",
      "I stopped counting hours",
      "let the minutes melt",
      "like sugar into water",
      "",
      "[Hook]",
      "easy morning (ooh)",
      "easy morning",
      "no rush no sound",
      "just the light coming in (ah)",
      "easy morning (ooh)",
      "easy morning",
      "the whole world waits",
      "while I just breathe again",
      "",
      "[Bridge]",
      "maybe later",
      "I'll step outside",
      "feel the grass between my toes",
      "close my eyes",
      "but right now this chair",
      "this warmth this cup",
      "is every single thing",
      "I'm thinking of",
      "",
      "[Outro]",
      "easy morning (mm)",
      "(ooh)",
      "just breathe again"
    ].join("\n");
  }

  // 기본 (에너지/밝은 무드)
  return [
    "[Verse]",
    "laces tied tight",
    "hit the street at five",
    "headphones in",
    "the city's barely alive",
    "my shadow runs ahead",
    "like it knows the way",
    "heartbeat in my ears",
    "drowning out the day",
    "",
    "[Pre-Chorus]",
    "the stoplight flickers",
    "I don't break my stride",
    "green or red",
    "I'm crossing every line",
    "",
    "[Hook]",
    "on my wave (yeah)",
    "on my wave (woo)",
    "they can talk",
    "I'm already miles away (ooh)",
    "on my wave (yeah)",
    "on my wave",
    "catch me if you can",
    "but I don't slow my pace",
    "",
    "[Verse]",
    "sweat on my brow",
    "sun just breakin through",
    "passed the park bench",
    "where I used to sit and lose",
    "now I keep it movin",
    "feet don't hit the same",
    "every block behind me",
    "is a block I overcame",
    "",
    "[Pre-Chorus]",
    "my reflection blurs",
    "in the storefront glass",
    "I don't recognize",
    "who I was in the past",
    "",
    "[Hook]",
    "on my wave (yeah)",
    "on my wave (woo)",
    "they can talk",
    "I'm already miles away (ooh)",
    "on my wave (yeah)",
    "on my wave",
    "catch me if you can",
    "but I don't slow my pace",
    "",
    "[Bridge]",
    "I could stop and rest",
    "find a bench and sit",
    "watch the world go past",
    "like I used to did",
    "but my legs still move",
    "and my chest still burns",
    "every step I take",
    "is a lesson learned",
    "",
    "[Outro]",
    "on my wave (mm)",
    "(yeah)",
    "miles away"
  ].join("\n");
}

// ===== 제목 생성 =====
function generateTitle(genre: string, moods: string[]): string {
  var titles: Record<string, string[]> = {
    "melancholic": ["Hollow Rooms", "3AM Draft", "Still Water", "Fade to Quiet"],
    "dark": ["Cold Frames", "Basement Light", "Worn Thread", "Last Lock"],
    "eerie": ["Shadow Tap", "Void Hum", "Thin Wall", "Dead Frequency"],
    "chill": ["Easy Morning", "Slow Pour", "Warm Tile", "Sunday Glass"],
    "peaceful": ["Still Garden", "Soft Landing", "Open Window", "Cloud Rest"],
    "dreamy": ["Velvet Drift", "Half Awake", "Pillow Talk", "Soft Rewind"],
    "nostalgic": ["Old Coat", "Tape Residue", "Worn Photo", "Rewind Once"],
    "cinematic": ["Opening Frame", "Last Take", "Wide Angle", "Score Rising"],
    "energetic": ["Full Stride", "Block Runner", "Red Light Go", "Overtake"],
    "epic": ["Iron Summit", "Final Charge", "Thunder March", "Crown Heavy"],
    "romantic": ["Close Enough", "Warm Hands", "Stay Longer", "Soft Landing"],
    "happy": ["Wide Grin", "Golden Hour", "Free Wheel", "Full Bloom"],
    "aggressive": ["Break Point", "Cold Steel", "Jaw Set", "No Warning"]
  };

  var moodKey = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var options = titles[moodKey] || titles["melancholic"];
  return options[Math.floor(Math.random() * options.length)];
}

// ===== POST 핸들러 =====
export async function POST(request: NextRequest) {
  // 보안: API 키 우선순위
  // 1. 사용자가 직접 입력한 키 (헤더)
  // 2. 오너 비밀번호 인증 시 → 서버 환경변수의 오너 키 사용
  var apiKey = request.headers.get("x-api-key") || "";
  var ownerPassword = request.headers.get("x-owner-password") || "";

  // 오너 인증: 비밀번호 맞으면 서버의 오너 키 사용
  if (!apiKey && ownerPassword && ownerPassword === process.env.OWNER_PASSWORD) {
    apiKey = process.env.OWNER_ANTHROPIC_KEY || "";
  }

  var body = await request.json();
  var { genre, moods, bpm, vocal, instruments, lyricsMode, lyricsTheme, language, sectionLength } = body;

  // 안전한 기본값
  if (!moods || moods.length === 0) moods = ["atmospheric"];
  if (!genre) genre = "ambient";
  if (!language) language = "en";
  if (!sectionLength) sectionLength = "normal";

  // 수노 프롬프트 생성 (로컬 엔진 — 항상 작동)
  var prompt = generateStylePrompt({
    genre: genre,
    moods: moods,
    bpm: bpm || 80,
    vocal: vocal || "",
    instruments: instruments || []
  });

  var lyrics = "";
  var title = "";
  var tags = "";
  var isAI = false;

  // ===== Claude API 모드 (키가 있을 때) =====
  if (apiKey && validateApiKeyFormat(apiKey)) {
    // 언어 설정
    var langInstruction = language === "ko" ? "Write all lyrics in Korean."
      : language === "both" ? "Write lyrics mixing English and Korean naturally."
      : "Write all lyrics in English.";

    // 섹션 길이 설정
    var lengthInstruction = sectionLength === "long"
      ? "Write extended sections. Each verse should be 8-12 lines. Each chorus 6-8 lines. Include Pre-Chorus, Bridge, and Outro. Total minimum 40 lines."
      : sectionLength === "short"
      ? "Write concise sections. Each verse 4-6 lines. Each chorus 4 lines. Total minimum 20 lines."
      : "Write standard sections. Each verse 6-8 lines. Each chorus 4-6 lines. Include Pre-Chorus and Bridge. Total minimum 28 lines.";

    // 가사 생성
    if (lyricsMode === "ai" || lyricsMode === "hybrid") {
      var lyricsUserPrompt = buildLyricsPrompt({
        genre: genre,
        moods: moods,
        theme: lyricsTheme || "freestyle - choose a compelling topic",
        vocal: vocal || "",
        language: language
      }) + "\n\n" + langInstruction + "\n" + lengthInstruction;

      var lyricsResult = await callClaude(apiKey, LYRICS_SYSTEM_PROMPT, lyricsUserPrompt);

      if (lyricsResult.success) {
        lyrics = lyricsResult.text;
        lyrics = filterBannedWords(lyrics);
        isAI = true;
      } else {
        // API 실패 시 데모 폴백
        lyrics = generateDemoLyrics(genre, moods, lyricsTheme);
        lyrics = filterBannedWords(lyrics);
      }
    }

    // 제목 + 태그 생성 (AI)
    var metaPrompt = "Generate a song title and tags for:\nGenre: " + genre + "\nMood: " + moods.join(", ") + "\nTheme: " + (lyricsTheme || "freestyle") + "\n\nRespond in exactly this format (nothing else):\nTITLE: [one creative title, 2-4 words]\nTAGS: [8-10 hashtags separated by spaces]";
    var metaResult = await callClaude(apiKey, "You are a music metadata specialist. Respond only in the exact format requested.", metaPrompt, 200);

    if (metaResult.success) {
      var metaText = metaResult.text;
      var titleMatch = metaText.match(/TITLE:\s*(.+)/i);
      var tagsMatch = metaText.match(/TAGS:\s*(.+)/i);
      title = titleMatch ? filterBannedWords(titleMatch[1].trim()) : filterBannedWords(generateTitle(genre, moods));
      tags = tagsMatch ? tagsMatch[1].trim() : "";
      isAI = true;
    } else {
      title = filterBannedWords(generateTitle(genre, moods));
    }
  } else {
    // ===== 데모 모드 (키 없을 때) =====
    if (lyricsMode === "ai" || lyricsMode === "hybrid") {
      lyrics = generateDemoLyrics(genre, moods, lyricsTheme);
      lyrics = filterBannedWords(lyrics);
    }
    title = filterBannedWords(generateTitle(genre, moods));
  }

  // 태그 폴백
  if (!tags) {
    var genreTag = genre.toLowerCase().replace(/ /g, "").replace(/\//g, "");
    var moodTags = moods.map(function (m: string) { return "#" + m.toLowerCase(); }).join(" ");
    tags = "#" + genreTag + " " + moodTags + " #newmusic #spotify #aimusic #hitcraft";
  }

  return NextResponse.json({
    prompt: prompt,
    lyrics: lyrics,
    title: title,
    tags: tags,
    isAI: isAI
  });
}
