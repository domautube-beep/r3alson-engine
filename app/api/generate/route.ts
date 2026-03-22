import { NextRequest, NextResponse } from "next/server";
import { LYRICS_SYSTEM_PROMPT, filterBannedWords, validateLyrics, buildLyricsPrompt } from "@/lib/lyrics-engine";
import { generateStylePrompt, SUNO_SYSTEM_PROMPT, buildFullSunoPrompt } from "@/lib/suno-prompt-engine";
import { callClaude, validateApiKeyFormat } from "@/lib/claude";

// ===== 데모 가사 풀 (플레이리스트 배리에이션용) =====
// 각 세트는 고유한 장면/테마를 가진 완전한 곡

var THEMED_LYRICS = [
  // [0] Night Drive — 밤거리, 자동차, 도시 불빛
  [
    "[Verse]",
    "highway lines blur",
    "radio hums low",
    "city behind me",
    "shrinking in the glow",
    "hands loose on the wheel",
    "no destination yet",
    "just the engine breathing",
    "and the road ahead",
    "",
    "[Pre-Chorus]",
    "exit signs flicker",
    "I pass every one",
    "not looking for somewhere",
    "just running from none",
    "",
    "[Hook]",
    "night drive (ooh)",
    "night drive",
    "no map no plan",
    "just headlights cutting blind (ah)",
    "night drive (ooh)",
    "night drive",
    "I'll figure out the rest",
    "at the next state line",
    "",
    "[Verse]",
    "gas station coffee",
    "burnt and barely warm",
    "stranger at the counter",
    "same tired uniform",
    "I nod and keep moving",
    "back into the dark",
    "windshield full of nothing",
    "but the road and stars",
    "",
    "[Bridge]",
    "maybe I should turn around",
    "check the mirror twice",
    "but the rearview only shows",
    "what I'm leaving behind",
    "",
    "[Hook]",
    "night drive (ooh)",
    "night drive",
    "no map no plan",
    "just headlights cutting blind",
    "",
    "[Outro]",
    "night drive (mm)",
    "next state line"
  ].join("\n"),

  // [1] Old Film — 오래된 기억, 폴라로이드, 먼지 낀 박스
  [
    "[Verse]",
    "found a box today",
    "pushed behind the shelf",
    "dust on every corner",
    "like it hid itself",
    "polaroid on top",
    "your face caught mid-laugh",
    "I forgot that smile",
    "or I tried to half",
    "",
    "[Pre-Chorus]",
    "the tape inside still plays",
    "if I press rewind",
    "same scene every time",
    "you wave and close your eyes",
    "",
    "[Hook]",
    "old film (oh-oh)",
    "old film",
    "I keep the reel but",
    "I can't press play again (ah)",
    "old film (oh-oh)",
    "old film",
    "some memories work better",
    "stuck inside the lens",
    "",
    "[Verse]",
    "ticket stub from march",
    "crumpled at the edge",
    "you wrote something small",
    "I can't read the rest",
    "jacket in the pile",
    "smells like someone else",
    "maybe that's just time",
    "erasing what was left",
    "",
    "[Bridge]",
    "I could burn the box",
    "let the smoke decide",
    "or just close the lid",
    "like I always do inside",
    "",
    "[Hook]",
    "old film (oh-oh)",
    "old film",
    "some memories work better",
    "stuck inside the lens",
    "",
    "[Outro]",
    "old film (mm)",
    "inside the lens"
  ].join("\n"),

  // [2] Rooftop — 옥상, 도시 위, 고요함
  [
    "[Verse]",
    "twelve flights up",
    "the city lays flat",
    "sirens sound like whispers",
    "from where I'm sat",
    "legs hang off the edge",
    "shoes barely on",
    "wind takes the smoke",
    "before it's even gone",
    "",
    "[Pre-Chorus]",
    "down there they're rushing",
    "up here I'm still",
    "the whole world moving",
    "but time just sits and spills",
    "",
    "[Hook]",
    "above it all (yeah)",
    "above it all",
    "the noise can't reach me",
    "where the skyline starts to fall (ooh)",
    "above it all (yeah)",
    "above it all",
    "I built my quiet",
    "on the rooftop wall",
    "",
    "[Verse]",
    "phone buzzing pocket",
    "screen side down",
    "I came up here",
    "to lose the sound",
    "stars aren't out",
    "just planes and light",
    "but even fake ones",
    "feel alright tonight",
    "",
    "[Bridge]",
    "I could climb back down",
    "rejoin the pace",
    "but my feet like concrete",
    "and the view's too great",
    "",
    "[Hook]",
    "above it all (yeah)",
    "above it all",
    "I built my quiet",
    "on the rooftop wall",
    "",
    "[Outro]",
    "above it all (mm)",
    "rooftop wall"
  ].join("\n"),

  // [3] Last Train — 기차역, 떠남, 야간 열차
  [
    "[Verse]",
    "platform almost empty",
    "one lamp flickering",
    "bench too cold to sit",
    "so I just stand and lean",
    "train rolls in slow",
    "brakes hiss and groan",
    "doors open wide",
    "for just me alone",
    "",
    "[Pre-Chorus]",
    "the schedule says last stop",
    "I don't check where",
    "just need the motion",
    "just need the air",
    "",
    "[Hook]",
    "last train out (oh)",
    "last train out",
    "I don't know where it goes",
    "but I'm on it now (ah)",
    "last train out (oh)",
    "last train out",
    "better than standing still",
    "on the same old ground",
    "",
    "[Verse]",
    "window seat corner",
    "forehead on the glass",
    "houses turn to fields",
    "passing way too fast",
    "someone left a paper",
    "headline I don't read",
    "fold it for a pillow",
    "that's all the news I need",
    "",
    "[Bridge]",
    "could ride this line",
    "until the morning comes",
    "or step off at the next one",
    "start again from one",
    "",
    "[Hook]",
    "last train out (oh)",
    "last train out",
    "better than standing still",
    "on the same old ground",
    "",
    "[Outro]",
    "last train out (mm)",
    "same old ground"
  ].join("\n"),

  // [4] Ocean — 바다, 파도, 해변
  [
    "[Verse]",
    "sand still warm",
    "from the afternoon",
    "water pulling back",
    "underneath the moon",
    "shoes somewhere behind",
    "feet in the foam",
    "standing at the edge",
    "of the only quiet I've known",
    "",
    "[Pre-Chorus]",
    "the tide keeps time",
    "better than I can",
    "writing my name slow",
    "then washing where I stand",
    "",
    "[Hook]",
    "ocean line (ooh)",
    "ocean line",
    "I bring my questions here",
    "and the waves reply in time (ah)",
    "ocean line (ooh)",
    "ocean line",
    "the answers always leave",
    "with the salt and brine",
    "",
    "[Verse]",
    "sat down on the rocks",
    "let my jacket fold",
    "water sounds the same",
    "as when I was ten years old",
    "nothing really changes",
    "out beyond the break",
    "just the sky and surface",
    "trading shades of grey",
    "",
    "[Bridge]",
    "I could stay until",
    "the morning tide rolls in",
    "let the sun remind me",
    "I'm supposed to begin",
    "",
    "[Hook]",
    "ocean line (ooh)",
    "ocean line",
    "the answers always leave",
    "with the salt and brine",
    "",
    "[Outro]",
    "ocean line (mm)",
    "salt and brine"
  ].join("\n"),

  // [5] Glass Room — 비 오는 날, 유리창, 실내
  [
    "[Verse]",
    "rain taps the glass",
    "like it wants back in",
    "kettle on the stove",
    "steam curling thin",
    "blanket on the couch",
    "still shaped like two",
    "I press into the dent",
    "where you used to",
    "",
    "[Pre-Chorus]",
    "the ceiling drips",
    "from the floor above",
    "someone else's water",
    "falling on my love",
    "",
    "[Hook]",
    "glass room (oh-oh)",
    "glass room",
    "I watch the world dissolve",
    "through the window frame (ah)",
    "glass room (oh-oh)",
    "glass room",
    "everything outside",
    "feels like someone else's rain",
    "",
    "[Verse]",
    "candle burned to nothing",
    "wax pooled on the plate",
    "your book still open",
    "to the page you hate",
    "fridge hums louder",
    "when the house goes still",
    "silence isn't empty",
    "silence always fills",
    "",
    "[Bridge]",
    "I could open up",
    "let the storm come through",
    "or keep the curtains drawn",
    "and pretend the sky is blue",
    "",
    "[Hook]",
    "glass room (oh-oh)",
    "glass room",
    "everything outside",
    "feels like someone else's rain",
    "",
    "[Outro]",
    "glass room (mm)",
    "someone else's rain"
  ].join("\n"),

  // [6] Parking Lot — 주차장, 새벽, 차 안에서
  [
    "[Verse]",
    "engine off but sitting",
    "hands still on the wheel",
    "parking lot at four am",
    "nothing left to feel",
    "dashboard light still glowing",
    "your song on repeat",
    "I should go inside",
    "but the car feels more complete",
    "",
    "[Pre-Chorus]",
    "the streetlamp flickers",
    "moths don't seem to care",
    "they keep circling something",
    "that was never really there",
    "",
    "[Hook]",
    "still here (yeah)",
    "still here",
    "the world moved on",
    "but I'm parked in last year (ooh)",
    "still here (yeah)",
    "still here",
    "not stuck just choosing",
    "not to shift the gear",
    "",
    "[Verse]",
    "receipt from dinner",
    "folded in the cup",
    "two meals one person",
    "I still order us",
    "seat reclined halfway",
    "ceiling looks like sky",
    "close enough to stars",
    "if I don't open my eyes",
    "",
    "[Bridge]",
    "key in the ignition",
    "one turn and I'm gone",
    "but my hand just rests there",
    "like it's holding on",
    "",
    "[Hook]",
    "still here (yeah)",
    "still here",
    "not stuck just choosing",
    "not to shift the gear",
    "",
    "[Outro]",
    "still here (mm)",
    "shift the gear"
  ].join("\n"),

  // [7] Stairwell — 계단, 에코, 건물 안
  [
    "[Verse]",
    "fluorescent buzz",
    "flickering on three",
    "footsteps echo up",
    "but it's only me",
    "handprint on the rail",
    "cold and slightly wet",
    "someone passed before me",
    "and I haven't caught up yet",
    "",
    "[Pre-Chorus]",
    "the landing smells like paint",
    "and something old",
    "every floor the same",
    "just a different cold",
    "",
    "[Hook]",
    "going up (oh)",
    "going up",
    "but every floor looks the same",
    "when you've had enough (ah)",
    "going up (oh)",
    "going up",
    "the top might have a view",
    "or just another shut",
    "",
    "[Verse]",
    "graffiti on the fifth",
    "says something about love",
    "crossed out twice",
    "then written back above",
    "someone believed it",
    "enough to try again",
    "I trace it with my thumb",
    "and keep climbing toward the end",
    "",
    "[Bridge]",
    "could take the elevator",
    "skip the ache and burn",
    "but something about the steps",
    "makes every landing earned",
    "",
    "[Hook]",
    "going up (oh)",
    "going up",
    "the top might have a view",
    "or just another shut",
    "",
    "[Outro]",
    "going up (mm)",
    "another shut"
  ].join("\n")
];

// 랩용 추가 데모 가사 (플레이리스트 배리에이션)
var RAP_EXTRA_LYRICS = [
  // [0] Cold Hands — 겨울, 생존, 버티기
  [
    "[Verse]",
    "winter coat heavy",
    "wallet gettin light",
    "same block different day",
    "but the grind don't fight",
    "mama called twice",
    "I let it ring through",
    "not cuz I don't care",
    "cuz I got nothin new",
    "",
    "[Pre-Chorus]",
    "the corner store mirror",
    "shows a tired face",
    "bags under my eyes",
    "like I packed to leave this place",
    "",
    "[Hook]",
    "cold hands (uh)",
    "cold hands (yeah)",
    "still reachin for the top",
    "from where I stand (ooh)",
    "cold hands (uh)",
    "cold hands",
    "they say warm hearts",
    "but I just need a plan",
    "",
    "[Verse]",
    "bus stop bench cracked",
    "ad peeled halfway off",
    "girl I used to know",
    "walks past doesn't cough",
    "I pull my hood up",
    "blend into the grey",
    "some people move forward",
    "some just move away",
    "",
    "[Bridge]",
    "maybe spring hits",
    "and the ice breaks clean",
    "or I stay frozen here",
    "somewhere in between",
    "",
    "[Hook]",
    "cold hands (uh)",
    "cold hands",
    "they say warm hearts",
    "but I just need a plan",
    "",
    "[Outro]",
    "cold hands (mm)",
    "just a plan"
  ].join("\n"),

  // [1] Block Heavy — 동네, 거리, 뿌리
  [
    "[Verse]",
    "stoop sittin heavy",
    "concrete keepin score",
    "every crack a story",
    "from the ones before",
    "sneakers on the wire",
    "like a flag they flew",
    "neighborhood still standin",
    "but the faces all brand new",
    "",
    "[Pre-Chorus]",
    "bodega owner nods",
    "same way every night",
    "brown bag in my hand",
    "under yellow light",
    "",
    "[Hook]",
    "block heavy (woo)",
    "block heavy (uh-huh)",
    "this street raised me rough",
    "but it raised me steady (yeah)",
    "block heavy (woo)",
    "block heavy",
    "I could leave tomorrow",
    "but I'm never really ready",
    "",
    "[Verse]",
    "fire escape sunset",
    "orange through the bars",
    "homie on the phone",
    "said he's movin far",
    "I said word that's big",
    "he said come along",
    "I looked at the block",
    "and I wrote this song",
    "",
    "[Bridge]",
    "every curb I sat on",
    "left a mark in me",
    "not the kind that heals",
    "just the kind you learn to be",
    "",
    "[Hook]",
    "block heavy (woo)",
    "block heavy",
    "I could leave tomorrow",
    "but I'm never really ready",
    "",
    "[Outro]",
    "block heavy (mm)",
    "never ready"
  ].join("\n")
];

// ===== 데모 가사 (엔진 규칙 준수) =====
// DIRECT MODE / Scene Lock / Hook 2회 / () adlib / Show-don't-tell / Line 2-8 syllables
function generateDemoLyrics(genre: string, moods: string[], theme: string, variationIndex?: number): string {
  var idx = variationIndex || 0;
  var moodLower = moods.length > 0 ? moods[0].toLowerCase() : "melancholic";
  var isRap = genre.toLowerCase().indexOf("hip") !== -1 || genre.toLowerCase().indexOf("rap") !== -1 || genre.toLowerCase().indexOf("trap") !== -1 || genre.toLowerCase().indexOf("drill") !== -1;

  // ===== 플레이리스트 트랙 (idx > 0): 테마별 고유 가사 =====
  if (idx > 0) {
    if (isRap) {
      // 랩: 기존 "I Don't Chase" + 2개 추가 = 3세트 로테이션
      var rapIdx = (idx - 1) % (RAP_EXTRA_LYRICS.length + 1);
      if (rapIdx < RAP_EXTRA_LYRICS.length) {
        return RAP_EXTRA_LYRICS[rapIdx];
      }
      // 나머지는 기존 랩 가사 (아래 fall through)
    } else {
      // 비랩: 8개 테마 세트 로테이션
      return THEMED_LYRICS[(idx - 1) % THEMED_LYRICS.length];
    }
  }

  // ===== 단곡 모드 (idx 0) 또는 랩 폴백: 무드 기반 선택 =====

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
  var { genre, moods, bpm, vocal, instruments, lyricsMode, lyricsTheme, language, sectionLength, variationIndex } = body;

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
        lyrics = generateDemoLyrics(genre, moods, lyricsTheme, variationIndex);
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
      lyrics = generateDemoLyrics(genre, moods, lyricsTheme, variationIndex);
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
