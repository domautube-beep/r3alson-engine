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

// ===== 수노 프로덕션 시트 생성 (LIL-PITY 형식) =====
// 수노가 풍부하게 파싱할 수 있는 프로덕션 디렉션 출력
export function generateStylePrompt(params: {
  genre: string;
  moods: string[];
  bpm: number;
  vocal: string;
  instruments: string[];
}): string {
  var genreLower = params.genre.toLowerCase();
  var moodStr = params.moods.join(", ").toLowerCase();

  // 장르 사운드 DNA
  var genreStyle = GENRE_STYLE_MAP[genreLower] || genreLower;

  // 악기
  var instStr = "";
  if (params.instruments.length > 0) {
    instStr = params.instruments.join(", ").toLowerCase();
  } else {
    var defaultInst = GENRE_CORE_INSTRUMENTS[genreLower];
    if (defaultInst) instStr = defaultInst.join(", ");
  }

  // 무드 → 텍스처 변환
  var textureMap: Record<string, string> = {
    "melancholic": "intimate space, warm low-end, restrained dynamics, soft decay tails",
    "dark": "low-mid weight, muted highs, tense atmosphere, sparse arrangement",
    "eerie": "unsettling textures, detuned elements, wide stereo field, tension builds",
    "chill": "warm compression, soft transients, laid-back groove, gentle sway",
    "dreamy": "airy reverb, soft tails, floating textures, hazy atmosphere",
    "aggressive": "hard-hitting transients, distorted edges, compressed dynamics, in-your-face",
    "epic": "wide stereo, stacked layers, rising dynamics, powerful crescendos",
    "nostalgic": "vintage warmth, tape saturation, analog character, lo-fi charm",
    "romantic": "intimate close-mic, warm harmonics, gentle swell, tender dynamics",
    "energetic": "punchy transients, driving momentum, bright presence, upbeat bounce",
    "atmospheric": "vast soundscapes, evolving textures, deep reverb, immersive space",
    "euphoric": "soaring builds, bright synths, uplifting energy, festival peak",
    "peaceful": "minimal arrangement, soft dynamics, natural space, calming resonance",
    "groovy": "locked pocket, syncopated feel, head-nod bounce, tight rhythm section",
    "cinematic": "orchestral width, dynamic sweeps, thematic motifs, dramatic arc",
    "mysterious": "shadowy textures, sparse reveals, tension and release, enigmatic mood",
    "haunting": "ghostly reverb, distant echoes, fragile melody, cold atmosphere"
  };

  var textures: string[] = [];
  params.moods.forEach(function(m) {
    var t = textureMap[m.toLowerCase()];
    if (t) textures.push(t);
  });
  var textureStr = textures.length > 0 ? textures[0] : "balanced mix, clear space";

  // 보컬 프롬프트
  var vocalPrompt = "";
  if (params.vocal) {
    vocalPrompt = VOCAL_PROMPT_MAP[params.vocal] || params.vocal.toLowerCase();
  }

  // 다이나믹 플로우 (장르 기반)
  var dynamicMap: Record<string, string> = {
    "hip hop": "verse groove lock, chorus lift, bridge strip-back, energy build to final hook",
    "trap": "sparse intro, verse pocket, explosive hook, bridge half-time drop, final hook stack",
    "pop": "immediate hook tease, verse build, pre-chorus lift, chorus peak, bridge contrast, final chorus add layers",
    "r&b": "smooth intro, intimate verse, pre-chorus tension, lush chorus bloom, bridge vulnerability, outro fade",
    "rock": "guitar intro, driving verse, pre-chorus build, explosive chorus, bridge breakdown, anthem finale",
    "ambient": "slow evolution, gradual layering, peak density at midpoint, gentle dissolution",
    "edm": "filtered intro, build tension, drop impact, breakdown, second drop bigger, energy sustain",
    "jazz": "head statement, verse swing, improvised feel sections, return to head, outro vamp"
  };

  var dynamicFlow = "";
  Object.keys(dynamicMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1) dynamicFlow = dynamicMap[key];
  });
  if (!dynamicFlow) dynamicFlow = "intro build, verse establish, chorus peak, bridge contrast, finale resolve";

  // 프로덕션 시트 조립
  var lines: string[] = [];
  lines.push(genreStyle + ", " + moodStr + ", " + params.bpm + " bpm");
  lines.push(instStr);
  lines.push(textureStr);
  lines.push(dynamicFlow);
  if (vocalPrompt) lines.push(vocalPrompt);

  return lines.join(", ");
}

// 장르별 핵심 악기 (사용자 미선택 시 폴백, 2-3개만)
var GENRE_CORE_INSTRUMENTS: Record<string, string[]> = {
  "hip hop": ["boom bap drums", "sampled loops"],
  "trap": ["808 bass", "trap hi-hats"],
  "boom bap": ["vinyl samples", "boom bap drums"],
  "lo-fi hip hop": ["lo-fi drums", "vinyl crackle", "jazz piano"],
  "cloud rap": ["ethereal pads", "808 bass"],
  "drill": ["sliding 808s", "aggressive hi-hats"],
  "phonk": ["memphis samples", "distorted bass"],
  "emo rap": ["electric guitar", "808 bass"],
  "pop": ["polished synths", "clean drums"],
  "indie pop": ["jangly guitars", "warm keys"],
  "synth pop": ["analog synths", "drum machine"],
  "k-pop": ["layered synths", "punchy drums"],
  "dream pop": ["shimmering guitars", "reverb pads"],
  "bedroom pop": ["soft guitar", "lo-fi drums"],
  "ethereal pop": ["airy pads", "soft drums"],
  "r&b": ["smooth keys", "warm bass"],
  "neo soul": ["rhodes", "live drums"],
  "contemporary r&b": ["atmospheric pads", "808 bass"],
  "funk": ["slap bass", "tight drums"],
  "edm": ["massive synths", "four-on-the-floor kick"],
  "house": ["four-on-the-floor kick", "filtered loops"],
  "deep house": ["deep bass", "warm pads"],
  "techno": ["driving kick", "hypnotic synths"],
  "trance": ["arpeggiated synths", "euphoric pads"],
  "dubstep": ["wobble bass", "heavy drops"],
  "future bass": ["lush chords", "pitched vocals"],
  "synthwave": ["analog synths", "arpeggios"],
  "chillwave": ["hazy synths", "lo-fi drums"],
  "rock": ["distorted guitar", "driving drums"],
  "indie rock": ["jangly guitar", "live drums"],
  "post rock": ["ambient guitar layers", "crescendo builds"],
  "shoegaze": ["wall of guitar", "heavy reverb"],
  "heavy metal": ["heavy riffs", "double bass drums"],
  "acoustic": ["acoustic guitar", "soft percussion"],
  "folk": ["fingerstyle guitar", "harmonica"],
  "indie folk": ["acoustic guitar", "gentle strings"],
  "jazz": ["piano", "brushed drums", "upright bass"],
  "smooth jazz": ["saxophone", "electric piano"],
  "blues": ["blues guitar", "piano"],
  "ambient": ["atmospheric pads", "field recordings"],
  "dark ambient": ["dark drones", "eerie textures"],
  "study / deep focus": ["minimal piano", "soft ambient"],
  "cinematic orchestral": ["orchestral strings", "brass", "timpani"],
  "film score": ["strings", "piano", "brass"],
  "piano solo": ["solo piano"],
  "reggaeton": ["dembow rhythm", "latin percussion"],
  "afrobeats": ["afro drums", "log drum"],
  "reggae": ["off-beat guitar", "bass heavy groove"],
  "country": ["steel guitar", "acoustic guitar"],
  "gospel": ["piano", "organ", "choir"]
};

// 보컬 → 수노 파싱용 짧은 태그
var VOCAL_SHORT_TAG: Record<string, string> = {
  "Deep Male Vocals": "deep male vocal",
  "Smooth Male Vocals": "smooth male vocal",
  "Raspy Male Vocals": "raspy male vocal",
  "Falsetto Male": "male falsetto",
  "Male Rap": "male rap vocal",
  "Male Whisper": "whispered male vocal",
  "Soft Female Vocals": "soft female vocal",
  "Powerful Female Vocals": "powerful female vocal",
  "Breathy Female": "breathy female vocal",
  "Angelic Female": "angelic female vocal",
  "Female Rap": "female rap vocal",
  "Female Whisper": "whispered female vocal",
  "Choir": "choir vocals",
  "Distant Reverb Vocals": "distant reverb vocal",
  "Auto-tuned Vocals": "auto-tuned vocal",
  "Vocoder": "vocoder vocal",
  "Spoken Word": "spoken word",
  "Humming": "humming",
  "Ad-libs Only": "ad-libs only",
  "Instrumental (No Vocals)": "instrumental"
};

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
