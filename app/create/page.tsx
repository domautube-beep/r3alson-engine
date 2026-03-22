"use client";

import { useState } from "react";
import Link from "next/link";
import trendsData from "@/data/trends.json";
import { useApiKey } from "@/lib/api-key-context";

// ===== 장르 (50+) =====
var GENRE_CATEGORIES: Record<string, string[]> = {
  "힙합/랩": ["Hip Hop", "Trap", "Boom Bap", "Lo-Fi Hip Hop", "Cloud Rap", "Drill", "Mumble Rap", "Old School Hip Hop", "Phonk", "Emo Rap"],
  "팝": ["Pop", "Indie Pop", "Synth Pop", "K-Pop", "Dream Pop", "Electropop", "Art Pop", "Chamber Pop", "Bedroom Pop", "Ethereal Pop"],
  "R&B/소울": ["R&B", "Neo Soul", "Contemporary R&B", "Smooth R&B", "Alternative R&B", "Soul", "Motown", "Funk"],
  "일렉트로닉": ["EDM", "House", "Deep House", "Techno", "Trance", "Dubstep", "Drum and Bass", "Future Bass", "Synthwave", "Ambient Electronic", "Chillwave", "Vaporwave"],
  "록/메탈": ["Rock", "Indie Rock", "Alternative Rock", "Punk Rock", "Post Rock", "Shoegaze", "Grunge", "Heavy Metal", "Progressive Rock", "Psychedelic Rock", "Garage Rock"],
  "어쿠스틱/포크": ["Acoustic", "Folk", "Indie Folk", "Country", "Bluegrass", "Singer-Songwriter", "Bossa Nova"],
  "재즈/블루스": ["Jazz", "Smooth Jazz", "Bebop", "Jazz Fusion", "Blues", "Delta Blues", "Jazz Hop"],
  "앰비언트/뉴에이지": ["Ambient", "Dark Ambient", "Drone", "New Age", "Meditation", "Sleep Music", "Study / Deep Focus", "Nature Sounds"],
  "클래식/오케스트라": ["Classical", "Cinematic Orchestral", "Film Score", "Piano Solo", "String Quartet", "Opera", "Baroque"],
  "월드/라틴": ["Reggaeton", "Latin Pop", "Afrobeats", "K-Pop", "J-Pop", "Bossa Nova", "Samba", "Dancehall", "Reggae"],
  "기타": ["Gospel", "Musical Theater", "Video Game OST", "Lounge", "Chiptune", "Experimental"]
};

// 전체 장르 플랫 리스트 (중복 제거)
var ALL_GENRES: string[] = [];
Object.values(GENRE_CATEGORIES).forEach(function(genres) {
  genres.forEach(function(g) {
    if (ALL_GENRES.indexOf(g) === -1) ALL_GENRES.push(g);
  });
});

// ===== 무드 (40+) =====
var MOOD_CATEGORIES: Record<string, string[]> = {
  "어두운": ["Melancholic", "Dark", "Eerie", "Haunting", "Mysterious", "Sinister", "Brooding", "Somber", "Tragic"],
  "밝은": ["Happy", "Euphoric", "Uplifting", "Triumphant", "Cheerful", "Playful", "Bright", "Joyful"],
  "차분한": ["Chill", "Peaceful", "Calm", "Serene", "Meditative", "Soothing", "Gentle", "Tranquil"],
  "감성적": ["Romantic", "Nostalgic", "Bittersweet", "Sentimental", "Tender", "Wistful", "Longing", "Heartfelt"],
  "에너지": ["Energetic", "Aggressive", "Intense", "Powerful", "Fierce", "Bold", "Rebellious", "Wild"],
  "분위기": ["Dreamy", "Atmospheric", "Ethereal", "Cinematic", "Epic", "Warm", "Groovy", "Psychedelic", "Hypnotic", "Surreal", "Futuristic"]
};

var ALL_MOODS: string[] = [];
Object.values(MOOD_CATEGORIES).forEach(function(moods) {
  moods.forEach(function(m) {
    if (ALL_MOODS.indexOf(m) === -1) ALL_MOODS.push(m);
  });
});

// ===== 보컬 스타일 =====
var VOCAL_STYLES: Record<string, string[]> = {
  "남성": ["Deep Male Vocals", "Smooth Male Vocals", "Raspy Male Vocals", "Falsetto Male", "Male Rap", "Male Whisper"],
  "여성": ["Soft Female Vocals", "Powerful Female Vocals", "Breathy Female", "Angelic Female", "Female Rap", "Female Whisper"],
  "특수": ["Choir", "Distant Reverb Vocals", "Auto-tuned Vocals", "Vocoder", "Spoken Word", "Humming", "Ad-libs Only"],
  "없음": ["Instrumental (No Vocals)"]
};

var ALL_VOCALS: string[] = [];
Object.values(VOCAL_STYLES).forEach(function(v) {
  v.forEach(function(s) {
    if (ALL_VOCALS.indexOf(s) === -1) ALL_VOCALS.push(s);
  });
});

// ===== 악기 =====
var INSTRUMENT_CATEGORIES: Record<string, string[]> = {
  "건반": ["Piano", "Electric Piano", "Organ", "Synth Pad", "Analog Synth", "Wurlitzer", "Rhodes", "Harpsichord"],
  "기타": ["Acoustic Guitar", "Electric Guitar", "Fingerstyle Guitar", "Distorted Guitar", "Clean Guitar", "12-String Guitar", "Slide Guitar", "Bass Guitar"],
  "드럼/비트": ["Drum Machine", "808 Bass", "Trap Hi-Hats", "Lo-Fi Drums", "Live Drums", "Brushed Drums", "Boom Bap Drums", "Breakbeat"],
  "현악기": ["Strings", "Violin", "Cello", "Orchestral Strings", "Pizzicato", "Harp"],
  "관악기": ["Trumpet", "Saxophone", "Flute", "French Horn", "Brass Section", "Clarinet"],
  "신디/전자": ["Arpeggiated Synth", "Pad Synth", "Lead Synth", "Sub Bass", "Wobble Bass", "Glitch", "Vocoder Synth"],
  "분위기": ["Vinyl Crackle", "Rain Sounds", "Field Recordings", "Ambient Textures", "Tape Hiss", "Wind Chimes", "Music Box", "Bells"]
};

// ===== 장르별 연관 추천 매핑 =====
var GENRE_RECOMMENDATIONS: Record<string, {
  moods: string[];
  vocals: string[];
  instruments: string[];
  bpm: number;
}> = {
  "Hip Hop": { moods: ["Groovy", "Bold", "Dark"], vocals: ["Male Rap", "Deep Male Vocals"], instruments: ["808 Bass", "Boom Bap Drums", "Drum Machine"], bpm: 90 },
  "Trap": { moods: ["Dark", "Aggressive", "Intense"], vocals: ["Male Rap", "Auto-tuned Vocals"], instruments: ["808 Bass", "Trap Hi-Hats", "Sub Bass"], bpm: 140 },
  "Boom Bap": { moods: ["Nostalgic", "Groovy", "Bold"], vocals: ["Male Rap", "Deep Male Vocals"], instruments: ["Boom Bap Drums", "Vinyl Crackle", "Piano"], bpm: 90 },
  "Lo-Fi Hip Hop": { moods: ["Chill", "Nostalgic", "Dreamy"], vocals: ["Instrumental (No Vocals)", "Humming"], instruments: ["Lo-Fi Drums", "Vinyl Crackle", "Rhodes", "Piano"], bpm: 80 },
  "Cloud Rap": { moods: ["Dreamy", "Ethereal", "Atmospheric"], vocals: ["Auto-tuned Vocals", "Breathy Female"], instruments: ["Pad Synth", "808 Bass", "Ambient Textures"], bpm: 130 },
  "Drill": { moods: ["Aggressive", "Dark", "Intense"], vocals: ["Male Rap", "Female Rap"], instruments: ["808 Bass", "Trap Hi-Hats", "Lead Synth"], bpm: 140 },
  "Phonk": { moods: ["Dark", "Aggressive", "Mysterious"], vocals: ["Male Rap", "Deep Male Vocals"], instruments: ["808 Bass", "Drum Machine", "Analog Synth"], bpm: 130 },
  "Emo Rap": { moods: ["Melancholic", "Haunting", "Bittersweet"], vocals: ["Auto-tuned Vocals", "Raspy Male Vocals"], instruments: ["Electric Guitar", "808 Bass", "Piano"], bpm: 130 },
  "Pop": { moods: ["Happy", "Bright", "Energetic"], vocals: ["Soft Female Vocals", "Smooth Male Vocals"], instruments: ["Analog Synth", "Live Drums", "Electric Piano"], bpm: 120 },
  "Indie Pop": { moods: ["Warm", "Dreamy", "Nostalgic"], vocals: ["Soft Female Vocals", "Breathy Female"], instruments: ["Acoustic Guitar", "Piano", "Live Drums"], bpm: 110 },
  "Synth Pop": { moods: ["Energetic", "Bright", "Futuristic"], vocals: ["Smooth Male Vocals", "Powerful Female Vocals"], instruments: ["Analog Synth", "Arpeggiated Synth", "Drum Machine"], bpm: 120 },
  "K-Pop": { moods: ["Energetic", "Bold", "Euphoric"], vocals: ["Powerful Female Vocals", "Male Rap"], instruments: ["Analog Synth", "Live Drums", "Lead Synth", "808 Bass"], bpm: 125 },
  "Dream Pop": { moods: ["Dreamy", "Ethereal", "Atmospheric"], vocals: ["Breathy Female", "Distant Reverb Vocals"], instruments: ["Electric Guitar", "Pad Synth", "Ambient Textures"], bpm: 100 },
  "Bedroom Pop": { moods: ["Warm", "Chill", "Tender"], vocals: ["Soft Female Vocals", "Breathy Female"], instruments: ["Acoustic Guitar", "Lo-Fi Drums", "Electric Piano"], bpm: 100 },
  "Ethereal Pop": { moods: ["Dreamy", "Ethereal", "Romantic"], vocals: ["Angelic Female", "Distant Reverb Vocals"], instruments: ["Pad Synth", "Strings", "Piano"], bpm: 100 },
  "R&B": { moods: ["Romantic", "Warm", "Groovy"], vocals: ["Smooth Male Vocals", "Soft Female Vocals"], instruments: ["Electric Piano", "Bass Guitar", "Live Drums"], bpm: 85 },
  "Neo Soul": { moods: ["Warm", "Groovy", "Sentimental"], vocals: ["Smooth Male Vocals", "Breathy Female"], instruments: ["Rhodes", "Bass Guitar", "Live Drums", "Wurlitzer"], bpm: 85 },
  "Contemporary R&B": { moods: ["Romantic", "Dark", "Atmospheric"], vocals: ["Breathy Female", "Falsetto Male"], instruments: ["808 Bass", "Pad Synth", "Electric Piano"], bpm: 90 },
  "Funk": { moods: ["Groovy", "Energetic", "Playful"], vocals: ["Powerful Female Vocals", "Deep Male Vocals"], instruments: ["Bass Guitar", "Electric Guitar", "Live Drums", "Organ"], bpm: 110 },
  "EDM": { moods: ["Euphoric", "Energetic", "Intense"], vocals: ["Powerful Female Vocals", "Auto-tuned Vocals"], instruments: ["Lead Synth", "Sub Bass", "Arpeggiated Synth"], bpm: 128 },
  "House": { moods: ["Groovy", "Euphoric", "Energetic"], vocals: ["Soft Female Vocals", "Distant Reverb Vocals"], instruments: ["Drum Machine", "Sub Bass", "Pad Synth"], bpm: 124 },
  "Deep House": { moods: ["Chill", "Groovy", "Atmospheric"], vocals: ["Breathy Female", "Distant Reverb Vocals"], instruments: ["Sub Bass", "Pad Synth", "Rhodes"], bpm: 122 },
  "Techno": { moods: ["Dark", "Intense", "Hypnotic"], vocals: ["Instrumental (No Vocals)", "Vocoder"], instruments: ["Drum Machine", "Sub Bass", "Analog Synth"], bpm: 130 },
  "Dubstep": { moods: ["Aggressive", "Dark", "Intense"], vocals: ["Auto-tuned Vocals", "Vocoder"], instruments: ["Wobble Bass", "Sub Bass", "Drum Machine"], bpm: 140 },
  "Future Bass": { moods: ["Euphoric", "Dreamy", "Bright"], vocals: ["Angelic Female", "Auto-tuned Vocals"], instruments: ["Lead Synth", "Pad Synth", "808 Bass"], bpm: 150 },
  "Synthwave": { moods: ["Nostalgic", "Energetic", "Mysterious"], vocals: ["Smooth Male Vocals", "Vocoder"], instruments: ["Analog Synth", "Arpeggiated Synth", "Drum Machine"], bpm: 115 },
  "Chillwave": { moods: ["Dreamy", "Nostalgic", "Chill"], vocals: ["Distant Reverb Vocals", "Breathy Female"], instruments: ["Pad Synth", "Lo-Fi Drums", "Tape Hiss"], bpm: 95 },
  "Rock": { moods: ["Energetic", "Bold", "Rebellious"], vocals: ["Raspy Male Vocals", "Powerful Female Vocals"], instruments: ["Distorted Guitar", "Live Drums", "Bass Guitar"], bpm: 130 },
  "Indie Rock": { moods: ["Nostalgic", "Warm", "Bittersweet"], vocals: ["Raspy Male Vocals", "Soft Female Vocals"], instruments: ["Electric Guitar", "Live Drums", "Bass Guitar"], bpm: 120 },
  "Post Rock": { moods: ["Epic", "Atmospheric", "Cinematic"], vocals: ["Instrumental (No Vocals)", "Distant Reverb Vocals"], instruments: ["Electric Guitar", "Strings", "Live Drums", "Ambient Textures"], bpm: 100 },
  "Shoegaze": { moods: ["Dreamy", "Atmospheric", "Haunting"], vocals: ["Distant Reverb Vocals", "Breathy Female"], instruments: ["Distorted Guitar", "Pad Synth", "Live Drums"], bpm: 100 },
  "Heavy Metal": { moods: ["Aggressive", "Fierce", "Dark"], vocals: ["Raspy Male Vocals", "Deep Male Vocals"], instruments: ["Distorted Guitar", "Live Drums", "Bass Guitar"], bpm: 160 },
  "Acoustic": { moods: ["Warm", "Peaceful", "Tender"], vocals: ["Soft Female Vocals", "Smooth Male Vocals"], instruments: ["Acoustic Guitar", "Piano", "Brushed Drums"], bpm: 90 },
  "Folk": { moods: ["Warm", "Nostalgic", "Heartfelt"], vocals: ["Smooth Male Vocals", "Soft Female Vocals"], instruments: ["Fingerstyle Guitar", "Acoustic Guitar", "Brushed Drums"], bpm: 100 },
  "Indie Folk": { moods: ["Tender", "Warm", "Bittersweet"], vocals: ["Breathy Female", "Smooth Male Vocals"], instruments: ["Acoustic Guitar", "Piano", "Strings"], bpm: 95 },
  "Jazz": { moods: ["Groovy", "Warm", "Mysterious"], vocals: ["Smooth Male Vocals", "Soft Female Vocals"], instruments: ["Piano", "Saxophone", "Brushed Drums", "Bass Guitar"], bpm: 120 },
  "Smooth Jazz": { moods: ["Calm", "Warm", "Romantic"], vocals: ["Smooth Male Vocals", "Soft Female Vocals"], instruments: ["Saxophone", "Electric Piano", "Bass Guitar"], bpm: 95 },
  "Blues": { moods: ["Melancholic", "Sentimental", "Warm"], vocals: ["Raspy Male Vocals", "Powerful Female Vocals"], instruments: ["Electric Guitar", "Piano", "Live Drums"], bpm: 80 },
  "Ambient": { moods: ["Peaceful", "Atmospheric", "Ethereal"], vocals: ["Instrumental (No Vocals)", "Humming"], instruments: ["Pad Synth", "Ambient Textures", "Field Recordings"], bpm: 70 },
  "Dark Ambient": { moods: ["Eerie", "Mysterious", "Haunting"], vocals: ["Instrumental (No Vocals)", "Distant Reverb Vocals"], instruments: ["Pad Synth", "Ambient Textures", "Sub Bass", "Field Recordings"], bpm: 75 },
  "Study / Deep Focus": { moods: ["Peaceful", "Calm", "Gentle"], vocals: ["Instrumental (No Vocals)"], instruments: ["Piano", "Ambient Textures", "Pad Synth"], bpm: 100 },
  "Cinematic Orchestral": { moods: ["Epic", "Cinematic", "Triumphant"], vocals: ["Choir", "Instrumental (No Vocals)"], instruments: ["Orchestral Strings", "Brass Section", "Live Drums", "Piano"], bpm: 90 },
  "Film Score": { moods: ["Cinematic", "Mysterious", "Epic"], vocals: ["Instrumental (No Vocals)", "Choir"], instruments: ["Strings", "Piano", "Brass Section", "Harp"], bpm: 85 },
  "Piano Solo": { moods: ["Melancholic", "Peaceful", "Romantic"], vocals: ["Instrumental (No Vocals)"], instruments: ["Piano"], bpm: 80 },
  "Reggaeton": { moods: ["Energetic", "Groovy", "Playful"], vocals: ["Male Rap", "Powerful Female Vocals"], instruments: ["Drum Machine", "Sub Bass", "Lead Synth"], bpm: 95 },
  "Afrobeats": { moods: ["Energetic", "Groovy", "Warm"], vocals: ["Smooth Male Vocals", "Powerful Female Vocals"], instruments: ["Live Drums", "Bass Guitar", "Lead Synth"], bpm: 108 },
  "Reggae": { moods: ["Peaceful", "Warm", "Groovy"], vocals: ["Smooth Male Vocals", "Deep Male Vocals"], instruments: ["Electric Guitar", "Bass Guitar", "Live Drums", "Organ"], bpm: 80 },
  "Gospel": { moods: ["Uplifting", "Euphoric", "Heartfelt"], vocals: ["Choir", "Powerful Female Vocals"], instruments: ["Piano", "Organ", "Live Drums"], bpm: 100 },
  "Country": { moods: ["Warm", "Nostalgic", "Heartfelt"], vocals: ["Smooth Male Vocals", "Soft Female Vocals"], instruments: ["Acoustic Guitar", "Slide Guitar", "Fingerstyle Guitar", "Live Drums"], bpm: 110 }
};

// 장르 기반 추천 가져오기
function getRecommendations(selectedGenre: string) {
  return GENRE_RECOMMENDATIONS[selectedGenre] || null;
}

export default function CreatePage() {
  var { apiKey, isKeySet, ownerPassword, isOwnerMode } = useApiKey();

  // 상태 관리
  var [step, setStep] = useState(1);
  var [language, setLanguage] = useState("en");
  var [sectionLength, setSectionLength] = useState("normal");
  var [mode, setMode] = useState(""); // trend, free, hybrid
  var [genre, setGenre] = useState("");
  var [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  var [bpm, setBpm] = useState(80);
  var [selectedVocal, setSelectedVocal] = useState("");
  var [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  var [genreCategory, setGenreCategory] = useState("");
  var [moodCategory, setMoodCategory] = useState("");
  var [lyricsMode, setLyricsMode] = useState("ai"); // none, ai, manual, hybrid
  var [lyricsTheme, setLyricsTheme] = useState("");
  var [generatedLyrics, setGeneratedLyrics] = useState("");
  var [generatedPrompt, setGeneratedPrompt] = useState("");
  var [generatedTitle, setGeneratedTitle] = useState("");
  var [generatedTags, setGeneratedTags] = useState("");
  var [isGenerating, setIsGenerating] = useState(false);
  var [isDemo, setIsDemo] = useState(false);
  var [copied, setCopied] = useState("");
  var [playlistCount, setPlaylistCount] = useState(5);
  var [playlistTracks, setPlaylistTracks] = useState<{title: string; prompt: string; lyrics: string; variation: string}[]>([]);
  var [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
  var [expandedTrack, setExpandedTrack] = useState<number | null>(null);
  var [customMood, setCustomMood] = useState("");

  // 장르 선택 시 추천값 자동 세팅
  function selectGenre(g: string) {
    setGenre(g);
    var rec = getRecommendations(g);
    if (rec) {
      // 하이브리드/트렌드 모드면 자동 채움, 자유 모드면 비워둠
      if (mode !== "free") {
        setSelectedMoods(rec.moods);
        setSelectedVocal(rec.vocals[0] || "");
        setBpm(rec.bpm);
      } else {
        // 자유 모드에서도 BPM만 추천값으로
        setBpm(rec.bpm);
      }
    }
  }

  // 트렌드 모드에서 자동 세팅
  function applyTrendMode() {
    var top = trendsData.trends[0];
    setGenre(top.genre);
    var rec = getRecommendations(top.genre);
    if (rec) {
      setSelectedMoods(rec.moods);
      setSelectedVocal(rec.vocals[0] || "");
      setBpm(rec.bpm);
    } else {
      setSelectedMoods(top.mood);
      setBpm(parseInt(top.avgBpm.split("-")[0]) + 5);
    }
    setMode("trend");
    setStep(2);
  }

  // 무드 토글
  function toggleMood(m: string) {
    if (selectedMoods.includes(m)) {
      setSelectedMoods(selectedMoods.filter(function (x) { return x !== m; }));
    } else {
      setSelectedMoods(selectedMoods.concat([m]));
    }
  }

  // 악기 토글
  function toggleInstrument(inst: string) {
    if (selectedInstruments.includes(inst)) {
      setSelectedInstruments(selectedInstruments.filter(function(x) { return x !== inst; }));
    } else {
      setSelectedInstruments(selectedInstruments.concat([inst]));
    }
  }

  // 플레이리스트 배리에이션 생성
  async function generatePlaylist() {
    setIsGeneratingPlaylist(true);

    // 원곡 기반 배리에이션 전략
    var variations = [
      { label: "원곡 그대로", desc: "동일한 분위기의 시작곡" },
      { label: "템포 다운", desc: "BPM을 낮춰 더 차분하게" },
      { label: "악기 변화", desc: "다른 악기로 같은 감정을" },
      { label: "무드 시프트", desc: "살짝 다른 감정 색깔" },
      { label: "에너지 업", desc: "같은 테마, 더 강한 에너지" },
      { label: "어쿠스틱 버전", desc: "벗겨낸 느낌, 날것의 감정" },
      { label: "야간 버전", desc: "더 어둡고 깊은 시간대" },
      { label: "새벽 버전", desc: "고요하고 내밀한 분위기" },
      { label: "확장 버전", desc: "원곡을 더 크게 펼친 느낌" },
      { label: "미니멀 버전", desc: "최소한의 요소로 핵심만" }
    ];

    // BPM 배리에이션
    var bpmVariations = [0, -15, -5, +5, +20, -25, -10, -20, +10, -30];

    // 무드 시프트 풀
    var moodShifts: Record<string, string[]> = {
      "melancholic": ["bittersweet", "wistful", "tender", "somber", "nostalgic"],
      "dark": ["mysterious", "eerie", "brooding", "haunting", "sinister"],
      "chill": ["peaceful", "calm", "dreamy", "serene", "warm"],
      "energetic": ["bold", "fierce", "triumphant", "euphoric", "wild"],
      "dreamy": ["ethereal", "atmospheric", "surreal", "hypnotic", "peaceful"],
      "aggressive": ["fierce", "intense", "rebellious", "bold", "dark"],
      "nostalgic": ["bittersweet", "sentimental", "warm", "wistful", "tender"],
      "romantic": ["tender", "warm", "intimate", "sentimental", "dreamy"]
    };

    // 악기 교체 풀
    var instrumentSwaps: Record<string, string[]> = {
      "piano": ["rhodes", "electric piano", "wurlitzer", "harp", "music box"],
      "electric guitar": ["acoustic guitar", "clean guitar", "fingerstyle guitar", "slide guitar"],
      "acoustic guitar": ["piano", "ukulele", "fingerstyle guitar", "harp"],
      "808 bass": ["sub bass", "bass guitar", "synth bass"],
      "pad synth": ["strings", "ambient textures", "warm pads", "organ"],
      "live drums": ["brushed drums", "lo-fi drums", "drum machine", "minimal percussion"],
      "strings": ["cello", "violin", "orchestral strings", "harp"]
    };

    var tracks: {title: string; prompt: string; lyrics: string; variation: string}[] = [];

    for (var i = 0; i < playlistCount; i++) {
      var v = variations[i % variations.length];
      var trackBpm = Math.max(50, Math.min(180, bpm + bpmVariations[i % bpmVariations.length]));

      // 무드 배리에이션 — 모든 후속 트랙에 적용
      var trackMoods = selectedMoods.slice();
      if (i > 0) {
        var baseMood = selectedMoods[0] ? selectedMoods[0].toLowerCase() : "";
        var shifts = moodShifts[baseMood] || ["atmospheric", "warm", "gentle"];
        trackMoods = [shifts[i % shifts.length]].concat(selectedMoods.slice(1));
      }

      // 악기 배리에이션 — 모든 후속 트랙에 적용
      var trackInst = selectedInstruments.slice();
      if (i > 0 && trackInst.length > 0) {
        var swapTarget = trackInst[0].toLowerCase();
        var swapPool = instrumentSwaps[swapTarget];
        if (swapPool) {
          trackInst[0] = swapPool[i % swapPool.length];
        }
      }

      // 어쿠스틱 버전
      if (v.label === "어쿠스틱 버전") {
        trackInst = ["acoustic guitar", "soft percussion"];
        trackBpm = Math.max(50, bpm - 20);
      }

      // 미니멀 버전
      if (v.label === "미니멀 버전") {
        trackInst = trackInst.length > 0 ? [trackInst[0]] : ["piano"];
        trackBpm = Math.max(50, bpm - 10);
      }

      // 제목 배리에이션
      var titleSuffixes = ["", " II", " (Night)", " (Dawn)", " (Reprise)", " (Stripped)", " (Deep Cut)", " (Extended)", " (Minimal)", " (Live)"];
      var trackTitle = generatedTitle + titleSuffixes[i % titleSuffixes.length];

      // 각 트랙별 API 호출로 프롬프트 생성
      var headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["x-api-key"] = apiKey;
      if (isOwnerMode && ownerPassword) headers["x-owner-password"] = ownerPassword;

      try {
        var trackRes = await fetch("/api/generate", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            genre: genre,
            moods: trackMoods,
            bpm: trackBpm,
            vocal: selectedVocal,
            instruments: trackInst,
            lyricsMode: i === 0 ? "none" : lyricsMode,
            lyricsTheme: lyricsTheme ? lyricsTheme + " (" + v.label + " version)" : v.label,
            language: language,
            sectionLength: sectionLength
          })
        });
        var trackData = await trackRes.json();
        tracks.push({
          title: trackTitle,
          prompt: trackData.prompt || "",
          lyrics: i === 0 ? generatedLyrics : (trackData.lyrics || "(가사 생성 실패)"),
          variation: v.label + " — " + v.desc
        });
      } catch (err) {
        tracks.push({
          title: trackTitle,
          prompt: genre.toLowerCase() + ", " + trackMoods.join(", ").toLowerCase() + ", " + trackBpm + " bpm",
          lyrics: i === 0 ? generatedLyrics : "",
          variation: v.label + " — " + v.desc
        });
      }
    }

    setPlaylistTracks(tracks);
    setIsGeneratingPlaylist(false);
    setStep(5);
  }

  // 이전 스텝으로 돌아가기
  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  // 히스토리에 결과 저장
  function saveToHistory() {
    var entry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      genre: genre,
      moods: selectedMoods,
      vocal: selectedVocal,
      bpm: bpm,
      prompt: generatedPrompt,
      lyrics: generatedLyrics,
      title: generatedTitle,
      tags: generatedTags
    };
    var existing = JSON.parse(localStorage.getItem("r3alson_history") || "[]");
    existing.unshift(entry);
    localStorage.setItem("r3alson_history", JSON.stringify(existing.slice(0, 50)));
  }

  // 커스텀 무드 추가
  function addCustomMood() {
    if (customMood.trim() && !selectedMoods.includes(customMood.trim())) {
      setSelectedMoods(selectedMoods.concat([customMood.trim()]));
      setCustomMood("");
    }
  }

  // AI 생성 (프롬프트 + 가사 + 메타데이터)
  async function generateAll() {
    setIsGenerating(true);

    try {
      var headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["x-api-key"] = apiKey;
      if (isOwnerMode && ownerPassword) headers["x-owner-password"] = ownerPassword;

      var res = await fetch("/api/generate", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          genre: genre,
          moods: selectedMoods,
          bpm: bpm,
          vocal: selectedVocal,
          instruments: selectedInstruments,
          lyricsMode: lyricsMode,
          lyricsTheme: lyricsTheme,
          language: language,
          sectionLength: sectionLength
        })
      });

      var data = await res.json();
      setGeneratedPrompt(data.prompt || "");
      setGeneratedLyrics(data.lyrics || "");
      setGeneratedTitle(data.title || "");
      setGeneratedTags(data.tags || "");
      setIsDemo(!data.isAI);
    } catch (err) {
      setIsDemo(true);
    }

    setIsGenerating(false);
    setStep(4);
  }

  // 클립보드 복사
  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(function () { setCopied(""); }, 2000);
  }

  // 트렌드 데이터에서 현재 장르 정보 가져오기
  function getCurrentTrendInfo() {
    var found = trendsData.trends.find(function (t) { return t.genre === genre; });
    return found;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="flex items-center px-5 py-5">
        <button
          onClick={function() { if (step > 1) { goBack(); } else { window.location.href = "/"; } }}
          className="mr-4 w-10 h-10 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "#111118", color: "#7A7A8E" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">새 곡 만들기</h1>
          <div className="flex items-center gap-2 mt-1">
            {[1,2,3,4,5].map(function(s) {
              return <div key={s} className="h-1 flex-1 rounded-full transition-all duration-500" style={{ background: s <= step ? "linear-gradient(90deg, #8B5CF6, #EC4899)" : "#1E1E2E" }} />;
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 py-4 pb-8">

        {/* ===== Step 1: 모드 선택 ===== */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">어떻게 만들까요?</h2>
            <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
              당신의 스타일에 맞는 방식을 선택하세요
            </p>

            {/* 트렌드 모드 */}
            <button
              onClick={applyTrendMode}
              className="w-full text-left glass-card p-5 transition-all fade-in stagger-1"
              style={{ animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: "rgba(139, 92, 246, 0.15)" }}>
                  {"\uD83C\uDFAF"}
                </div>
                <div>
                  <span className="font-bold text-[15px] block">트렌드 모드</span>
                  <span className="text-xs" style={{ color: "#7A7A8E" }}>가장 높은 스트리밍 확률</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#7A7A8E" }}>
                데이터가 추천하는 장르/무드로 자동 세팅.
              </p>
            </button>

            {/* 자유 모드 */}
            <button
              onClick={function () { setMode("free"); setStep(2); }}
              className="w-full text-left glass-card p-5 transition-all fade-in stagger-2"
              style={{ animationFillMode: "both" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: "rgba(236, 72, 153, 0.15)" }}>
                  {"\uD83C\uDFA8"}
                </div>
                <div>
                  <span className="font-bold text-[15px] block">자유 모드</span>
                  <span className="text-xs" style={{ color: "#7A7A8E" }}>내 감성 100%</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#7A7A8E" }}>
                내가 선택하고, 데이터는 참고만.
              </p>
            </button>

            {/* 하이브리드 모드 */}
            <button
              onClick={function () {
                var top = trendsData.trends[0];
                setGenre(top.genre);
                setSelectedMoods(top.mood);
                setBpm(parseInt(top.avgBpm.split("-")[0]) + 5);
                setMode("hybrid");
                setStep(2);
              }}
              className="w-full text-left glass-card p-5 transition-all relative fade-in stagger-3"
              style={{ animationFillMode: "both", borderColor: "rgba(139, 92, 246, 0.2)" }}
            >
              <span
                className="absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white" }}
              >
                추천
              </span>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))" }}>
                  {"\uD83D\uDD00"}
                </div>
                <div>
                  <span className="font-bold text-[15px] block">하이브리드 모드</span>
                  <span className="text-xs" style={{ color: "#7A7A8E" }}>확률 + 개성 둘 다</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#7A7A8E" }}>
                데이터가 제안하고, 내가 터치를 더한다.
              </p>
            </button>
          </div>
        )}

        {/* ===== Step 2: 순차 공개 곡 설정 ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">곡 설정</h2>
            <p className="text-sm" style={{ color: "#7A7A8E" }}>
              {mode === "trend" ? "트렌드 기반으로 세팅됨. 수정도 가능해요." :
               mode === "hybrid" ? "데이터 제안 + 자유롭게 수정하세요." :
               "순서대로 선택하세요. 각 단계를 완료하면 다음이 열려요."}
            </p>

            {/* ── 1. 장르 선택 (대분류 탭 + 소분류 칩) ── */}
            <div className="glass-card overflow-hidden fade-in">
              {/* 헤더 */}
              <div className="flex items-center gap-2 p-4 pb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: genre ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#1E1E2E", color: genre ? "white" : "#7A7A8E" }}>1</div>
                <label className="text-sm font-semibold">장르</label>
                {genre && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(52, 211, 153, 0.1)", color: "#34D399" }}>{genre}</span>}
              </div>

              {/* 대분류 탭 (가로 스크롤, 다른 색상) */}
              <div className="overflow-x-auto px-4 pb-3" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex gap-1.5" style={{ minWidth: "max-content" }}>
                  <button
                    onClick={function() { setGenreCategory(""); }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: !genreCategory ? "#EC4899" : "rgba(236, 72, 153, 0.08)",
                      color: !genreCategory ? "white" : "#EC4899",
                      border: "1px solid " + (!genreCategory ? "#EC4899" : "rgba(236, 72, 153, 0.2)")
                    }}
                  >전체</button>
                  {Object.keys(GENRE_CATEGORIES).map(function(cat) {
                    var isActive = genreCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={function() { setGenreCategory(cat); }}
                        className="px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                        style={{
                          backgroundColor: isActive ? "#EC4899" : "rgba(236, 72, 153, 0.08)",
                          color: isActive ? "white" : "#EC4899",
                          border: "1px solid " + (isActive ? "#EC4899" : "rgba(236, 72, 153, 0.2)")
                        }}
                      >{cat}</button>
                    );
                  })}
                </div>
              </div>

              {/* 소분류 장르 칩 (보라색 계열) */}
              <div className="px-4 pb-4">
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>
                  {genreCategory || "전체"} — 장르 선택
                </p>
                <div className="flex flex-wrap gap-2">
                  {(genreCategory ? GENRE_CATEGORIES[genreCategory] : ALL_GENRES).map(function(g) {
                    var isSelected = genre === g;
                    var trend = trendsData.trends.find(function(t) { return t.genre === g; });
                    return (
                      <button
                        key={g}
                        onClick={function() { selectGenre(g); }}
                        className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")}
                      >
                        {g}{trend ? " +" + trend.growth + "%" : ""}
                      </button>
                    );
                  })}
                </div>
                {genre && getCurrentTrendInfo() && (
                  <p className="text-xs mt-2" style={{ color: getCurrentTrendInfo()!.growth > 0 ? "#34D399" : "#7A7A8E" }}>
                    {getCurrentTrendInfo()!.growth > 0 ? "이 장르는 현재 성장 중" : "트렌드와 다른 선택도 차별화 전략이 될 수 있어요"}
                  </p>
                )}
              </div>
            </div>

            {/* ── 2. 무드 선택 (장르 선택 후 공개) ── */}
            {!genre ? (
              <div className="glass-card p-4" style={{ opacity: 0.3 }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#1E1E2E", color: "#4A4A5E" }}>2</div>
                  <label className="text-sm" style={{ color: "#4A4A5E" }}>무드 — 장르를 먼저 선택하세요</label>
                </div>
              </div>
            ) : (
              <div className="glass-card overflow-hidden fade-in">
                {/* 헤더 */}
                <div className="flex items-center gap-2 p-4 pb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: selectedMoods.length > 0 ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#1E1E2E", color: selectedMoods.length > 0 ? "white" : "#7A7A8E" }}>2</div>
                  <label className="text-sm font-semibold">무드 <span style={{ color: "#7A7A8E" }}>(여러 개)</span></label>
                </div>

                {/* 대분류 탭 (핑크 — 가로 스크롤) */}
                <div className="overflow-x-auto px-4 pb-3" style={{ WebkitOverflowScrolling: "touch" }}>
                  <div className="flex gap-1.5" style={{ minWidth: "max-content" }}>
                    <button
                      onClick={function() { setMoodCategory(""); }}
                      className="px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                      style={{
                        backgroundColor: !moodCategory ? "#EC4899" : "rgba(236, 72, 153, 0.08)",
                        color: !moodCategory ? "white" : "#EC4899",
                        border: "1px solid " + (!moodCategory ? "#EC4899" : "rgba(236, 72, 153, 0.2)")
                      }}
                    >전체</button>
                    {Object.keys(MOOD_CATEGORIES).map(function(cat) {
                      var isActive = moodCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={function() { setMoodCategory(cat); }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                          style={{
                            backgroundColor: isActive ? "#EC4899" : "rgba(236, 72, 153, 0.08)",
                            color: isActive ? "white" : "#EC4899",
                            border: "1px solid " + (isActive ? "#EC4899" : "rgba(236, 72, 153, 0.2)")
                          }}
                        >{cat}</button>
                      );
                    })}
                  </div>
                </div>

                {/* 소분류 무드 칩 (보라색) */}
                <div className="px-4 pb-4">
                  {/* 추천 */}
                  {genre && getRecommendations(genre) && !moodCategory && (
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#34D399" }}>추천</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {(moodCategory ? MOOD_CATEGORIES[moodCategory] : (function() {
                      var rec = genre ? getRecommendations(genre) : null;
                      if (!rec) return ALL_MOODS;
                      var recommended = rec.moods.filter(function(m) { return ALL_MOODS.indexOf(m) !== -1; });
                      var rest = ALL_MOODS.filter(function(m) { return recommended.indexOf(m) === -1; });
                      return recommended.concat(["__DIVIDER__"]).concat(rest);
                    })()).map(function(m) {
                      if (m === "__DIVIDER__") return <span key="div" className="w-full text-[10px] uppercase tracking-widest mt-3 mb-1" style={{ color: "#4A4A5E" }}>기타</span>;
                      var isSelected = selectedMoods.includes(m);
                      var rec = genre ? getRecommendations(genre) : null;
                      var isRecommended = rec && rec.moods.indexOf(m) !== -1;
                      return <button key={m} onClick={function() { toggleMood(m); }} className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")} style={isRecommended && !isSelected ? { borderColor: "rgba(52, 211, 153, 0.3)" } : {}}>{m}</button>;
                    })}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input type="text" value={customMood} onChange={function(e) { setCustomMood(e.target.value); }} placeholder="직접 입력" className="input-dark text-sm" onKeyDown={function(e) { if (e.key === "Enter") addCustomMood(); }} />
                    <button onClick={addCustomMood} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: "#8B5CF6", color: "white" }}>추가</button>
                  </div>
                  {selectedMoods.length > 0 && <p className="text-xs mt-2" style={{ color: "#8B5CF6" }}>선택됨: {selectedMoods.join(", ")}</p>}
                </div>
              </div>
            )}

            {/* ── 3. 보컬 스타일 (무드 선택 후 공개) ── */}
            {selectedMoods.length === 0 ? (
              <div className="glass-card p-4" style={{ opacity: 0.3 }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#1E1E2E", color: "#4A4A5E" }}>3</div>
                  <label className="text-sm" style={{ color: "#4A4A5E" }}>보컬 — 무드를 먼저 선택하세요</label>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: selectedVocal ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#1E1E2E", color: selectedVocal ? "white" : "#7A7A8E" }}>3</div>
                  <label className="text-sm font-semibold">보컬 스타일</label>
                  {selectedVocal && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(52, 211, 153, 0.1)", color: "#34D399" }}>{selectedVocal}</span>}
                </div>
                {/* 추천 보컬 먼저 */}
                {genre && getRecommendations(genre) && (
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "#8B5CF6" }}>이 장르 추천</p>
                    <div className="flex flex-wrap gap-2">
                      {getRecommendations(genre)!.vocals.map(function(v) {
                        var isSelected = selectedVocal === v;
                        return <button key={v} onClick={function() { setSelectedVocal(isSelected ? "" : v); }} className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")} style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>{v}</button>;
                      })}
                    </div>
                  </div>
                )}
                <p className="text-[10px] uppercase tracking-widest mb-1.5 mt-2" style={{ color: "#4A4A5E" }}>전체</p>
                {Object.entries(VOCAL_STYLES).map(function([cat, vocals]) {
                  return (
                    <div key={cat} className="mb-3">
                      <p className="text-xs mb-1.5" style={{ color: "#7A7A8E" }}>{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {vocals.map(function(v) {
                          var isSelected = selectedVocal === v;
                          return <button key={v} onClick={function() { setSelectedVocal(isSelected ? "" : v); }} className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")}>{v}</button>;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── 4. 악기 선택 (보컬 선택 후 공개) ── */}
            {!selectedVocal ? (
              <div className="glass-card p-4" style={{ opacity: 0.3 }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#1E1E2E", color: "#4A4A5E" }}>4</div>
                  <label className="text-sm" style={{ color: "#4A4A5E" }}>악기 — 보컬을 먼저 선택하세요</label>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: selectedInstruments.length > 0 ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#1E1E2E", color: selectedInstruments.length > 0 ? "white" : "#7A7A8E" }}>4</div>
                  <label className="text-sm font-semibold">악기 <span style={{ color: "#7A7A8E" }}>(여러 개, 선택 안 하면 자동)</span></label>
                </div>
                {/* 추천 악기 먼저 */}
                {genre && getRecommendations(genre) && (
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "#8B5CF6" }}>이 장르 추천</p>
                    <div className="flex flex-wrap gap-2">
                      {getRecommendations(genre)!.instruments.map(function(inst) {
                        var isSelected = selectedInstruments.includes(inst);
                        return <button key={inst} onClick={function() { toggleInstrument(inst); }} className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")} style={{ borderColor: "rgba(139, 92, 246, 0.3)" }}>{inst}</button>;
                      })}
                    </div>
                  </div>
                )}
                <p className="text-[10px] uppercase tracking-widest mb-1.5 mt-2" style={{ color: "#4A4A5E" }}>전체</p>
                {Object.entries(INSTRUMENT_CATEGORIES).map(function([cat, instruments]) {
                  return (
                    <div key={cat} className="mb-3">
                      <p className="text-xs mb-1.5" style={{ color: "#7A7A8E" }}>{cat}</p>
                      <div className="flex flex-wrap gap-2">
                        {instruments.map(function(inst) {
                          var isSelected = selectedInstruments.includes(inst);
                          return <button key={inst} onClick={function() { toggleInstrument(inst); }} className={"px-3 py-1.5 text-sm rounded-full transition-all " + (isSelected ? "mood-chip mood-chip-active" : "mood-chip")}>{inst}</button>;
                        })}
                      </div>
                    </div>
                  );
                })}
                {selectedInstruments.length > 0 && <p className="text-xs mt-1" style={{ color: "#8B5CF6" }}>선택됨: {selectedInstruments.join(", ")}</p>}
              </div>
            )}

            {/* ── 5. BPM (보컬 선택 후 공개) ── */}
            {!selectedVocal ? (
              <div className="glass-card p-4" style={{ opacity: 0.3 }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#1E1E2E", color: "#4A4A5E" }}>5</div>
                  <label className="text-sm" style={{ color: "#4A4A5E" }}>BPM</label>
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)", color: "white" }}>5</div>
                  <label className="text-sm font-semibold">BPM: <span className="text-gradient font-bold">{bpm}</span></label>
                </div>
                <input type="range" min="50" max="180" value={bpm} onChange={function(e) { setBpm(parseInt(e.target.value)); }} className="w-full" />
                <div className="flex justify-between text-xs" style={{ color: "#7A7A8E" }}>
                  <span>50 (느림)</span>
                  <span>{genre && getCurrentTrendInfo() ? "적정: " + getCurrentTrendInfo()!.avgBpm : "115 (보통)"}</span>
                  <span>180 (빠름)</span>
                </div>
              </div>
            )}

            {/* 다음 버튼 */}
            <button
              onClick={function () { setStep(3); }}
              disabled={!genre || selectedMoods.length === 0 || !selectedVocal}
              className={"w-full py-4 rounded-2xl font-bold text-white text-[15px] transition-all " + ((!genre || selectedMoods.length === 0) ? "opacity-30" : "glow-btn")}
            >
              다음: 가사 &rarr;
            </button>
          </div>
        )}

        {/* ===== Step 3: 가사 ===== */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">가사</h2>
            <p className="text-sm" style={{ color: "#9CA3AF" }}>
              가사 방식을 선택하세요. 나중에 수정할 수 있어요.
            </p>

            {/* 언어 선택 */}
            <div className="glass-card p-4">
              <label className="text-sm font-semibold block mb-2">가사 언어</label>
              <div className="flex gap-2">
                {[
                  { id: "en", label: "English" },
                  { id: "ko", label: "한국어" },
                  { id: "both", label: "혼합 (EN+KR)" }
                ].map(function(opt) {
                  return (
                    <button
                      key={opt.id}
                      onClick={function() { setLanguage(opt.id); }}
                      className={"flex-1 py-2.5 rounded-xl text-sm font-medium transition-all " + (language === opt.id ? "text-white" : "")}
                      style={{
                        backgroundColor: language === opt.id ? "#8B5CF6" : "#111118",
                        color: language === opt.id ? "white" : "#7A7A8E"
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 섹션 길이 */}
            <div className="glass-card p-4">
              <label className="text-sm font-semibold block mb-2">곡 길이</label>
              <div className="flex gap-2">
                {[
                  { id: "short", label: "짧게", desc: "~20줄" },
                  { id: "normal", label: "보통", desc: "~28줄" },
                  { id: "long", label: "길게", desc: "40줄+" }
                ].map(function(opt) {
                  return (
                    <button
                      key={opt.id}
                      onClick={function() { setSectionLength(opt.id); }}
                      className={"flex-1 py-2.5 rounded-xl text-center transition-all"}
                      style={{
                        backgroundColor: sectionLength === opt.id ? "#8B5CF6" : "#111118",
                        color: sectionLength === opt.id ? "white" : "#7A7A8E"
                      }}
                    >
                      <span className="text-sm font-medium block">{opt.label}</span>
                      <span className="text-[10px] block mt-0.5" style={{ opacity: 0.7 }}>{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* API 키 상태 배너 */}
            {!isKeySet && (
              <Link
                href="/settings"
                className="block rounded-xl p-4 transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))",
                  border: "1px solid rgba(251, 191, 36, 0.3)"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(251, 191, 36, 0.15)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: "#FBBF24" }}>API 키를 연결하세요</p>
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>지금은 데모 가사만 나옵니다. 연결하면 AI가 매번 새 가사를 생성합니다.</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            )}

            {/* 가사 모드 선택 */}
            <div className="space-y-2">
              {[
                { id: "none", label: "인스트루멘탈 (가사 없음)", desc: "멜로디와 비트만" },
                { id: "ai", label: "AI 가사 생성", desc: "주제/감정을 알려주면 AI가 작성" },
                { id: "manual", label: "내 가사 직접 입력", desc: "내가 쓴 가사를 사용" },
                { id: "hybrid", label: "내 가사 + AI 보완", desc: "내 가사에 AI가 살을 붙임" }
              ].map(function (opt) {
                return (
                  <button
                    key={opt.id}
                    onClick={function () { setLyricsMode(opt.id); }}
                    className="w-full text-left p-4 rounded-xl border transition-all"
                    style={{
                      backgroundColor: lyricsMode === opt.id ? "rgba(139, 92, 246, 0.1)" : "#1A1A2E",
                      borderColor: lyricsMode === opt.id ? "#8B5CF6" : "#2A2A4A"
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: lyricsMode === opt.id ? "#8B5CF6" : "#4B5563" }}
                      >
                        {lyricsMode === opt.id && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8B5CF6" }} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{opt.label}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI 가사: 주제 입력 */}
            {(lyricsMode === "ai" || lyricsMode === "hybrid") && (
              <div>
                <label className="text-sm font-semibold block mb-2">
                  주제 / 감정 / 키워드
                </label>
                <input
                  type="text"
                  value={lyricsTheme}
                  onChange={function (e) { setLyricsTheme(e.target.value); }}
                  placeholder="예: 새벽 3시의 고독, 이별 후 비 오는 거리"
                  className="input-dark text-sm"
                />
              </div>
            )}

            {/* 직접 입력 */}
            {(lyricsMode === "manual" || lyricsMode === "hybrid") && (
              <div>
                <label className="text-sm font-semibold block mb-2">
                  가사 입력
                </label>
                <textarea
                  value={generatedLyrics}
                  onChange={function (e) { setGeneratedLyrics(e.target.value); }}
                  placeholder={"[Verse 1]\n가사를 입력하세요...\n\n[Chorus]\n후렴구를 입력하세요..."}
                  rows={10}
                  className="input-dark text-sm"
                />
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              onClick={generateAll}
              disabled={isGenerating}
              className={"w-full py-4 rounded-2xl font-bold text-white text-[15px] transition-all " + (isGenerating ? "opacity-50" : "glow-btn")}
            >
              {isGenerating ? "AI가 만들고 있어요..." : "프롬프트 + 메타데이터 생성 \u2728"}
            </button>
          </div>
        )}

        {/* ===== Step 4: 결과 패키지 ===== */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <span className="text-3xl">{"\uD83C\uDF89"}</span>
              <h2 className="text-xl font-bold mt-2">완성!</h2>
              <p className="text-sm" style={{ color: "#7A7A8E" }}>
                아래 내용을 수노에 붙여넣으세요
              </p>
              {isDemo && (
                <p className="text-xs mt-2 px-3 py-1.5 rounded-full inline-block" style={{ backgroundColor: "rgba(251, 191, 36, 0.1)", color: "#FBBF24" }}>
                  데모 결과입니다 — Claude API 연동 후 실제 AI가 생성합니다
                </p>
              )}
            </div>

            {/* 수노 프롬프트 */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{"\uD83C\uDFB5"} 수노 프롬프트</span>
                <button
                  onClick={function () { copyToClipboard(generatedPrompt, "prompt"); }}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: copied === "prompt" ? "#10B981" : "#8B5CF6",
                    color: "white"
                  }}
                >
                  {copied === "prompt" ? "복사됨!" : "복사"}
                </button>
              </div>
              <textarea
                value={generatedPrompt}
                onChange={function (e) { setGeneratedPrompt(e.target.value); }}
                rows={3}
                className="input-dark text-sm"
              />
            </div>

            {/* 가사 */}
            {generatedLyrics && (
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{"\uD83D\uDCDD"} 가사</span>
                  <button
                    onClick={function () { copyToClipboard(generatedLyrics, "lyrics"); }}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: copied === "lyrics" ? "#10B981" : "#8B5CF6",
                      color: "white"
                    }}
                  >
                    {copied === "lyrics" ? "복사됨!" : "복사"}
                  </button>
                </div>
                <textarea
                  value={generatedLyrics}
                  onChange={function (e) { setGeneratedLyrics(e.target.value); }}
                  rows={12}
                  className="w-full p-2 rounded-lg text-sm border"
                  style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
                />
              </div>
            )}

            {/* 메타데이터 */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{"\uD83C\uDFF7\uFE0F"} 메타데이터 (DistroKid용)</span>
                <button
                  onClick={function () {
                    var meta = "제목: " + generatedTitle + "\n아티스트: R3ALSON\n장르: " + genre + "\n태그: " + generatedTags;
                    copyToClipboard(meta, "meta");
                  }}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: copied === "meta" ? "#10B981" : "#8B5CF6",
                    color: "white"
                  }}
                >
                  {copied === "meta" ? "복사됨!" : "전체 복사"}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs" style={{ color: "#9CA3AF" }}>제목</label>
                  <input
                    type="text"
                    value={generatedTitle}
                    onChange={function (e) { setGeneratedTitle(e.target.value); }}
                    className="w-full p-2 rounded-lg text-sm border mt-1"
                    style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
                  />
                </div>
                <div>
                  <label className="text-xs" style={{ color: "#9CA3AF" }}>태그</label>
                  <input
                    type="text"
                    value={generatedTags}
                    onChange={function (e) { setGeneratedTags(e.target.value); }}
                    className="w-full p-2 rounded-lg text-sm border mt-1"
                    style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
                  />
                </div>
              </div>
            </div>

            {/* 다음 단계 가이드 */}
            <div className="glass-card p-4">
              <p className="text-sm font-semibold mb-3">{"\uD83D\uDCD6"} 다음 단계</p>
              <ol className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>1.</span>
                  수노(suno.com)에서 프롬프트를 붙여넣고 곡 생성
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>2.</span>
                  3~5곡 생성 후 가장 좋은 것 선택 (추천)
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>3.</span>
                  DistroKid에 메타데이터 + 곡 업로드
                </li>
              </ol>
            </div>

            {/* 플레이리스트 확장 */}
            <div className="glass-card p-5" style={{ borderColor: "rgba(139, 92, 246, 0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{"\uD83C\uDFB6"}</span>
                <span className="font-bold">플레이리스트로 확장</span>
              </div>
              <p className="text-sm mb-4" style={{ color: "#7A7A8E" }}>
                이 곡이 마음에 들면, 같은 감성의 배리에이션으로 플레이리스트를 만들어보세요
              </p>

              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-semibold" style={{ color: "#7A7A8E" }}>곡 수</label>
                <div className="flex items-center gap-2">
                  {[3, 5, 7, 10].map(function(n) {
                    return (
                      <button
                        key={n}
                        onClick={function() { setPlaylistCount(n); }}
                        className={"w-10 h-10 rounded-xl text-sm font-bold transition-all " + (playlistCount === n ? "text-white" : "")}
                        style={{
                          backgroundColor: playlistCount === n ? "#8B5CF6" : "#111118",
                          color: playlistCount === n ? "white" : "#7A7A8E"
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs" style={{ color: "#7A7A8E" }}>{playlistCount}곡</span>
              </div>

              <button
                onClick={generatePlaylist}
                className="w-full py-3 rounded-xl font-semibold text-white glow-btn"
              >
                {playlistCount}곡 플레이리스트 생성
              </button>
            </div>

            {/* 저장 버튼 */}
            <button
              onClick={function() {
                saveToHistory();
                setCopied("saved");
                setTimeout(function() { setCopied(""); }, 2000);
              }}
              className="w-full py-3 rounded-xl text-center font-semibold transition-all"
              style={{
                backgroundColor: copied === "saved" ? "rgba(52, 211, 153, 0.15)" : "rgba(139, 92, 246, 0.1)",
                color: copied === "saved" ? "#34D399" : "#8B5CF6",
                border: "1px solid " + (copied === "saved" ? "rgba(52, 211, 153, 0.3)" : "rgba(139, 92, 246, 0.2)")
              }}
            >
              {copied === "saved" ? "저장 완료!" : "히스토리에 저장"}
            </button>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl text-center font-semibold"
                style={{ backgroundColor: "#111118", color: "#7A7A8E" }}
              >
                홈으로
              </Link>
              <button
                onClick={function () {
                  setStep(1);
                  setMode("");
                  setGenre("");
                  setSelectedMoods([]);
                  setSelectedVocal("");
                  setSelectedInstruments([]);
                  setGeneratedPrompt("");
                  setGeneratedLyrics("");
                  setGeneratedTitle("");
                  setGeneratedTags("");
                }}
                className="flex-1 py-3 rounded-xl text-center font-semibold text-white glow-btn"
              >
                새 곡 더 만들기
              </button>
            </div>
          </div>
        )}

        {/* ===== Step 5: 플레이리스트 결과 ===== */}
        {step === 5 && (
          <div className="space-y-5 fade-in">
            <div className="text-center mb-4">
              <span className="text-3xl">{"\uD83C\uDFB6"}</span>
              <h2 className="text-xl font-bold mt-2">{playlistTracks.length}곡 플레이리스트</h2>
              <p className="text-sm" style={{ color: "#7A7A8E" }}>
                원곡 기반 배리에이션 — 각 곡의 프롬프트를 수노에 붙여넣으세요
              </p>
            </div>

            {/* 트랙 리스트 */}
            <div className="space-y-2.5">
              {playlistTracks.map(function(track, idx) {
                var isExpanded = expandedTrack === idx;
                return (
                  <div key={idx} className="glass-card overflow-hidden fade-in" style={{ animationDelay: (idx * 0.05) + "s", animationFillMode: "both" }}>
                    {/* 트랙 헤더 */}
                    <button
                      onClick={function() { setExpandedTrack(isExpanded ? null : idx); }}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            background: idx === 0 ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#1E1E2E",
                            color: idx === 0 ? "white" : "#7A7A8E"
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{track.title}</p>
                          <p className="text-xs truncate" style={{ color: "#7A7A8E" }}>{track.variation}</p>
                        </div>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A7A8E" strokeWidth="2"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        >
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </div>
                    </button>

                    {/* 펼친 내용 */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 fade-in">
                        {/* 프롬프트 */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold" style={{ color: "#7A7A8E" }}>수노 프롬프트</span>
                            <button
                              onClick={function() { copyToClipboard(track.prompt, "pl-p-" + idx); }}
                              className="text-[10px] px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: copied === "pl-p-" + idx ? "rgba(52,211,153,0.15)" : "rgba(139,92,246,0.1)",
                                color: copied === "pl-p-" + idx ? "#34D399" : "#8B5CF6"
                              }}
                            >
                              {copied === "pl-p-" + idx ? "복사됨!" : "복사"}
                            </button>
                          </div>
                          <p className="text-sm p-3 rounded-xl" style={{ backgroundColor: "#050508", color: "#9CA3AF", lineHeight: "1.6" }}>
                            {track.prompt}
                          </p>
                        </div>

                        {/* 가사 */}
                        {track.lyrics && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold" style={{ color: "#7A7A8E" }}>가사</span>
                              <button
                                onClick={function() { copyToClipboard(track.lyrics, "pl-l-" + idx); }}
                                className="text-[10px] px-2.5 py-1 rounded-full"
                                style={{
                                  backgroundColor: copied === "pl-l-" + idx ? "rgba(52,211,153,0.15)" : "rgba(139,92,246,0.1)",
                                  color: copied === "pl-l-" + idx ? "#34D399" : "#8B5CF6"
                                }}
                              >
                                {copied === "pl-l-" + idx ? "복사됨!" : "복사"}
                              </button>
                            </div>
                            <pre className="text-sm p-3 rounded-xl whitespace-pre-wrap" style={{ backgroundColor: "#050508", color: "#9CA3AF", lineHeight: "1.6" }}>
                              {track.lyrics}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 전체 복사 */}
            <button
              onClick={function() {
                var allPrompts = playlistTracks.map(function(t, i) {
                  return "--- Track " + (i + 1) + ": " + t.title + " ---\n[Variation] " + t.variation + "\n[Prompt] " + t.prompt + (t.lyrics ? "\n[Lyrics]\n" + t.lyrics : "");
                }).join("\n\n");
                copyToClipboard(allPrompts, "all-playlist");
              }}
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{
                backgroundColor: copied === "all-playlist" ? "rgba(52, 211, 153, 0.15)" : "rgba(139, 92, 246, 0.1)",
                color: copied === "all-playlist" ? "#34D399" : "#8B5CF6",
                border: "1px solid " + (copied === "all-playlist" ? "rgba(52, 211, 153, 0.3)" : "rgba(139, 92, 246, 0.2)")
              }}
            >
              {copied === "all-playlist" ? "전체 복사됨!" : "전체 프롬프트 복사 (" + playlistTracks.length + "곡)"}
            </button>

            {/* 액션 */}
            <div className="flex gap-3">
              <button
                onClick={function() { setStep(4); }}
                className="flex-1 py-3 rounded-xl text-center font-semibold"
                style={{ backgroundColor: "#111118", color: "#7A7A8E" }}
              >
                원곡으로 돌아가기
              </button>
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl text-center font-semibold text-white glow-btn"
              >
                홈으로
              </Link>
            </div>

            {/* 가이드 */}
            <div className="glass-card p-4">
              <p className="text-sm font-semibold mb-3">{"\uD83D\uDCD6"} 플레이리스트 제작 가이드</p>
              <ol className="space-y-2 text-sm" style={{ color: "#7A7A8E" }}>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>1.</span>
                  각 트랙의 프롬프트를 수노에 하나씩 붙여넣기
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>2.</span>
                  트랙당 3~5곡 생성 후 베스트 선택
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>3.</span>
                  {playlistTracks.length}곡 모아서 DistroKid에 앨범/EP로 배포
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "#8B5CF6" }}>4.</span>
                  Spotify에서 플레이리스트로 묶으면 알고리즘 노출 UP
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
