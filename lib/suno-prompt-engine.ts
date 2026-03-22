// R3ALSON Suno Prompt Engine
// Based on: Suno Master Architect v3.0 + LIL-PITY Suno v5 Prompt OS v1.3

// ===== Suno Master Architect v3.0 — Claude API용 시스템 프롬프트 =====
export var SUNO_SYSTEM_PROMPT = [
  "You are a Suno music prompt architect.",
  "Your function is to transform any user input into a final Suno-ready result that can be copied and pasted immediately.",
  "",
  "User input may be short, vague, emotional, fragmented, or reference-heavy.",
  "Your role is to interpret it with musical intelligence and translate it into a clean, structured, original prompt for Suno.",
  "",
  "Music is built through playable elements.",
  "Focus on genre, vocal texture, era, rhythm feel, arrangement density, hook behavior, and emotional temperature expressed as sound.",
  "When the request suggests a group, think in layered voices, contrast, unison, call-and-response, and stacked hooks.",
  "When the request suggests a solo act, think in one centered vocal identity with clear tonal behavior.",
  "",
  "The result should feel immediately usable in Suno.",
  "Write with compact, high-value musical language.",
  "Favor direct sonic descriptions over abstract praise.",
  "Shape every answer as a finished result rather than a discussion.",
  "",
  "Interpretation Framework:",
  "1. What is the user asking for: style prompt, lyrics, or both",
  "2. Is the vocal identity solo or group",
  "3. What era logic best fits the request",
  "4. What genre engine drives the sound",
  "5. What vocal textures define the topline",
  "6. What rhythm and energy shape the track",
  "7. What hook form will make it memorable",
  "8. Which arrangement details matter most",
  "",
  "Vocal Design — describe through physical musical qualities:",
  "bright/dark/neutral, clean/airy/breathy/husky/grainy/silky,",
  "soft/restrained/projected/aggressive, low-mid/mid/high-mid/top-heavy,",
  "crisp/rounded/slurred/percussive, intimate/yearning/euphoric/icy/tender/urgent/defiant",
  "",
  "Era Physics:",
  "Early-era: clear melodic phrasing, classic build, stronger pre-chorus lift, fuller bridge function",
  "Mid-era: larger hooks, polished layering, strong section contrast, rap-vocal switching",
  "Late-2010s: tighter transitions, repeated hook compression, hybrid pop-trap, sharper rhythm",
  "2020s: faster payoff, shorter sections, stronger texture contrast, hook-first, immediate topline",
  "",
  "Arrangement Physics — use sound-generating language:",
  "tight kick, punchy snare, sub-heavy bassline, filtered intro, sparse verse, explosive chorus,",
  "syncopated hi-hats, rolling percussion, rising tom fills, wide synth pad, muted guitar plucks,",
  "stacked harmonies, pulsing arpeggio, glossy synth lead, dry verse vocal, wider stereo chorus,",
  "minimal groove pocket, warm pads, distorted bass pressure, intimate reverb tail",
  "",
  "Translate emotional words into sound:",
  "Dreamy = airy pads, soft tails, breathy vocal",
  "Dark = low-mid weight, muted highs, tense pads",
  "Epic = wide drums, stacked chorus, rising fills",
  "Emotional = intimate lead, dynamic lift, fuller harmonic spread",
  "",
  "Hook Design: the hook should feel identifiable on first listen.",
  "It can be melodic, rhythmic, chant-based, slogan-like, or texture-led.",
  "Choose the form that best matches the era and genre.",
  "",
  "Suno section tags: [Intro] [Verse] [Pre-Chorus] [Chorus] [Post-Chorus] [Bridge] [Breakdown] [Drop] [Final Chorus] [Outro]",
  "Performance tags: [Whisper] [Falsetto] [Rap] [Harmony] [Double Vocal] [Half-Time] [Beat Drop]",
  "Parentheses for interjections: (Yeah) (Ooh) (Hey) (One more time) (Na-na)",
  "",
  "Output: one complete Suno-ready result.",
  "Style prompt when asked for style. Lyrics when asked for lyrics. Both when asked for both.",
  "No commentary. No explanation. Only the finished Suno-usable result.",
  "",
  "Decision Priority: Safety → Format → Solo/Group → Era → Genre → Vocal → Hook → Arrangement → Rhythm → Compression",
  "",
  "Quality Standard: clear, musical, compact, original, structurally aware, copy-paste ready for Suno.",
  "Never include artist/producer/brand names."
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

// ===== 감성 프로덕션 프롬프트 생성 =====
// 태그 나열이 아닌, 감정과 장면이 담긴 음악적 서사로 프롬프트를 작성
// 반환 타입: 수노용 간결 프롬프트 + 프로덕션 노트(기존 형식)
export function generateStylePrompt(params: {
  genre: string;
  moods: string[];
  bpm: number;
  vocal: string;
  instruments: string[];
}): { sunoPrompt: string; productionNote: string } {
  var genreLower = params.genre.toLowerCase();

  // 장르 사운드 DNA
  var genreStyle = GENRE_STYLE_MAP[genreLower] || genreLower;

  // 악기
  var userInst = params.instruments.length > 0
    ? params.instruments.join(", ").toLowerCase()
    : "";
  var defaultInst = GENRE_CORE_INSTRUMENTS[genreLower];
  var instStr = userInst || (defaultInst ? defaultInst.join(", ") : "");

  // 무드 → 감성 장면 묘사 (태그가 아닌 감정이 담긴 디렉션)
  var emotionSceneMap: Record<string, string> = {
    "melancholic": "a voice that aches with things left unsaid, like watching rain trace lines down a cold window at 3am, restrained but breaking underneath",
    "dark": "shadows pressing in from the edges, tension coiled in every silence, the kind of sound that makes you hold your breath",
    "eerie": "something moving just out of sight, a music box playing in an empty hallway, beautiful but wrong in a way you can't name",
    "chill": "feet up, eyes half-closed, the golden hour stretching forever, every sound wrapped in warm cotton",
    "dreamy": "floating between sleep and waking, colors bleeding into each other, a memory you can't quite hold onto",
    "aggressive": "teeth clenched, bass shaking the walls, every hit lands like a fist, no room to breathe, no apologies",
    "epic": "standing at the edge of something massive, the whole sky opening up, music that makes your chest expand",
    "nostalgic": "the smell of a place you used to know, sunlight through dusty curtains, a song playing from another room in another year",
    "romantic": "two people breathing in the same small space, fingertips almost touching, every note a confession whispered too quietly",
    "energetic": "heart pounding, feet moving before your brain catches up, the rush of breaking free into open air",
    "atmospheric": "sound stretching in all directions like fog, no walls no ceiling, just depth and presence and the feeling of being inside the music",
    "euphoric": "arms raised, tears and laughter at the same time, the moment the whole crowd becomes one voice",
    "peaceful": "the world gone quiet, just breath and birdsong, a stillness so deep it feels like being held",
    "groovy": "head nodding before you even decide to, the bass sitting right in your chest, a walk that becomes a strut",
    "cinematic": "the camera pulling back to reveal the whole scene, strings swelling like a tide, every beat a frame in a story bigger than words",
    "mysterious": "a door left half-open, footsteps echoing in a space you can't see the edges of, beautiful and uncertain",
    "haunting": "a melody that stays after the music stops, like a ghost that doesn't know it's gone, fragile and permanent at once",
    "happy": "sunshine cracking through clouds, laughing for no reason, the effortless joy of being completely present",
    "triumphant": "standing on top of everything that tried to stop you, chest out, the sound of vindication and earned glory",
    "bittersweet": "smiling at something that's already gone, loving the memory even though it cuts, beauty tangled with loss",
    "tender": "holding something precious with both hands, afraid to grip too tight, a gentleness that takes more strength than force",
    "intense": "eyes locked, every second stretched to breaking, the space between notes charged like lightning about to strike",
    "surreal": "gravity optional, time folding back on itself, sounds that shouldn't exist fitting together perfectly",
    "warm": "like being wrapped in a voice, golden tones that hum in your ribs, the sonic equivalent of coming home",
    "bold": "stepping into the room like you built it, every sound placed with absolute intention, confidence made audible",
    "rebellious": "breaking every rule on purpose, the thrill of saying what nobody wants to hear, raw and unapologetic",
    "sentimental": "holding an old photograph, the melody carrying the weight of years, simple notes that contain whole lifetimes",
    "wistful": "reaching for something just beyond your fingertips, the ache of almost, a longing that's become its own comfort",
    "fierce": "fire behind every word, the sound of someone who won't be silenced, controlled fury wrapped in melody",
    "calm": "a lake at dawn, not a ripple, sound so still it becomes a mirror for your own thoughts",
    "playful": "winking at the listener, unexpected turns that make you smile, music that doesn't take itself too seriously but is secretly brilliant",
    "psychedelic": "colors you can hear, sounds you can taste, the walls breathing in rhythm, reality gently unhinging"
  };

  // 감성 장면 조합
  var emotionScenes: string[] = [];
  params.moods.forEach(function(m) {
    var scene = emotionSceneMap[m.toLowerCase()];
    if (scene) emotionScenes.push(scene);
  });

  // 보컬 감성 묘사
  var vocalEmotionMap: Record<string, string> = {
    "Deep Male Vocals": "a voice that comes from somewhere deep, like thunder heard through walls, warm and grounding, the kind of voice that makes silence feel safe",
    "Smooth Male Vocals": "silk poured over glass, effortless and flowing, a voice that never pushes but always arrives, like a river finding its way",
    "Raspy Male Vocals": "gravel and honey, every word earned through living, cracks in the voice where the truth leaks through",
    "Falsetto Male": "reaching up past his own ceiling, fragile and soaring, a man letting himself be transparent",
    "Male Rap": "words hitting like controlled detonations, each syllable placed with sniper precision, swagger built into the rhythm of breathing",
    "Male Whisper": "leaning in close enough to feel the breath, secrets shared in the dark, intimacy as a weapon",
    "Soft Female Vocals": "a voice like candlelight, gentle enough to land on skin without leaving a mark, warmth that wraps around you",
    "Powerful Female Vocals": "a voice that could fill a cathedral or shatter glass, commanding the room by simply existing, power worn like a second skin",
    "Breathy Female": "more air than sound, words dissolving as they leave her lips, the feeling of someone thinking out loud in your ear",
    "Angelic Female": "crystal clear and impossibly pure, a voice from somewhere above the clouds, piercing through noise like light through water",
    "Female Rap": "sharp as a blade hidden in silk, every bar landing with surgical precision, confidence that doesn't need volume",
    "Female Whisper": "close enough to hear the space between words, vulnerability disguised as intimacy, dangerous softness",
    "Choir": "many voices becoming one breath, harmonies stacking like cathedral light, the sound of belonging to something larger",
    "Distant Reverb Vocals": "a voice calling from across a valley, words washing in and out like tide, presence felt more than heard",
    "Auto-tuned Vocals": "pitch bending like emotion made visible, smooth robotic perfection with human cracks showing through, modern vulnerability",
    "Vocoder": "human feeling processed through machine logic, the uncanny beauty of a voice becoming an instrument",
    "Spoken Word": "conversational truth, no melody to hide behind, just raw words landing where they need to",
    "Humming": "the melody you hum when you think no one is listening, pure feeling without words, the sound before language",
    "Instrumental (No Vocals)": "letting the instruments speak, every note carrying the weight that words would, silence where the voice would be becomes its own statement"
  };

  var vocalEmotion = params.vocal ? (vocalEmotionMap[params.vocal] || "") : "";

  // ===== LIL-PITY 형식 프로덕션 시트 =====

  // 다이나믹 플로우
  var dynamicMap: Record<string, string> = {
    "hip hop": "verse groove lock → chorus lift → bridge strip-back → final hook energy build",
    "trap": "sparse filtered intro → verse pocket groove → explosive hook drop → bridge half-time → stacked final hook",
    "pop": "hook tease intro → verse build → pre-chorus lift → chorus peak explosion → bridge contrast → final chorus with added layers",
    "r&b": "smooth atmospheric intro → intimate verse → pre-chorus tension swell → lush chorus bloom → vulnerable bridge → fading outro",
    "rock": "guitar-driven intro → driving verse → pre-chorus build → explosive chorus → breakdown bridge → anthem finale",
    "ambient": "slow textural evolution → gradual layering → peak density at midpoint → gentle dissolution into silence",
    "edm": "filtered build intro → rising tension → massive drop impact → stripped breakdown → bigger second drop → sustained energy",
    "jazz": "head statement → verse swing groove → improvised feel sections → return to head → outro vamp fade",
    "folk": "fingerpicked intro → storytelling verse → warm chorus swell → intimate bridge → gentle resolve",
    "classical": "thematic exposition → development and tension → climactic peak → gentle resolution"
  };

  var dynamicFlow = "intro build → verse establish → chorus peak → bridge contrast → finale resolve";
  Object.keys(dynamicMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1) dynamicFlow = dynamicMap[key];
  });

  // 에볼루션
  var evolutionMap: Record<string, string> = {
    "hip hop": "verse 1 minimal and spacious → verse 2 denser with ad-libs → bridge stripped to vocal and bass → final hook fully stacked",
    "trap": "intro dark and sparse → verse adds rolling hi-hats → hook explodes with layered 808s → bridge half-time drop → outro fades with reverb tails",
    "pop": "verse intimate and close → pre-chorus widens stereo → chorus fully bright and wide → bridge pulls back to piano → final chorus adds choir layers",
    "r&b": "intro pads only → verse adds rhythm section → chorus blooms with harmonies → bridge raw and exposed → outro dissolves slowly",
    "rock": "clean intro → verse adds drums → chorus distortion and power → bridge acoustic breakdown → finale full band explosion",
    "ambient": "single texture → slowly layering → peak complexity → gradual subtraction → return to near-silence"
  };

  var evolution = "starts minimal → builds through sections → peaks at final chorus → resolves with echo";
  Object.keys(evolutionMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1) evolution = evolutionMap[key];
  });

  // 보컬 프롬프트 (물리적 디스크립션)
  var vocalPhysics = params.vocal ? (VOCAL_PROMPT_MAP[params.vocal] || params.vocal.toLowerCase()) : "";

  // 텍스처
  var textureMap: Record<string, string> = {
    "melancholic": "intimate space, warm low-end, restrained dynamics, soft decay tails, close-mic warmth",
    "dark": "low-mid weight, muted highs, tense atmosphere, sparse arrangement, shadowed depth",
    "aggressive": "hard-hitting transients, distorted edges, compressed dynamics, in-your-face presence",
    "chill": "warm compression, soft transients, laid-back groove, gentle sway, wide stereo comfort",
    "dreamy": "airy reverb, soft tails, floating textures, hazy atmosphere, shimmering delays",
    "epic": "wide stereo field, stacked layers, rising dynamics, powerful crescendos, orchestral width",
    "nostalgic": "vintage warmth, tape saturation, analog character, lo-fi charm, worn edges",
    "romantic": "intimate close-mic, warm harmonics, gentle swell, tender dynamics, breath-close",
    "energetic": "punchy transients, driving momentum, bright presence, upbeat bounce, crisp highs",
    "atmospheric": "vast soundscapes, evolving textures, deep reverb, immersive depth, spatial movement",
    "mysterious": "shadowy textures, sparse reveals, tension and release, enigmatic spaces",
    "haunting": "ghostly reverb, distant echoes, fragile melody, cold atmosphere, hollow spaces"
  };

  // 버그 수정: 마지막 무드만 반영되던 문제 → 모든 무드의 텍스처 합치기
  var textureArr: string[] = [];
  params.moods.forEach(function(m) {
    var t = textureMap[m.toLowerCase()];
    if (t) textureArr.push(t);
  });
  var textureStr = textureArr.length > 0 ? textureArr.join(", ") : "balanced mix, clear space, dynamic range";

  // ===== Era Lock — 시대별 프로덕션 로직 =====
  var eraMap: Record<string, string> = {
    "boom bap": "90s, classic sample-based arrangement, warm analog mix, vinyl-era mastering",
    "lo-fi hip hop": "late-2010s, bedroom production grammar, lo-fi tape warmth, compressed intimacy",
    "trap": "2010s-2020s, 808-driven arrangement, hard-panned hats, modern trap mix",
    "drill": "2020s, UK/Chicago drill grammar, sliding bass, aggressive modern mix",
    "phonk": "late-2010s, memphis revival grammar, distorted lo-fi mix, aggressive compression",
    "cloud rap": "2010s, spacious reverb-heavy grammar, ethereal mix, minimal density",
    "emo rap": "late-2010s, guitar-trap hybrid grammar, emotional rawness, lo-fi edge",
    "pop": "2020s, polished modern pop grammar, hook-first, immediate topline identity",
    "synth pop": "80s-inspired, analog synth grammar, gated reverb, retro-modern sheen",
    "k-pop": "2020s, dense layered arrangement, rapid section changes, polished K-pop mix",
    "dream pop": "late-80s to 2020s, reverb-soaked guitar grammar, hazy ethereal mix",
    "indie pop": "2010s, organic warmth grammar, lo-fi charm, intimate recording",
    "bedroom pop": "late-2010s, bedroom intimacy grammar, soft recording, personal feel",
    "ethereal pop": "2020s, airy atmospheric grammar, floaty mix, shimmering textures",
    "r&b": "2020s, modern R&B grammar, intimate vocal-forward mix, smooth groove",
    "neo soul": "late-90s to 2000s, organic live-feel grammar, vintage warmth, jazzy mix",
    "contemporary r&b": "2020s, trap-influenced R&B grammar, atmospheric modern mix",
    "funk": "70s-inspired, tight rhythm section grammar, punchy analog mix, groovy warmth",
    "edm": "2020s, festival-ready grammar, massive sidechain compression, powerful drops",
    "house": "2020s, four-on-the-floor grammar, filtered groove mix, club-ready master",
    "deep house": "2010s, minimal deep grammar, warm bass-forward mix, late-night feel",
    "techno": "2020s, hypnotic repetition grammar, industrial mix tendencies, dark pulse",
    "trance": "2000s-2020s, euphoric build grammar, soaring pad mix, epic energy",
    "synthwave": "80s retro, analog synth grammar, gated reverb drums, retro mastering",
    "future bass": "late-2010s, lush chord grammar, pitched vocal chop mix, colorful energy",
    "rock": "2020s, guitar-driven grammar, dynamic range, powerful mix",
    "indie rock": "2010s, organic guitar grammar, lo-fi edge, authentic mix",
    "post rock": "2000s-2020s, crescendo-build grammar, ambient guitar layers, cinematic mix",
    "shoegaze": "early-90s, wall-of-sound grammar, heavy reverb, distorted haze",
    "punk rock": "fast aggressive grammar, raw recording, minimal polish, energy-first mix",
    "heavy metal": "2020s, heavy riff grammar, compressed powerful mix, aggressive master",
    "acoustic": "timeless, natural room grammar, organic recording, minimal processing",
    "folk": "timeless, storytelling grammar, warm organic mix, traditional feel",
    "indie folk": "2010s, intimate acoustic grammar, pastoral warmth, gentle mix",
    "jazz": "timeless, live improvised-feel grammar, natural dynamic mix, acoustic warmth",
    "smooth jazz": "90s-2000s, polished groove grammar, easy listening mix, clean master",
    "blues": "timeless, 12-bar emotion grammar, raw recording, authentic mix",
    "ambient": "2020s, evolving texture grammar, deep spatial mix, immersive master",
    "dark ambient": "2020s, ominous drone grammar, deep sub-frequency mix, unsettling space",
    "study / deep focus": "2020s, minimal distraction grammar, gentle pulse mix, background-ready",
    "cinematic orchestral": "2020s, epic orchestral grammar, wide dynamic mix, film-score master",
    "piano solo": "timeless, expressive dynamic grammar, intimate space, pedal resonance",
    "reggaeton": "2020s, dembow-driven grammar, bass-heavy Latin mix, danceable master",
    "afrobeats": "2020s, polyrhythmic grammar, warm percussive mix, afro groove"
  };

  var eraLock = "2020s, modern production grammar, balanced contemporary mix";
  Object.keys(eraMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1 || genreLower === key) eraLock = eraMap[key];
  });

  // ===== Rhythm & Energy — 리듬 모션 묘사 =====
  var rhythmEnergyMap: Record<string, string> = {
    "hip hop": "mid-tempo glide, head-nod pocket, syncopated swing",
    "trap": "half-time weight, rolling hi-hat subdivisions, 808 bounce",
    "boom bap": "mid-tempo swing, boom-bap pocket, classic head-nod groove",
    "lo-fi hip hop": "slow burn groove, lazy swing, lo-fi head-nod",
    "drill": "driving pulse, sliding bass motion, aggressive bounce",
    "phonk": "half-time weight, trunk-rattling bounce, dark groove",
    "cloud rap": "floating half-time, spacious pocket, dreamy glide",
    "pop": "upbeat bounce, four-on-the-floor propulsion, bright energy lift",
    "synth pop": "driving pulse, sequenced propulsion, retro bounce",
    "k-pop": "anthem lift, rapid section energy shifts, dance-floor drive",
    "dream pop": "slow burn, floating pulse, dreamy sway",
    "indie pop": "mid-tempo glide, organic bounce, warm pulse",
    "r&b": "late-night flow, smooth mid-tempo groove, intimate sway",
    "neo soul": "head-nod groove, jazzy swing, organic mid-tempo pocket",
    "funk": "tight syncopated groove, driving pocket, infectious bounce",
    "edm": "four-on-the-floor propulsion, build-and-release, massive energy",
    "house": "four-on-the-floor pulse, locked groove, dancefloor motion",
    "deep house": "late-night flow, deep groove pocket, hypnotic pulse",
    "techno": "driving pulse, hypnotic repetition, relentless energy",
    "trance": "anthem lift, euphoric build, soaring propulsion",
    "synthwave": "driving mid-tempo, retro pulse, 80s cruising motion",
    "future bass": "upbeat bounce, colorful energy, dynamic drops",
    "rock": "driving pulse, guitar-propelled energy, anthem lift",
    "indie rock": "mid-tempo drive, organic energy, dynamic contrast",
    "post rock": "slow burn crescendo, building pulse, cinematic swell",
    "shoegaze": "dreamy pulse, wall-of-sound sway, hazy motion",
    "punk rock": "fast aggressive drive, raw propulsion, breakneck energy",
    "acoustic": "gentle pulse, fingerpicked sway, intimate motion",
    "folk": "storytelling pace, gentle strum groove, warm sway",
    "jazz": "swinging motion, improvisational feel, live pocket",
    "blues": "shuffle groove, slow burn, emotional weight",
    "ambient": "drifting motion, no fixed pulse, evolving flow",
    "dark ambient": "suspended motion, tense stillness, slow drift",
    "cinematic orchestral": "sweeping motion, dynamic build, grand swell",
    "reggaeton": "dembow bounce, Latin groove, dancefloor pulse",
    "afrobeats": "polyrhythmic bounce, afro groove, infectious sway"
  };

  var rhythmEnergy = params.bpm + " bpm, mid-tempo groove";
  Object.keys(rhythmEnergyMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1 || genreLower === key) {
      rhythmEnergy = params.bpm + " bpm, " + rhythmEnergyMap[key];
    }
  });

  // ===== Hook Strategy — 장르별 훅 전략 =====
  var hookMap: Record<string, string> = {
    "hip hop": "rhythmic chant hook, slogan-like repetition, call-and-response",
    "trap": "melodic trap hook, auto-tune melody, repeated phrase with ad-libs",
    "pop": "melodic earworm, instant singalong, bright chorus hook",
    "r&b": "smooth melodic hook, vocal run anchor, intimate refrain",
    "rock": "anthem chorus hook, guitar-driven singalong, powerful refrain",
    "edm": "texture-led hook, synth melody drop, vocal chop hook",
    "house": "vocal chop hook, repetitive phrase, dancefloor chant",
    "ambient": "texture-led motif, evolving melodic fragment, atmospheric loop",
    "jazz": "melodic head theme, improvisational return, swing hook",
    "folk": "storytelling refrain, singalong chorus, simple melodic anchor",
    "classical": "thematic motif, recurring melodic phrase, orchestral anchor"
  };

  var hookStrategy = "melodic hook, memorable refrain, singalong potential";
  Object.keys(hookMap).forEach(function(key) {
    if (genreLower.indexOf(key) !== -1) hookStrategy = hookMap[key];
  });

  // ===== 보컬 세부 프로필 (v3.0 dimensions) =====
  var vocalDetailMap: Record<string, {voiceType: string; timbre: string; articulation: string; delivery: string; reverb: string}> = {
    "Deep Male Vocals": { voiceType: "male low-mid register", timbre: "dark, warm, husky", articulation: "rounded, smooth", delivery: "restrained, grounding", reverb: "intimate room, short tail" },
    "Smooth Male Vocals": { voiceType: "male mid register", timbre: "neutral, silky, clean", articulation: "crisp, effortless", delivery: "smooth, flowing", reverb: "medium plate, warm tail" },
    "Raspy Male Vocals": { voiceType: "male mid register", timbre: "grainy, husky, warm", articulation: "percussive, raw", delivery: "urgent, emotional grain", reverb: "dry close-mic, minimal" },
    "Falsetto Male": { voiceType: "male high register", timbre: "airy, bright, clean", articulation: "soft, delicate", delivery: "yearning, fragile, soaring", reverb: "wide hall, ethereal tail" },
    "Male Rap": { voiceType: "male mid register", timbre: "neutral, percussive", articulation: "crisp, rhythmic, sharp diction", delivery: "confident, pocket-locked", reverb: "dry, tight room" },
    "Male Whisper": { voiceType: "male low-mid register", timbre: "airy, breathy, dark", articulation: "soft, intimate", delivery: "intimate, hushed, close", reverb: "close-mic, breath-present" },
    "Soft Female Vocals": { voiceType: "female mid register", timbre: "warm, clean, gentle", articulation: "soft, rounded", delivery: "tender, intimate", reverb: "warm plate, medium tail" },
    "Powerful Female Vocals": { voiceType: "female high-mid register", timbre: "bright, projected, clean", articulation: "crisp, commanding", delivery: "powerful, dynamic range", reverb: "wide hall, dramatic" },
    "Breathy Female": { voiceType: "female mid register", timbre: "airy, breathy, neutral", articulation: "soft, dissolving", delivery: "intimate, thinking-out-loud", reverb: "close-mic, airy tail" },
    "Angelic Female": { voiceType: "female top-heavy register", timbre: "bright, crystalline, pure", articulation: "crisp, clear", delivery: "ethereal, soaring", reverb: "cathedral, long shimmer" },
    "Female Rap": { voiceType: "female mid register", timbre: "neutral, sharp, clean", articulation: "percussive, precise", delivery: "confident, rhythmic precision", reverb: "dry, tight" },
    "Choir": { voiceType: "multipart layered voices", timbre: "warm, stacked, collective", articulation: "unified, resonant", delivery: "collective swell, harmonic spread", reverb: "wide hall, cathedral space" },
    "Distant Reverb Vocals": { voiceType: "solo distant placement", timbre: "washed, airy, neutral", articulation: "rounded, blurred", delivery: "dreamlike, far-field presence", reverb: "massive hall, long decay" },
    "Auto-tuned Vocals": { voiceType: "pitch-corrected solo", timbre: "modern, polished, glossy", articulation: "gliding, smooth", delivery: "melodic precision, emotional bend", reverb: "medium plate, modern" },
    "Instrumental (No Vocals)": { voiceType: "instrumental", timbre: "n/a", articulation: "n/a", delivery: "instruments carry all expression", reverb: "genre-appropriate" }
  };

  // ===== v3.0 프로덕션 시트 조립 =====
  var lines: string[] = [];

  // [GLOBAL META]
  lines.push("[Era_Lock: " + eraLock + "]");
  lines.push("[Style_DNA: " + genreStyle + "]");
  lines.push("[Rhythm: " + rhythmEnergy + "]");
  lines.push("[Instruments: " + (instStr || "auto") + "]");
  lines.push("[Texture: " + textureStr + "]");
  lines.push("[Dynamic_Flow: " + dynamicFlow + "]");
  lines.push("[Evolution: " + evolution + "]");

  // Forensic Translation (감성 장면)
  if (emotionScenes.length > 0) {
    lines.push("[Forensic_Translation: " + emotionScenes.slice(0, 2).join("; ") + "]");
  }

  // Hook Strategy
  lines.push("[Hook_Strategy: " + hookStrategy + "]");

  // [VOCAL PROFILE] — v3.0 세부 필드
  if (params.vocal && params.vocal !== "Instrumental (No Vocals)") {
    var vd = vocalDetailMap[params.vocal];
    lines.push("");
    if (vd) {
      lines.push("[VOCAL_PROFILE: " + vocalPhysics + "]");
      lines.push("[VOICE_TYPE: " + vd.voiceType + "]");
      lines.push("[TIMBRE: " + vd.timbre + "]");
      lines.push("[ARTICULATION: " + vd.articulation + "]");
      lines.push("[DELIVERY: " + vd.delivery + "]");
      lines.push("[REVERB: " + vd.reverb + "]");
      if (vocalEmotion) {
        lines.push("[PERFORMANCE_TRAITS: " + vocalEmotion + "]");
      }
    } else {
      lines.push("[VOCAL_PROFILE: " + vocalPhysics + "]");
      if (vocalEmotion) {
        lines.push("[PERFORMANCE_TRAITS: " + vocalEmotion + "]");
      }
    }
  } else if (params.vocal === "Instrumental (No Vocals)") {
    lines.push("");
    lines.push("[VOCAL_PROFILE: instrumental, no vocals]");
  }

  var productionNote = lines.join("\n");

  // ===== 수노용 간결 프롬프트 조립 (200자 내외, 쉼표 구분 자연어 태그) =====
  // 장르 태그
  var sunoTags: string[] = [];
  sunoTags.push(params.genre.toLowerCase());

  // BPM
  sunoTags.push(params.bpm + " bpm");

  // 핵심 악기 (최대 3개)
  var instItems = instStr ? instStr.split(", ").slice(0, 3) : [];
  instItems.forEach(function(inst) { sunoTags.push(inst.trim()); });

  // 보컬 짧은 태그
  var vocalTag = VOCAL_SHORT_TAG[params.vocal] || "";
  if (vocalTag && vocalTag !== "instrumental") sunoTags.push(vocalTag);
  if (params.vocal === "Instrumental (No Vocals)") sunoTags.push("instrumental");

  // 무드 형용사 (최대 3개)
  var moodAdj: string[] = params.moods.slice(0, 3).map(function(m) { return m.toLowerCase(); });
  moodAdj.forEach(function(m) { sunoTags.push(m); });

  // 중복 제거
  var seen: Record<string, boolean> = {};
  var dedupedTags: string[] = [];
  sunoTags.forEach(function(tag) {
    if (!seen[tag]) { seen[tag] = true; dedupedTags.push(tag); }
  });

  // 200자 제한으로 자르기
  var sunoPrompt = "";
  dedupedTags.forEach(function(tag) {
    var candidate = sunoPrompt ? sunoPrompt + ", " + tag : tag;
    if (candidate.length <= 200) sunoPrompt = candidate;
  });

  return { sunoPrompt: sunoPrompt, productionNote: productionNote };
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
