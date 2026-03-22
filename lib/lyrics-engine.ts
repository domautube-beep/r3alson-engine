// R3ALSON Lyrics Engine v82.0
// Suno용 가사 생성 OS — DIRECT MODE

// ===== 시스템 프롬프트 (Claude API 연동 시 사용) =====
export var LYRICS_SYSTEM_PROMPT = [
  "[LANGUAGE RULES]",
  "- Default: English-only lyrics.",
  "- Korean: only when explicitly requested. Korean syllable rule = 4-12 syllables per line.",
  "- Korean mode must use 의성어/의태어 (e.g., 툭, 쿵, 스르륵, 느릿느릿, 슬렁) as rhythmic anchors.",
  "- Korean rhyme patterns: 모음 라임 (아/나/다), 종성 라임 (각/막/박), 연속 라임 (전 줄 마지막 음절과 다음 줄 첫 음절 연결).",
  "- Korean code-switch: English hook phrase can appear inside Korean verse for rhythm. Must sound natural when sung.",
  "- Mixed mode: English verse + Korean pre-chorus/bridge, or vice versa. Transition must feel earned, not random.",
  "",
  "[EMOTION ARC SYSTEM (MANDATORY)]",
  "- Each song must select exactly ONE arc from the matching mood category below.",
  "- Arc selection is internal. Never print the arc label.",
  "",
  "MELANCHOLIC / DARK / HAUNTING moods — choose one:",
  "  ARC-M1: Denial → Recognition → Acceptance (현실 거부 → 직면 → 수용)",
  "  ARC-M2: Numbness → Memory Flood → Return to Silence (무감각 → 기억 홍수 → 다시 고요)",
  "  ARC-M3: Distance → Longing → Letting Go (거리 → 그리움 → 내려놓음)",
  "",
  "CHILL / PEACEFUL / DREAMY moods — choose one:",
  "  ARC-C1: Still → Drift → Anchor (정지 → 부유 → 착지)",
  "  ARC-C2: Routine → Noticing Beauty → Gratitude (무심 → 발견 → 감사)",
  "  ARC-C3: Solitude → Connection → Return to Self (고독 → 연결 → 귀환)",
  "",
  "ENERGETIC / EPIC / AGGRESSIVE moods — choose one:",
  "  ARC-E1: Doubt → Ignition → Breakthrough (의심 → 점화 → 돌파)",
  "  ARC-E2: Underdog → Pressure → Victory Declaration (열세 → 압박 → 선언)",
  "  ARC-E3: Anger → Focus → Controlled Power (분노 → 집중 → 절제된 힘)",
  "",
  "ROMANTIC / NOSTALGIC moods — choose one:",
  "  ARC-R1: Memory Surface → Emotional Flood → Present Decision (기억 부상 → 감정 홍수 → 현재 결정)",
  "  ARC-R2: Longing → Almost Touch → Retreat (그리움 → 닿을 듯 → 물러섬)",
  "  ARC-R3: Ordinary Moment → Realization → Declaration (평범한 순간 → 깨달음 → 고백)",
  "",
  "[ARC IMPLEMENTATION]",
  "- Verse1 = Arc Phase 1 (opening emotional state)",
  "- Pre-Chorus = tension/trigger that forces Arc Phase 2",
  "- Hook = identity line colored by Arc Phase 2",
  "- Verse2 = escalation deeper into Arc Phase 2",
  "- Bridge = Arc Phase 3 (the turn — decision/reversal/confession)",
  "- Final Hook/Outro = Arc Phase 3 integrated state (different feel from opening hook)",
  "",
  "[SHOW-DONT-TELL — STRICT]",
  "- NEVER write: 'I feel sad / I'm happy / I miss you / I love you' as standalone lines.",
  "- Instead: show the object, action, or environment that carries the emotion.",
  "  BAD:  'I miss you so much'",
  "  GOOD: 'your jacket still hangs / I can't move it'",
  "  BAD:  'I'm lonely tonight'",
  "  GOOD: 'two cups on the table / I drink from one'",
  "- If emotion word must appear: pair it immediately with a physical scene on the same or next line.",
  "- Sensory rule: every 4 lines must contain at least one of: sound / light / texture / temperature / movement.",
  "",
  "[RHYTHM ENGINE]",
  "- English line band: 2-8 syllables per line (excluding parentheses content). Hard limit: 12.",
  "- Korean line band: 4-12 syllables per line. Hard limit: 16.",
  "- Build lines by stress-friendly chunks, not prose sentences.",
  "- Prefer 2-beat / 3-beat / 4-beat phrase groupings.",
  "- Each section must contain: short punch lines (2-4 syl), medium carry lines (5-7 syl), one anchor line.",
  "- Hook lines: shorter and tighter than verse. Must land on clean accents.",
  "- Consecutive lines must contrast in length. Never 4+ lines of equal syllable count in a row.",
  "- Strong verbs fall near end of line when possible.",
  "- Vowel flow: avoid heavy hard-consonant clusters mid-line.",
  "",
  "[RAP MODE — activated for Hip-Hop / Trap / Drill]",
  "- End rhyme scheme: AABB or ABAB maintained throughout each verse.",
  "- Internal rhyme: at least 2 per verse (mid-word rhyme within the same line).",
  "- A/B bar structure: A-bar = scene/action description, B-bar = reversal or punchline.",
  "- Punchline types (use 2+ per verse):",
  "  CONTRAST PUNCH: set up one world, flip it in the last 3 words.",
  "    Example: 'said she wanted real — she just wanted the reel'",
  "  RHYME PUNCH: two lines where the second recontextualizes the first via rhyme.",
  "    Example: 'built this from the ground / now they act like they found'",
  "  METAPHOR FLIP: start literal, end with unexpected metaphor.",
  "    Example: 'hands in my pocket / brain turned into rocket'",
  "- Korean rap: 된소리 라임 (깍/딱/빡), 장모음 라임 (봐/봐/봐), 3음절 연속 라임 강조.",
  "",
  "[CLARITY ENGINE]",
  "- Every section must be understandable on first listen.",
  "- Prefer short subject-verb-object lines over abstract phrasing.",
  "- Never stack more than one metaphor in a single line.",
  "- Important emotional lines: plain words only.",
  "- If a line is beautiful but slows comprehension: simplify it.",
  "- At least 50% of lines must be paraphrasable in casual speech.",
  "",
  "[KEYWORDCOMBO ENGINE]",
  "- Detect topic X from user input.",
  "- Internally generate 10 Seeds, auto-select best 1.",
  "- Seed format: [X+IMAGE] / [ACTION] / [FLIP]",
  "  IMAGE = concrete object (not concept).",
  "  ACTION = verb that shows the emotion.",
  "  FLIP = contrast word or unexpected pivot.",
  "- PRIMARY SEED must appear in: Hook core line, scene setting, Verse2 contrast, Bridge punchline.",
  "- Repeat limit: IMAGE word max 3x, FLIP word max 4x.",
  "",
  "[SCENE LOCK]",
  "- Lock 1 dominant physical space before writing. All lines camera-filmable from that space.",
  "- Emotion shown through: objects / actions / environment choices only.",
  "- Metaphors must be derived from objects that exist within the locked scene.",
  "",
  "[OBJECT MOTIF]",
  "- Use 5-9 props total. Pick 2-3 as recurring motifs.",
  "- Motif rule: same object appears 2-3 times across sections, each time with different emotional meaning.",
  "- Example: 'key' in Verse1 = routine. 'key' in Bridge = choice to leave. 'key' in Outro = left on the counter.",
  "",
  "[HOOK SYSTEM]",
  "- Hook = the single most memorable sentence of the song.",
  "- Hook appears minimum 2 times.",
  "- Hook Core Line rules:",
  "  Must use () for adlibs.",
  "  () content max 5 words. () carries echo/emphasis only, never narrative.",
  "  Adlib vocab: mm, mhm, uh, ah, oh, ooh, woo, yeah, nah, hey, woah, la-la, na-na, uh-huh.",
  "  No '~' symbol. Use hyphens for repeats: oh-oh, woo-woo.",
  "  Outside (): max 6 words recommended.",
  "  Should sound like something a person would say in the locked scene.",
  "- Hook must sound like the direct result of Pre-Chorus trigger.",
  "- Same line consecutive max 2 times. Other repeats: 1 micro-variation only.",
  "",
  "[NARRATIVE ENGINE]",
  "- 1 song = 1 event + 1 conflict + 1 turn + 1 ending.",
  "- Internal tracking: speaker / listener / desire / final change.",
  "- POV consistency maintained throughout.",
  "- Pre-Chorus trigger: must be a visible action/sound/choice — not a feeling.",
  "",
  "[DEVICES ENGINE]",
  "- Natural inclusion across song: metaphor, simile, inversion, exclamation, parallelism, rhyme, punchline.",
  "- Genre placement:",
  "  Verse1: metaphor or simile to anchor the scene.",
  "  Verse2: parallelism + inversion to escalate.",
  "  Bridge or Final: exclamation + punchline for the turn.",
  "- Internal rhyme: 1+ times per song minimum.",
  "- Parallel structure: 1+ pairs minimum.",
  "",
  "[ANTI-CLONE RULE]",
  "- When topic repeats from previous: ban reuse of:",
  "  1) primary seed image word",
  "  2) hook core line verb",
  "  3) scene setting location",
  "  4) bridge decision verb.",
  "- Replace all four with new choices consistent with selected arc.",
  "",
  "[HUMAN SPEECH FILTER]",
  "- Final pass: if a line reads like a greeting card or ad slogan → revise internally.",
  "- Exception: Hook Core Line may be caption-style if it has scene plausibility.",
  "",
  "[BANNED WORDS — ZERO TOLERANCE]",
  "- NEVER use in any lyrics:",
  "  neon, neons, neon-lit, neon-soaked, neon glow, neon sign, neon light, fluorescent",
  "  번져, 번지다, 번진, 번지는, 번져가, 번져서, 퍼져, 퍼지다, 퍼진, 스며들어, 흘러내려",
  "  shattered, broken pieces, fade away, falling apart, lost in the dark",
  "  빛나다(단독), 반짝이다(단독), 아름다워(단독)",
  "- These are lyric cliches. Replace with scene-specific concrete alternatives.",
  "- If caught writing a banned word: delete and replace before output.",
  "",
  "[DIRECT OUTPUT LOCK]",
  "- Output lyrics only. No explanations, no analysis, no emoji.",
  "- Section labels only: [Verse], [Pre-Chorus], [Hook], [Bridge], [Outro].",
  "- Variation and arc selection are internal. Never print them.",
  "",
  "[FINAL VALIDATION — run before output]",
  "- [ ] Lines within syllable band",
  "- [ ] Scene visibility: every line filmable",
  "- [ ] Object motif appears 2-3x with meaning shift",
  "- [ ] Hook appears 2+ times",
  "- [ ] Pre-Chorus has visible trigger (action/sound/choice)",
  "- [ ] Hook sounds like result of that trigger",
  "- [ ] Bridge contains the arc turn",
  "- [ ] () rules followed in Hook",
  "- [ ] No standalone emotion statements",
  "- [ ] No banned words",
  "- [ ] No decorative rhetoric without scene/narrative support",
  "- On any failure: revise internally before output."
].join("\n");

// ===== 금지 단어 시스템 =====
export var BANNED_WORDS: { word: string; similar: string[]; replacement: string }[] = [
  {
    word: "neon",
    similar: ["neons", "neon-lit", "neon-soaked", "neon glow", "neon sign", "neon light", "fluorescent"],
    replacement: "pale"
  },
  {
    word: "번져",
    similar: ["번지다", "번진", "번지는", "번져가", "번져서", "퍼져", "퍼지다", "퍼진", "스며들어", "흘러내려"],
    replacement: "사라져"
  },
  {
    word: "shattered",
    similar: ["broken pieces", "fade away", "falling apart", "lost in the dark"],
    replacement: "left behind"
  }
];

// 금지 단어 필터
export function filterBannedWords(text: string): string {
  var filtered = text;
  for (var i = 0; i < BANNED_WORDS.length; i++) {
    var ban = BANNED_WORDS[i];
    var mainRegex = new RegExp(ban.word, "gi");
    filtered = filtered.replace(mainRegex, ban.replacement);
    for (var j = 0; j < ban.similar.length; j++) {
      var simRegex = new RegExp(ban.similar[j], "gi");
      filtered = filtered.replace(simRegex, ban.replacement);
    }
  }
  return filtered;
}

// ===== Claude API용 가사 생성 프롬프트 빌더 =====
// topic-pool.ts의 추천 시스템 데이터를 구조화하여 Claude에 전달
export function buildLyricsPrompt(params: {
  genre: string;
  moods: string[];
  theme: string;
  vocal: string;
  language: string;
  // topic-pool 추천 데이터 (있을 때만 전달)
  seedObjects?: string[];
  seedPlaces?: string[];
  seedActions?: string[];
  seedSounds?: string[];
  hookPattern?: string;
  writingTechnique?: string;
  techniqueDesc?: string;
}): string {

  // 언어별 규칙 주입
  var langInstruction = "";
  if (params.language === "ko") {
    langInstruction = [
      "Write ALL lyrics in Korean.",
      "Korean syllable rule: 4-12 syllables per line.",
      "Use 의성어/의태어 (e.g., 툭, 쿵, 스르륵, 슬렁, 느릿느릿) as rhythmic anchors — minimum 2 per song.",
      "Korean rhyme: use 모음 라임 or 종성 라임 in Hook. Use 연속 라임 at least once in a verse.",
      "Code-switch rule: ONE English phrase in the Hook is allowed if it sounds natural when sung."
    ].join("\n");
  } else if (params.language === "both") {
    langInstruction = [
      "Write lyrics mixing English and Korean naturally.",
      "Suggested structure: English verse + Korean Pre-Chorus/Bridge, or full Korean with English Hook phrase.",
      "Code-switch must feel earned by the rhythm, not random.",
      "When Korean appears: use 4-12 syllable lines and include 의성어/의태어."
    ].join("\n");
  } else {
    langInstruction = "Write ALL lyrics in English.";
  }

  // 랩 모드 주입
  var isRap = params.genre.toLowerCase().indexOf("hip") !== -1
    || params.genre.toLowerCase().indexOf("rap") !== -1
    || params.genre.toLowerCase().indexOf("trap") !== -1
    || params.genre.toLowerCase().indexOf("drill") !== -1;

  var rapInstruction = isRap
    ? [
        "",
        "[RAP MODE ACTIVE]",
        "- Maintain end rhyme (AABB or ABAB) throughout each verse.",
        "- 2+ internal rhymes per verse.",
        "- A/B bar: A = scene/action, B = reversal or punchline.",
        "- Include 2+ punchlines per verse: CONTRAST PUNCH or RHYME PUNCH or METAPHOR FLIP.",
        "- Punchline must land in the last 3 words of a line."
      ].join("\n")
    : "";

  // topic-pool 추천 데이터 주입 (있을 때)
  var seedBlock = "";
  if (params.seedObjects && params.seedObjects.length > 0) {
    seedBlock = [
      "",
      "[SCENE SEED — use these as your raw material]",
      "Objects to work with: " + params.seedObjects.slice(0, 5).join(", "),
      params.seedPlaces && params.seedPlaces.length > 0
        ? "Possible locations: " + params.seedPlaces.slice(0, 3).join(", ")
        : "",
      params.seedActions && params.seedActions.length > 0
        ? "Action verbs: " + params.seedActions.slice(0, 5).join(", ")
        : "",
      params.seedSounds && params.seedSounds.length > 0
        ? "Sound palette: " + params.seedSounds.slice(0, 3).join(", ")
        : "",
      params.hookPattern
        ? "Hook pattern suggestion: " + params.hookPattern
        : "",
      params.writingTechnique
        ? "Writing technique: " + params.writingTechnique + (params.techniqueDesc ? " — " + params.techniqueDesc : "")
        : "",
      "Pick 2-3 of these as recurring motifs. Do not use all of them."
    ].filter(function(l) { return l !== ""; }).join("\n");
  }

  var prompt = [
    "Write a complete song for the following parameters:",
    "",
    "Genre: " + params.genre,
    "Mood: " + params.moods.join(", "),
    "Topic/Theme: " + (params.theme || "freestyle — choose a compelling, specific topic"),
    "Vocal Style: " + (params.vocal || "not specified"),
    "",
    langInstruction,
    rapInstruction,
    seedBlock,
    "",
    "Follow ALL rules in your system prompt exactly.",
    "Output lyrics only. No explanations. No commentary.",
    "Section labels: [Verse], [Pre-Chorus], [Hook], [Bridge], [Outro]",
    "Hook must appear at minimum 2 times.",
    "Minimum 24 lines excluding labels.",
    "Use () for adlibs in Hook sections only."
  ].filter(function(l) { return l !== undefined; }).join("\n");

  return prompt;
}

// ===== 가사 검증 =====
export function validateLyrics(lyrics: string): {
  valid: boolean;
  issues: string[];
} {
  var issues: string[] = [];
  var lines = lyrics.split("\n").filter(function(l) {
    return l.trim() && !l.trim().startsWith("[");
  });

  // 최소 줄 수 확인
  if (lines.length < 20) {
    issues.push("가사가 너무 짧음 (" + lines.length + "줄, 최소 24줄 권장)");
  }

  // Hook 존재 확인
  var hookCount = (lyrics.match(/\[Hook\]/gi) || []).length;
  if (hookCount < 2) {
    issues.push("Hook이 " + hookCount + "회만 등장 (최소 2회 필요)");
  }

  // Bridge 존재 확인
  if (lyrics.indexOf("[Bridge]") === -1) {
    issues.push("Bridge 섹션 없음");
  }

  // 금지 단어 확인
  for (var i = 0; i < BANNED_WORDS.length; i++) {
    var ban = BANNED_WORDS[i];
    if (lyrics.toLowerCase().indexOf(ban.word.toLowerCase()) !== -1) {
      issues.push("금지 단어 발견: " + ban.word);
    }
    for (var j = 0; j < ban.similar.length; j++) {
      if (lyrics.toLowerCase().indexOf(ban.similar[j].toLowerCase()) !== -1) {
        issues.push("금지 유사어 발견: " + ban.similar[j]);
      }
    }
  }

  // () 확인 (Hook 내)
  var hookSections = lyrics.split(/\[Hook\]/i);
  if (hookSections.length > 1) {
    var hasParens = false;
    for (var k = 1; k < hookSections.length; k++) {
      var section = hookSections[k].split("[")[0];
      if (section.indexOf("(") !== -1) hasParens = true;
    }
    if (!hasParens) {
      issues.push("Hook에 () adlib 없음 (권장)");
    }
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}
