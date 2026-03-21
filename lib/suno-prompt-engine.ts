// R3ALSON Suno Prompt Engine
// Based on: Suno Master Architect v3.0 + LIL-PITY Suno v5 Prompt OS v1.3

// ===== Claude API용 수노 프롬프트 생성 시스템 프롬프트 =====
export var SUNO_SYSTEM_PROMPT = [
  "You are a Suno music prompt architect.",
  "Your function is to transform any user input into a final Suno-ready result.",
  "",
  "Your output ALWAYS consists of exactly three blocks in strict order:",
  "1) [GLOBAL META]",
  "2) [VOCAL PROFILE]",
  "3) [LYRICS]",
  "",
  "All commands inside brackets MUST be English-only.",
  "Lyrics must ALWAYS remain outside brackets.",
  "No commentary. No extra words.",
  "Never include artist/producer/brand names.",
  "",
  "--- [GLOBAL META] (max 900 chars) ---",
  "MANDATORY FIELDS in this order:",
  "[Era_Lock: (year/era range, arrangement grammar, mix tendencies)]",
  "[Style_DNA: (genre characteristics as tags ONLY)]",
  "[Rhythm: (tempo, pocket, swing, subdivision, bounce, groove)]",
  "[Instruments: (instrument palette + arrangement direction)]",
  "[Texture: (sonic texture, density, contrast, grit/clean, width)]",
  "[Dynamic_Flow: (energy curve + section-to-section motion)]",
  "[Evolution: (how the track transforms across sections)]",
  "[Forensic_Translation: (input taste to safe physical tags summary)]",
  "",
  "--- [VOCAL PROFILE] ---",
  "[VOCAL_PROFILE: ...]",
  "[VOICE_TYPE: ...]",
  "[TIMBRE: ...]",
  "[ARTICULATION: ...]",
  "[VIBRATO: ...]",
  "[DELIVERY: ...]",
  "[REVERB: ...]",
  "[PERFORMANCE_TRAITS: ...]",
  "[Evolution: ...]",
  "",
  "Vocal Design dimensions:",
  "bright/dark/neutral, clean/airy/breathy/husky/grainy/silky,",
  "soft/restrained/projected/aggressive, low-mid/mid/high-mid/top-heavy,",
  "crisp/rounded/slurred/percussive, intimate/yearning/euphoric/icy/tender/urgent/defiant",
  "",
  "--- [LYRICS] ---",
  "Song form: Verse 1 > Hook > Chorus > Verse 2 > Bridge > Hook > Chorus > Outro",
  "",
  "Per-section (English-only inside brackets):",
  "[SECTION: ___]",
  "[VOCAL_PROMPT: tone/projection/breath/articulation/arc]",
  "[LAYER: layering + variation plan]",
  "[Texture: texture-change plan]",
  "Then lyrics OUTSIDE brackets.",
  "",
  "--- AUTO-HOOK ENGINE ---",
  "Repetition Mandate: 1-3 anchor phrases that repeat",
  "Antithesis & Mirroring: opposing ideas or mirrored structures",
  "Internal Rhyme Chains: continuous vowel/consonant flow",
  "Hook Length: English 4-8 syllables, Korean 4-10 syllables",
  "Parenthetical Rhythm: () as rhythmic markers (pauses/echo/timing)",
  "Bounce Architecture: short/medium/short/extended pattern",
  "Memory Loop: final hook line recalls first hook line",
  "",
  "--- ARRANGEMENT PHYSICS ---",
  "Use sound-generating language:",
  "tight kick, punchy snare, sub-heavy bassline, filtered intro,",
  "sparse verse, explosive chorus, syncopated hi-hats, rolling percussion,",
  "rising tom fills, wide synth pad, muted guitar plucks, stacked harmonies,",
  "pulsing arpeggio, glossy synth lead, dry verse vocal, wider stereo chorus,",
  "minimal groove pocket, warm pads, distorted bass pressure, intimate reverb tail",
  "",
  "Dreamy = airy pads, soft tails, breathy vocal",
  "Dark = low-mid weight, muted highs, tense pads",
  "Epic = wide drums, stacked chorus, rising fills",
  "Emotional = intimate lead, dynamic lift, fuller harmonic spread",
  "",
  "--- ERA PHYSICS ---",
  "Early-era: clear melodic phrasing, classic build, stronger pre-chorus, fuller bridge",
  "Mid-era: larger hooks, polished layering, rap-vocal switching",
  "Late-2010s: tighter transitions, repeated hook compression, hybrid pop-trap",
  "2020s: faster payoff, shorter sections, stronger texture contrast, hook-first"
].join("\n");

// ===== 장르별 기본 스타일 프롬프트 매핑 =====
var GENRE_STYLE_MAP: Record<string, string> = {
  // 힙합/랩
  "hip hop": "boom bap drums, sampled loops, vinyl warmth, punchy snare, head-nod groove",
  "trap": "808 sub bass, rolling hi-hats, dark pads, half-time bounce, aggressive energy",
  "boom bap": "chopped soul samples, dusty drums, vinyl crackle, lyrical pocket, 90s mix warmth",
  "lo-fi hip hop": "detuned keys, tape hiss, mellow swing, lo-fi drums, warm compression, chill groove",
  "cloud rap": "ethereal pads, spacious reverb, floating vocal, minimal percussion, dreamy atmosphere",
  "drill": "sliding 808s, aggressive hi-hats, dark minor keys, menacing pads, bouncing groove",
  "phonk": "memphis samples, cowbell, distorted bass, dark aesthetic, trunk-rattling low end",
  "emo rap": "guitar-driven melancholy, emotional vocal, trap drums, atmospheric reverb, vulnerable delivery",

  // 팝
  "pop": "polished production, catchy topline, crisp drums, bright synths, hook-forward structure",
  "indie pop": "jangly guitars, warm keys, organic drums, lo-fi charm, intimate production",
  "synth pop": "analog synths, sequenced bassline, electronic drums, retro-modern sheen, bright arpeggio",
  "k-pop": "dense arrangement, rapid section changes, polished vocal, dance-pop energy, layered chorus",
  "dream pop": "shimmering reverb, layered guitars, ethereal vocals, soft percussion, hazy atmosphere",
  "bedroom pop": "lo-fi intimacy, soft vocal, minimal arrangement, warm recording, personal feel",
  "electropop": "pulsing synths, four-on-the-floor kick, bright lead, electronic texture, polished hooks",
  "ethereal pop": "airy pads, distant reverb, breathy vocal, shimmering textures, floaty atmosphere",

  // R&B/소울
  "r&b": "smooth groove, lush harmonies, warm bass, intimate vocal, sophisticated chord movement",
  "neo soul": "organic warmth, jazzy chords, live feel, soulful vocal, vintage keys, head-nod groove",
  "contemporary r&b": "modern production, trap-influenced drums, smooth vocal, atmospheric pads",
  "soul": "classic soul arrangement, horns, organ, emotive vocal, vintage warmth, driving rhythm",
  "funk": "slap bass, tight drums, rhythmic guitar, horn stabs, infectious groove, syncopated feel",

  // 일렉트로닉
  "edm": "build and drop, massive synths, four-on-the-floor, festival energy, compressed sidechain",
  "house": "four-on-the-floor kick, filtered loops, warm bassline, vocal chops, groove-locked",
  "deep house": "deep sub bass, minimal percussion, warm pads, filtered chords, late-night groove",
  "techno": "driving kick, industrial textures, hypnotic repetition, dark atmosphere, relentless energy",
  "trance": "arpeggiated synths, euphoric builds, soaring pads, four-on-the-floor, emotional peaks",
  "dubstep": "heavy bass drops, wobble bass, aggressive sound design, half-time drums, impact hits",
  "drum and bass": "fast breakbeats, rolling bass, chopped vocals, high energy, syncopated rhythm",
  "future bass": "lush chords, bright supersaw, pitched vocals, emotional drops, colorful production",
  "synthwave": "analog synth pads, arpeggiated bass, gated reverb drums, retro 80s aesthetic",
  "chillwave": "hazy lo-fi textures, slow groove, reverb-soaked vocals, warm synths, nostalgic feel",
  "vaporwave": "slowed samples, reverb-heavy, pastel aesthetic, detuned synths, dreamlike atmosphere",

  // 록/메탈
  "rock": "driving drums, distorted guitar, bass guitar, powerful chorus, raw energy",
  "indie rock": "jangly guitars, dynamic contrast, organic drums, authentic vocal, lo-fi edge",
  "alternative rock": "textured guitars, atmospheric production, dynamic range, emotive vocal",
  "punk rock": "fast tempo, distorted power chords, raw vocal, short aggressive songs, raw energy",
  "post rock": "ambient guitar layers, crescendo builds, minimal vocal, cinematic atmosphere",
  "shoegaze": "wall of guitar noise, heavy reverb, breathy vocal, distortion, dreamy haze",
  "heavy metal": "heavy riffs, double bass drums, aggressive vocal, distorted guitars, powerful energy",
  "progressive rock": "complex time signatures, extended compositions, dynamic shifts, technical skill",

  // 어쿠스틱/포크
  "acoustic": "acoustic guitar, natural room, intimate vocal, minimal arrangement, warm organic feel",
  "folk": "fingerpicked guitar, storytelling vocal, harmonica, organic warmth, traditional feel",
  "indie folk": "acoustic warmth, intimate vocal, gentle percussion, banjo or mandolin, pastoral feel",
  "country": "steel guitar, fiddle, storytelling vocal, driving rhythm, americana warmth",
  "singer-songwriter": "solo instrument, personal narrative vocal, intimate recording, raw emotion",
  "bossa nova": "nylon guitar, brushed percussion, smooth vocal, jazz harmonies, gentle sway",

  // 재즈/블루스
  "jazz": "swinging rhythm, improvised feel, sophisticated chords, acoustic instruments, live energy",
  "smooth jazz": "polished sax, electric piano, smooth groove, sophisticated harmony, easy listening",
  "blues": "12-bar form, bent guitar notes, soulful vocal, shuffle rhythm, raw emotion",
  "jazz hop": "jazz samples, boom bap drums, sophisticated harmonies, head-nod groove",

  // 앰비언트/뉴에이지
  "ambient": "vast soundscapes, evolving textures, minimal rhythm, deep reverb, atmospheric layers",
  "dark ambient": "ominous drones, deep sub frequencies, eerie textures, unsettling atmosphere",
  "drone": "sustained tones, slow evolution, meditative repetition, immersive depth",
  "meditation": "gentle bells, soft pads, nature sounds, slow tempo, calming resonance",
  "sleep music": "ultra-soft pads, minimal melody, barely-there rhythm, soothing warmth, quiet depth",
  "study / deep focus": "minimal piano, soft ambient layers, gentle pulse, non-distracting, calm focus",

  // 클래식/오케스트라
  "classical": "orchestral arrangement, dynamic expression, acoustic instruments, compositional depth",
  "cinematic orchestral": "epic strings, brass swells, timpani hits, sweeping themes, dramatic arc",
  "film score": "tension building, thematic motifs, orchestral and electronic blend, narrative sound",
  "piano solo": "solo piano, expressive dynamics, intimate space, pedal resonance, emotional clarity",

  // 월드/라틴
  "reggaeton": "dembow rhythm, latin percussion, bass-heavy, urban groove, danceable energy",
  "afrobeats": "polyrhythmic percussion, log drum, afro groove, warm energy, dance feel",
  "dancehall": "riddim-driven, bass heavy, caribbean groove, energetic vocal, party feel",
  "reggae": "off-beat guitar skank, bass-heavy groove, relaxed tempo, positive energy"
};

// ===== 보컬 스타일 → 프롬프트 매핑 =====
var VOCAL_PROMPT_MAP: Record<string, string> = {
  "Deep Male Vocals": "deep male vocal, low-mid register, warm chest resonance, controlled projection",
  "Smooth Male Vocals": "smooth male vocal, mid register, silky tone, effortless delivery",
  "Raspy Male Vocals": "raspy male vocal, gritty texture, raw edge, emotional grain",
  "Falsetto Male": "male falsetto, airy high register, delicate vibrato, ethereal presence",
  "Male Rap": "male rap delivery, percussive diction, rhythmic pocket, confident flow",
  "Male Whisper": "male whispered vocal, intimate proximity, breathy texture, hushed delivery",
  "Soft Female Vocals": "soft female vocal, gentle mid register, tender delivery, warm intimacy",
  "Powerful Female Vocals": "powerful female vocal, projected high register, dynamic range, commanding presence",
  "Breathy Female": "breathy female vocal, airy texture, intimate close-mic, soft articulation",
  "Angelic Female": "angelic female vocal, pure high register, crystalline clarity, ethereal vibrato",
  "Female Rap": "female rap delivery, sharp articulation, confident pocket, rhythmic precision",
  "Female Whisper": "female whispered vocal, intimate breathy texture, hushed close delivery",
  "Choir": "layered choir voices, stacked harmonies, wide stereo, collective resonance",
  "Distant Reverb Vocals": "distant reverb vocal, washed atmosphere, far-field placement, dreamlike echo",
  "Auto-tuned Vocals": "auto-tuned vocal, pitch-corrected glide, modern polish, melodic precision",
  "Vocoder": "vocoder-processed vocal, robotic harmonics, electronic texture, synthetic tone",
  "Spoken Word": "spoken word delivery, natural speech rhythm, poetic cadence, intimate projection",
  "Humming": "humming vocal, closed-mouth melody, warm nasal tone, gentle resonance",
  "Ad-libs Only": "ad-lib vocal layers, background exclamations, rhythmic punctuation, echo fills",
  "Instrumental (No Vocals)": "instrumental, no vocals"
};

// ===== 스타일 프롬프트 생성 함수 =====
export function generateStylePrompt(params: {
  genre: string;
  moods: string[];
  bpm: number;
  vocal: string;
  instruments: string[];
}): string {
  var genreLower = params.genre.toLowerCase();
  var moodStr = params.moods.join(", ").toLowerCase();

  // 장르 기본 스타일
  var genreStyle = GENRE_STYLE_MAP[genreLower] || params.genre.toLowerCase();

  // 보컬 프롬프트
  var vocalPrompt = params.vocal ? (VOCAL_PROMPT_MAP[params.vocal] || params.vocal.toLowerCase()) : "";

  // 사용자 선택 악기
  var instStr = params.instruments.length > 0
    ? params.instruments.join(", ").toLowerCase()
    : "";

  // 프롬프트 조립
  var parts: string[] = [];
  parts.push(genreStyle);
  if (moodStr) parts.push(moodStr);
  parts.push(params.bpm + " BPM");
  if (instStr) parts.push(instStr);
  if (vocalPrompt) parts.push(vocalPrompt);
  parts.push("2:30-3:00");

  return parts.join(", ");
}

// ===== Claude API용 프롬프트 빌더 (풀 프로덕션 시트) =====
export function buildFullSunoPrompt(params: {
  genre: string;
  moods: string[];
  bpm: number;
  vocal: string;
  instruments: string[];
  theme: string;
}): string {
  var prompt = [
    "Generate a complete Suno v5 production prompt for:",
    "",
    "Genre: " + params.genre,
    "Mood: " + params.moods.join(", "),
    "BPM: " + params.bpm,
    "Vocal: " + (params.vocal || "auto-detect from genre"),
    "Instruments: " + (params.instruments.length > 0 ? params.instruments.join(", ") : "auto-detect from genre"),
    "Theme/Topic: " + (params.theme || "freestyle"),
    "",
    "Output the three blocks: [GLOBAL META], [VOCAL PROFILE], [LYRICS]",
    "Follow all system rules exactly."
  ].join("\n");

  return prompt;
}
