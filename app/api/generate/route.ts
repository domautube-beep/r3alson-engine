import { NextRequest, NextResponse } from "next/server";
import { LYRICS_SYSTEM_PROMPT, filterBannedWords, validateLyrics, buildLyricsPrompt } from "@/lib/lyrics-engine";

// ===== 수노 프롬프트 최적화 엔진 =====
function optimizePrompt(genre: string, moods: string[], bpm: number, vocal: string, instruments: string[]): string {
  var moodStr = moods.join(", ").toLowerCase();
  var genreLower = genre.toLowerCase();

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
    "jazz": "piano, upright bass, brushed drums, saxophone",
    "hip hop": "booming 808s, crisp snares, sampled loops",
    "pop": "polished synths, clean drums, catchy melody",
    "rock": "electric guitar, driving drums, bass guitar, power chords",
    "drill": "sliding 808s, dark pads, aggressive hi-hats",
    "phonk": "memphis samples, cowbell, distorted bass",
    "house": "four-on-the-floor kick, synth stabs, filtered vocals",
    "reggaeton": "dembow rhythm, latin percussion, bass hits"
  };

  var instStr = instruments.length > 0
    ? instruments.join(", ").toLowerCase()
    : (defaultInstrumentMap[genreLower] || "atmospheric pads, gentle melody");

  var vocalStr = vocal ? vocal.toLowerCase() : "";

  var parts = [genreLower, moodStr, bpm + " BPM", instStr];
  if (vocalStr) parts.push(vocalStr);
  parts.push("2:45");

  return parts.join(", ");
}

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
  var body = await request.json();
  var { genre, moods, bpm, vocal, instruments, lyricsMode, lyricsTheme } = body;

  // 프롬프트 생성
  var prompt = optimizePrompt(genre, moods, bpm, vocal || "", instruments || []);

  // 가사 생성
  var lyrics = "";
  if (lyricsMode === "ai" || lyricsMode === "hybrid") {
    // TODO: Claude API 연동 시 LYRICS_SYSTEM_PROMPT + buildLyricsPrompt() 사용
    lyrics = generateDemoLyrics(genre, moods, lyricsTheme);

    // 금지 단어 필터
    lyrics = filterBannedWords(lyrics);

    // 검증
    var validation = validateLyrics(lyrics);
    if (!validation.valid) {
      lyrics = filterBannedWords(lyrics);
    }
  }

  // 제목 + 태그
  var title = filterBannedWords(generateTitle(genre, moods));
  var genreTag = genre.toLowerCase().replace(/ /g, "").replace(/\//g, "");
  var moodTags = moods.map(function (m: string) { return "#" + m.toLowerCase(); }).join(" ");
  var tags = "#" + genreTag + " " + moodTags + " #newmusic #spotify #aimusic #r3alson";

  return NextResponse.json({
    prompt: prompt,
    lyrics: lyrics,
    title: title,
    tags: tags
  });
}
