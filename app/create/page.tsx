"use client";

import { useState } from "react";
import Link from "next/link";
import trendsData from "@/data/trends.json";
import { useApiKey } from "@/lib/api-key-context";
import { TOPIC_CATEGORIES, WRITING_TECHNIQUES, HOOK_PATTERNS, generateRecommendation, getRelatedSubThemes, sortCategoriesByGenre, buildTopicPromptText } from "@/lib/topic-pool";
import type { SubTheme, WritingTechnique as WTech, HookPattern, TopicRecommendation } from "@/lib/topic-pool";

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
  // 주제 추천 시스템
  var [showTopicPicker, setShowTopicPicker] = useState(false);
  var [topicStep, setTopicStep] = useState(1); // 1: 대분류, 2: 중분류, 3: 작법, 4: 단어블록+훅
  var [selectedCategory, setSelectedCategory] = useState("");
  var [selectedSubTheme, setSelectedSubTheme] = useState<SubTheme | null>(null);
  var [selectedTechnique, setSelectedTechnique] = useState<WTech | null>(null);
  var [recommendation, setRecommendation] = useState<TopicRecommendation | null>(null);
  var [pickedObjects, setPickedObjects] = useState<string[]>([]);
  var [pickedPlaces, setPickedPlaces] = useState<string[]>([]);
  var [pickedTimes, setPickedTimes] = useState<string[]>([]);
  var [pickedBody, setPickedBody] = useState<string[]>([]);
  var [pickedSenses, setPickedSenses] = useState<string[]>([]);
  var [pickedActions, setPickedActions] = useState<string[]>([]);
  var [pickedSounds, setPickedSounds] = useState<string[]>([]);
  var [selectedHook, setSelectedHook] = useState<HookPattern | null>(null);
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
  var [playlistProgress, setPlaylistProgress] = useState(0);
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
    setPlaylistProgress(0);

    // ===== 장르별 맞춤 배리에이션 전략 =====
    var genreLower = genre.toLowerCase();

    // 장르 카테고리 감지
    var isRapGenre = genreLower.indexOf("hip") !== -1 || genreLower.indexOf("rap") !== -1 || genreLower.indexOf("trap") !== -1 || genreLower.indexOf("drill") !== -1 || genreLower.indexOf("phonk") !== -1;
    var isAmbientGenre = genreLower.indexOf("ambient") !== -1 || genreLower.indexOf("meditation") !== -1 || genreLower.indexOf("sleep") !== -1 || genreLower.indexOf("study") !== -1 || genreLower.indexOf("drone") !== -1;
    var isRockGenre = genreLower.indexOf("rock") !== -1 || genreLower.indexOf("metal") !== -1 || genreLower.indexOf("punk") !== -1 || genreLower.indexOf("shoegaze") !== -1;
    var isElectronicGenre = genreLower.indexOf("edm") !== -1 || genreLower.indexOf("house") !== -1 || genreLower.indexOf("techno") !== -1 || genreLower.indexOf("trance") !== -1 || genreLower.indexOf("dubstep") !== -1 || genreLower.indexOf("synthwave") !== -1 || genreLower.indexOf("future") !== -1;
    var isJazzGenre = genreLower.indexOf("jazz") !== -1 || genreLower.indexOf("blues") !== -1 || genreLower.indexOf("bossa") !== -1;
    var isOrchestralGenre = genreLower.indexOf("classical") !== -1 || genreLower.indexOf("orchestral") !== -1 || genreLower.indexOf("film") !== -1 || genreLower.indexOf("piano solo") !== -1;
    var isLofiGenre = genreLower.indexOf("lo-fi") !== -1 || genreLower.indexOf("lofi") !== -1 || genreLower.indexOf("bedroom") !== -1 || genreLower.indexOf("chillwave") !== -1;

    // 장르별 배리에이션 정의
    var variations: {label: string; desc: string}[] = [];
    if (isRapGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 버전" },
        { label: "트랩 리믹스", desc: "808 헤비, 하이햇 롤링" },
        { label: "붐뱁 버전", desc: "올드스쿨 샘플, 바운스 그루브" },
        { label: "클라우드 랩", desc: "몽환적, 스페이시 리버브" },
        { label: "드릴 버전", desc: "슬라이딩 808, 다크 에너지" },
        { label: "어쿠스틱 랩", desc: "기타 + 랩, 날것의 감정" },
        { label: "야간 버전", desc: "레이트 나이트, 더 어둡게" },
        { label: "에모 랩", desc: "멜랑콜릭, 기타 드리븐" },
        { label: "하이에너지", desc: "빠른 플로우, 강한 비트" },
        { label: "미니멀 비트", desc: "최소 요소, 보컬 포커스" }
      ];
    } else if (isAmbientGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 앰비언스" },
        { label: "딥 드론", desc: "더 깊고 느린 울림" },
        { label: "네이처 사운드", desc: "비, 바람, 자연 텍스처 추가" },
        { label: "다크 앰비언트", desc: "불안하고 미스터리한 분위기" },
        { label: "스페이스 버전", desc: "우주적, 광활한 리버브" },
        { label: "피아노 앰비언트", desc: "피아노 + 패드 레이어" },
        { label: "테이프 새츄레이션", desc: "빈티지 테이프 워밍" },
        { label: "글리치 버전", desc: "디지털 텍스처, 미묘한 글리치" },
        { label: "오케스트라 블렌드", desc: "스트링 + 앰비언트 패드" },
        { label: "미니멀 버전", desc: "단일 텍스처, 극도로 절제" }
      ];
    } else if (isElectronicGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 프로덕션" },
        { label: "딥 버전", desc: "서브 베이스 강조, 딥한 그루브" },
        { label: "보컬 촙", desc: "보컬 샘플 촙 + 필터" },
        { label: "빌드업 버전", desc: "긴 빌드업, 강한 드롭" },
        { label: "칠아웃 믹스", desc: "BPM 다운, 릴렉스 그루브" },
        { label: "레트로 리믹스", desc: "80s 아날로그 신디 + 게이티드 리버브" },
        { label: "하드 버전", desc: "디스토션 추가, 하드 킥" },
        { label: "퓨처 베이스", desc: "러쉬 코드, 피치드 보컬" },
        { label: "브레이크비트", desc: "잘게 쪼갠 드럼, 에너지 변화" },
        { label: "앰비언트 믹스", desc: "드롭 없이 분위기만" }
      ];
    } else if (isRockGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 밴드 사운드" },
        { label: "어쿠스틱 버전", desc: "언플러그드, 날것의 감정" },
        { label: "하드 버전", desc: "디스토션 더, 파워 코드" },
        { label: "발라드 버전", desc: "느린 템포, 감성적" },
        { label: "라이브 버전", desc: "크라우드 에너지, 라이브 질감" },
        { label: "슈게이즈 믹스", desc: "리버브 월, 헤이지" },
        { label: "포스트록 버전", desc: "크레센도 빌드, 미니멀 보컬" },
        { label: "펑크 버전", desc: "빠르고 짧고 날카롭게" },
        { label: "스트링 버전", desc: "기타 + 스트링 오케스트라" },
        { label: "미니멀 버전", desc: "기타 하나, 보컬 하나" }
      ];
    } else if (isJazzGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 재즈 어레인지" },
        { label: "스무스 버전", desc: "실키한 질감, 이지 리스닝" },
        { label: "비밥 버전", desc: "빠른 코드 체인지, 임프로" },
        { label: "보사노바 믹스", desc: "나일론 기타, 브라질리안 그루브" },
        { label: "나이트 클럽", desc: "색소폰 솔로, 딤 라이팅" },
        { label: "재즈 퓨전", desc: "일렉트릭 + 어쿠스틱 블렌드" },
        { label: "블루스 터치", desc: "12마디, 감성적 밴딩" },
        { label: "보컬 재즈", desc: "인티밋 보컬 중심" },
        { label: "빅밴드 버전", desc: "브라스 섹션, 풀 밴드" },
        { label: "미니멀 트리오", desc: "피아노 + 베이스 + 드럼" }
      ];
    } else if (isOrchestralGenre) {
      variations = [
        { label: "원곡 그대로", desc: "오리지널 오케스트라" },
        { label: "스트링만", desc: "현악 사중주 버전" },
        { label: "피아노 솔로", desc: "피아노 단독 편곡" },
        { label: "에픽 버전", desc: "팀파니 + 브라스, 장대하게" },
        { label: "미니멀 버전", desc: "단일 악기, 여백의 미" },
        { label: "일렉트로닉 블렌드", desc: "오케스트라 + 신디 텍스처" },
        { label: "합창 버전", desc: "코러스 + 오케스트라" },
        { label: "챔버 뮤직", desc: "소규모 앙상블" },
        { label: "서스펜스 버전", desc: "텐션 빌드, 미스터리" },
        { label: "새벽 버전", desc: "고요하고 서정적" }
      ];
    } else {
      // 팝, R&B, 포크, 기타 장르: 범용 배리에이션
      variations = [
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
    }

    // ===== 장르별 BPM 배리에이션 =====
    var bpmVariations: number[] = [];
    if (isRapGenre) {
      bpmVariations = [0, +10, -15, +5, +20, -20, -5, +15, +25, -10];
    } else if (isAmbientGenre) {
      bpmVariations = [0, -10, -5, -15, -20, -8, -12, -25, +5, -30];
    } else if (isElectronicGenre) {
      bpmVariations = [0, +5, +10, +15, -10, -5, +20, +8, +12, -15];
    } else if (isRockGenre) {
      bpmVariations = [0, -10, +15, -20, +10, -5, +20, +25, -15, -25];
    } else {
      bpmVariations = [0, -15, -5, +5, +20, -25, -10, -20, +10, -30];
    }

    // ===== 장르별 무드 시프트 풀 (확장) =====
    var moodShifts: Record<string, string[]> = {
      "melancholic": ["bittersweet", "wistful", "tender", "somber", "nostalgic", "haunting", "vulnerable", "aching", "lonely"],
      "dark": ["mysterious", "eerie", "brooding", "haunting", "sinister", "ominous", "tense", "shadowy", "foreboding"],
      "chill": ["peaceful", "calm", "dreamy", "serene", "warm", "mellow", "gentle", "floating", "hazy"],
      "energetic": ["bold", "fierce", "triumphant", "euphoric", "wild", "dynamic", "driving", "explosive", "powerful"],
      "dreamy": ["ethereal", "atmospheric", "surreal", "hypnotic", "peaceful", "floaty", "hazy", "shimmering", "misty"],
      "aggressive": ["fierce", "intense", "rebellious", "bold", "dark", "raw", "gritty", "confrontational", "relentless"],
      "nostalgic": ["bittersweet", "sentimental", "warm", "wistful", "tender", "faded", "distant", "golden", "yearning"],
      "romantic": ["tender", "warm", "intimate", "sentimental", "dreamy", "gentle", "longing", "passionate", "soft"],
      "happy": ["bright", "playful", "cheerful", "joyful", "uplifting", "sunny", "carefree", "vibrant", "bubbly"],
      "epic": ["triumphant", "cinematic", "dramatic", "soaring", "powerful", "majestic", "grand", "heroic", "sweeping"],
      "groovy": ["funky", "smooth", "bouncy", "rhythmic", "slinky", "tight", "syncopated", "cool", "slick"],
      "atmospheric": ["spacious", "immersive", "evolving", "textured", "vast", "layered", "ambient", "floating", "expansive"],
      "mysterious": ["enigmatic", "shadowy", "curious", "veiled", "cryptic", "ethereal", "elusive", "strange", "haunting"],
      "cinematic": ["epic", "dramatic", "sweeping", "emotional", "grand", "triumphant", "tense", "soaring", "majestic"]
    };

    // 악기 교체 풀 (확장)
    var instrumentSwaps: Record<string, string[]> = {
      "piano": ["rhodes", "electric piano", "wurlitzer", "harp", "music box", "celesta", "organ"],
      "electric guitar": ["acoustic guitar", "clean guitar", "fingerstyle guitar", "slide guitar", "12-string guitar"],
      "acoustic guitar": ["piano", "ukulele", "fingerstyle guitar", "harp", "mandolin", "nylon guitar"],
      "808 bass": ["sub bass", "bass guitar", "synth bass", "distorted bass", "deep sub"],
      "pad synth": ["strings", "ambient textures", "warm pads", "organ", "choir pads"],
      "live drums": ["brushed drums", "lo-fi drums", "drum machine", "minimal percussion", "electronic drums"],
      "strings": ["cello", "violin", "orchestral strings", "harp", "viola"],
      "synth": ["analog synth", "digital synth", "arpeggiated synth", "pad synth", "lead synth"],
      "saxophone": ["flute", "trumpet", "clarinet", "oboe"],
      "organ": ["piano", "rhodes", "synth pad", "accordion"]
    };

    var tracks: {title: string; prompt: string; lyrics: string; variation: string}[] = [];

    for (var i = 0; i < playlistCount; i++) {
      var v = variations[i % variations.length];
      var trackBpm = Math.max(50, Math.min(180, bpm + bpmVariations[i % bpmVariations.length]));

      // 무드 배리에이션 — 모든 후속 트랙에 적용
      var trackMoods = selectedMoods.slice();
      if (i > 0) {
        var baseMood = selectedMoods[0] ? selectedMoods[0].toLowerCase() : "";
        var shifts = moodShifts[baseMood] || ["atmospheric", "warm", "gentle", "textured", "evolving"];
        trackMoods = [shifts[(i - 1) % shifts.length]].concat(selectedMoods.slice(1));
      }

      // 악기 배리에이션 — 모든 후속 트랙에 적용
      var trackInst = selectedInstruments.slice();
      if (i > 0 && trackInst.length > 0) {
        var swapTarget = trackInst[0].toLowerCase();
        var swapPool = instrumentSwaps[swapTarget];
        if (swapPool) {
          trackInst[0] = swapPool[(i - 1) % swapPool.length];
        }
      }

      // 어쿠스틱 계열 배리에이션
      if (v.label.indexOf("어쿠스틱") !== -1) {
        trackInst = ["acoustic guitar", "soft percussion"];
        trackBpm = Math.max(50, bpm - 20);
      }

      // 미니멀 계열 배리에이션
      if (v.label.indexOf("미니멀") !== -1) {
        trackInst = trackInst.length > 0 ? [trackInst[0]] : ["piano"];
        trackBpm = Math.max(50, bpm - 10);
      }

      // 랩 장르: 서브장르 특화 악기 세팅
      if (isRapGenre && i > 0) {
        if (v.label.indexOf("트랩") !== -1) trackInst = ["808 bass", "trap hi-hats", "dark pads"];
        else if (v.label.indexOf("붐뱁") !== -1) trackInst = ["vinyl samples", "boom bap drums", "piano"];
        else if (v.label.indexOf("클라우드") !== -1) trackInst = ["ethereal pads", "808 bass", "ambient textures"];
        else if (v.label.indexOf("드릴") !== -1) trackInst = ["sliding 808s", "aggressive hi-hats", "dark synth"];
        else if (v.label.indexOf("에모") !== -1) trackInst = ["electric guitar", "808 bass", "atmospheric reverb"];
      }

      // 앰비언트 장르: 텍스처 특화 악기 세팅
      if (isAmbientGenre && i > 0) {
        if (v.label.indexOf("드론") !== -1) trackInst = ["sustained drones", "deep sub frequencies"];
        else if (v.label.indexOf("네이처") !== -1) trackInst = ["rain sounds", "field recordings", "soft pads"];
        else if (v.label.indexOf("스페이스") !== -1) trackInst = ["vast reverb pads", "cosmic textures", "deep delay"];
        else if (v.label.indexOf("글리치") !== -1) trackInst = ["glitch textures", "digital artifacts", "soft pads"];
        else if (v.label.indexOf("피아노") !== -1) trackInst = ["minimal piano", "ambient pad layers"];
      }

      // 일렉트로닉 장르: 프로덕션 특화
      if (isElectronicGenre && i > 0) {
        if (v.label.indexOf("딥") !== -1) trackInst = ["deep sub bass", "minimal percussion", "warm pads"];
        else if (v.label.indexOf("레트로") !== -1) trackInst = ["analog synths", "gated reverb drums", "arpeggios"];
        else if (v.label.indexOf("하드") !== -1) trackInst = ["distorted kick", "heavy bass", "aggressive synth"];
        else if (v.label.indexOf("퓨처") !== -1) trackInst = ["lush chords", "pitched vocals", "supersaw"];
        else if (v.label.indexOf("앰비언트") !== -1) trackInst = ["atmospheric pads", "soft textures", "minimal rhythm"];
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
            sectionLength: sectionLength,
            variationIndex: i
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
      setPlaylistProgress(i + 1);
    }

    if (tracks.length > 0) {
      setPlaylistTracks(tracks);
      setStep(5);
    }
    setIsGeneratingPlaylist(false);
    setPlaylistProgress(0);
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

            {/* AI 가사: 주제 추천 시스템 */}
            {(lyricsMode === "ai" || lyricsMode === "hybrid") && (
              <div className="space-y-3">
                {/* 주제 추천받기 버튼 */}
                {!showTopicPicker && (
                  <button
                    onClick={function() { setShowTopicPicker(true); setTopicStep(1); }}
                    className="w-full p-4 rounded-xl border border-dashed transition-all text-left"
                    style={{ borderColor: "rgba(139, 92, 246, 0.3)", backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">주제 추천받기</p>
                        <p className="text-xs" style={{ color: "#7A7A8E" }}>주제 + 작법 + 소재 + 훅을 조합해서 가사 방향을 잡아보세요</p>
                      </div>
                    </div>
                  </button>
                )}

                {/* 주제 추천 시스템 패널 */}
                {showTopicPicker && (
                  <div className="glass-card p-4 space-y-4">
                    {/* 헤더 + 닫기 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {topicStep > 1 && (
                          <button onClick={function() { setTopicStep(topicStep - 1); }} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#111118" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A7A8E" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                          </button>
                        )}
                        <span className="text-sm font-bold">
                          {topicStep === 1 ? "1. 주제 선택" : topicStep === 2 ? "2. 세부 주제" : topicStep === 3 ? "3. 작법 선택" : "4. 소재 & 훅 선택"}
                        </span>
                      </div>
                      <button onClick={function() { setShowTopicPicker(false); }} className="text-xs px-2 py-1 rounded-lg" style={{ color: "#7A7A8E", backgroundColor: "#111118" }}>닫기</button>
                    </div>

                    {/* 진행 바 */}
                    <div className="flex gap-1">
                      {[1,2,3,4].map(function(s) {
                        return <div key={s} className="h-1 flex-1 rounded-full" style={{ background: s <= topicStep ? "linear-gradient(90deg, #8B5CF6, #EC4899)" : "#1E1E2E" }} />;
                      })}
                    </div>

                    {/* Step 1: 대분류 */}
                    {topicStep === 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {sortCategoriesByGenre(genre).map(function(cat) {
                          return (
                            <button
                              key={cat.id}
                              onClick={function() { setSelectedCategory(cat.id); setTopicStep(2); }}
                              className="p-3 rounded-xl text-left transition-all"
                              style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
                            >
                              <span className="text-lg block mb-1">{cat.emoji}</span>
                              <span className="text-sm font-semibold block">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Step 2: 중분류 */}
                    {topicStep === 2 && (
                      <div className="space-y-2">
                        {TOPIC_CATEGORIES.filter(function(c) { return c.id === selectedCategory; }).map(function(cat) {
                          return cat.subThemes.map(function(st) {
                            return (
                              <button
                                key={st.id}
                                onClick={function() { setSelectedSubTheme(st); setTopicStep(3); }}
                                className="w-full p-3 rounded-xl text-left transition-all"
                                style={{ backgroundColor: "#111118", border: "1px solid #1E1E2E" }}
                              >
                                <span className="text-sm font-semibold">{st.label}</span>
                                <div className="flex gap-1 mt-1.5">
                                  {st.tags.map(function(t) {
                                    return <span key={t} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}>{t}</span>;
                                  })}
                                </div>
                              </button>
                            );
                          });
                        })}
                        {/* 연관 추천 */}
                        {selectedSubTheme && (
                          <div className="pt-2 border-t" style={{ borderColor: "#1E1E2E" }}>
                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>연관 추천</p>
                            <div className="flex gap-1.5 flex-wrap">
                              {getRelatedSubThemes(selectedSubTheme, genre).map(function(rst) {
                                return (
                                  <button key={rst.id} onClick={function() { setSelectedSubTheme(rst); setTopicStep(3); }} className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: "rgba(236,72,153,0.1)", color: "#EC4899" }}>
                                    {rst.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: 작법 선택 */}
                    {topicStep === 3 && selectedSubTheme && (
                      <div className="space-y-2">
                        {WRITING_TECHNIQUES.map(function(tech) {
                          var relevance = 0;
                          tech.tags.forEach(function(t) { if (selectedSubTheme && selectedSubTheme.tags.indexOf(t) !== -1) relevance++; });
                          return { tech: tech, relevance: relevance };
                        }).sort(function(a, b) { return b.relevance - a.relevance; }).map(function(item) {
                          var tech = item.tech;
                          var isRelevant = item.relevance > 0;
                          return (
                            <button
                              key={tech.id}
                              onClick={function() {
                                setSelectedTechnique(tech);
                                if (selectedSubTheme) {
                                  var rec = generateRecommendation(selectedSubTheme, tech, genre);
                                  setRecommendation(rec);
                                  setPickedObjects([]);
                                  setPickedPlaces([]);
                                  setPickedTimes([]);
                                  setPickedBody([]);
                                  setPickedSenses([]);
                                  setPickedActions([]);
                                  setPickedSounds([]);
                                  setSelectedHook(rec.hookPattern);
                                }
                                setTopicStep(4);
                              }}
                              className="w-full p-3 rounded-xl text-left transition-all"
                              style={{
                                backgroundColor: "#111118",
                                border: "1px solid " + (isRelevant ? "rgba(139,92,246,0.3)" : "#1E1E2E"),
                                opacity: isRelevant ? 1 : 0.5
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{tech.label}</span>
                                {isRelevant && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>추천</span>}
                              </div>
                              <p className="text-xs mt-1" style={{ color: "#7A7A8E" }}>{tech.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Step 4: 단어 블록 + 훅 선택 */}
                    {topicStep === 4 && recommendation && (
                      <div className="space-y-4">
                        {/* 셔플 버튼 */}
                        <button
                          onClick={function() {
                            if (selectedSubTheme && selectedTechnique) {
                              var rec = generateRecommendation(selectedSubTheme, selectedTechnique, genre);
                              setRecommendation(rec);
                              setPickedObjects([]);
                              setPickedPlaces([]);
                              setPickedTimes([]);
                              setPickedBody([]);
                              setPickedSenses([]);
                              setPickedActions([]);
                              setPickedSounds([]);
                              setSelectedHook(rec.hookPattern);
                            }
                          }}
                          className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                          style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
                          다른 단어 블록 뽑기
                        </button>

                        {/* 사물 */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>사물/이미지 (탭하여 선택)</p>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendation.objects.map(function(obj) {
                              var picked = pickedObjects.indexOf(obj) !== -1;
                              return (
                                <button key={obj} onClick={function() { setPickedObjects(picked ? pickedObjects.filter(function(o) { return o !== obj; }) : pickedObjects.concat([obj])); }} className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: picked ? "rgba(139,92,246,0.2)" : "#111118", color: picked ? "#A78BFA" : "#7A7A8E", border: "1px solid " + (picked ? "#8B5CF6" : "#1E1E2E") }}>
                                  {obj}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 장소 */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>장소</p>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendation.places.map(function(pl) {
                              var picked = pickedPlaces.indexOf(pl) !== -1;
                              return (
                                <button key={pl} onClick={function() { setPickedPlaces(picked ? pickedPlaces.filter(function(p) { return p !== pl; }) : pickedPlaces.concat([pl])); }} className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: picked ? "rgba(236,72,153,0.2)" : "#111118", color: picked ? "#EC4899" : "#7A7A8E", border: "1px solid " + (picked ? "#EC4899" : "#1E1E2E") }}>
                                  {pl}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 시간 + 동작 + 소리 (한 줄씩) */}
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>시간</p>
                            <div className="space-y-1">
                              {recommendation.times.map(function(t) {
                                var picked = pickedTimes.indexOf(t) !== -1;
                                return (
                                  <button key={t} onClick={function() { setPickedTimes(picked ? pickedTimes.filter(function(x) { return x !== t; }) : pickedTimes.concat([t])); }} className="w-full px-2 py-1.5 rounded-lg text-[11px] text-left transition-all" style={{ backgroundColor: picked ? "rgba(52,211,153,0.15)" : "#111118", color: picked ? "#34D399" : "#7A7A8E", border: "1px solid " + (picked ? "rgba(52,211,153,0.3)" : "#1E1E2E") }}>
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>동작</p>
                            <div className="space-y-1">
                              {recommendation.actions.slice(0, 3).map(function(a) {
                                var picked = pickedActions.indexOf(a) !== -1;
                                return (
                                  <button key={a} onClick={function() { setPickedActions(picked ? pickedActions.filter(function(x) { return x !== a; }) : pickedActions.concat([a])); }} className="w-full px-2 py-1.5 rounded-lg text-[11px] text-left transition-all" style={{ backgroundColor: picked ? "rgba(251,191,36,0.15)" : "#111118", color: picked ? "#FBBF24" : "#7A7A8E", border: "1px solid " + (picked ? "rgba(251,191,36,0.3)" : "#1E1E2E") }}>
                                    {a}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>소리</p>
                            <div className="space-y-1">
                              {recommendation.sounds.map(function(s) {
                                var picked = pickedSounds.indexOf(s) !== -1;
                                return (
                                  <button key={s} onClick={function() { setPickedSounds(picked ? pickedSounds.filter(function(x) { return x !== s; }) : pickedSounds.concat([s])); }} className="w-full px-2 py-1.5 rounded-lg text-[11px] text-left transition-all" style={{ backgroundColor: picked ? "rgba(96,165,250,0.15)" : "#111118", color: picked ? "#60A5FA" : "#7A7A8E", border: "1px solid " + (picked ? "rgba(96,165,250,0.3)" : "#1E1E2E") }}>
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* 감각 형용사 + 신체 */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>감각/신체</p>
                          <div className="flex flex-wrap gap-1.5">
                            {recommendation.senses.concat(recommendation.body).map(function(sb) {
                              var pickedS = pickedSenses.indexOf(sb) !== -1;
                              var pickedB = pickedBody.indexOf(sb) !== -1;
                              var isPicked = pickedS || pickedB;
                              return (
                                <button key={sb} onClick={function() {
                                  if (recommendation && recommendation.senses.indexOf(sb) !== -1) {
                                    setPickedSenses(pickedS ? pickedSenses.filter(function(x) { return x !== sb; }) : pickedSenses.concat([sb]));
                                  } else {
                                    setPickedBody(pickedB ? pickedBody.filter(function(x) { return x !== sb; }) : pickedBody.concat([sb]));
                                  }
                                }} className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: isPicked ? "rgba(244,114,182,0.15)" : "#111118", color: isPicked ? "#F472B6" : "#7A7A8E", border: "1px solid " + (isPicked ? "rgba(244,114,182,0.3)" : "#1E1E2E") }}>
                                  {sb}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 훅 구조 */}
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#4A4A5E" }}>훅 구조 패턴</p>
                          <div className="space-y-1.5">
                            {HOOK_PATTERNS.filter(function(hp) {
                              if (!selectedSubTheme) return true;
                              var st = selectedSubTheme;
                              var score = 0;
                              hp.tags.forEach(function(t) { if (st.tags.indexOf(t) !== -1) score++; });
                              return score > 0;
                            }).slice(0, 4).map(function(hp) {
                              var isSelected = selectedHook && selectedHook.id === hp.id;
                              return (
                                <button key={hp.id} onClick={function() { setSelectedHook(hp); }} className="w-full p-2.5 rounded-xl text-left transition-all" style={{ backgroundColor: isSelected ? "rgba(139,92,246,0.15)" : "#111118", border: "1px solid " + (isSelected ? "#8B5CF6" : "#1E1E2E") }}>
                                  <span className="text-xs font-semibold" style={{ color: isSelected ? "#A78BFA" : "#E5E5E5" }}>{hp.label}</span>
                                  <p className="text-[11px] mt-0.5" style={{ color: "#7A7A8E" }}>{hp.structure}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 조합 적용 버튼 */}
                        <button
                          onClick={function() {
                            if (selectedSubTheme && selectedTechnique && selectedHook) {
                              var prompt = buildTopicPromptText(
                                selectedSubTheme, selectedTechnique,
                                pickedObjects, pickedPlaces, pickedTimes,
                                pickedBody, pickedSenses, pickedActions, pickedSounds,
                                selectedHook
                              );
                              setLyricsTheme(prompt);
                              setShowTopicPicker(false);
                            }
                          }}
                          disabled={!selectedHook || (pickedObjects.length + pickedPlaces.length + pickedActions.length + pickedSounds.length) === 0}
                          className={"w-full py-3 rounded-xl font-semibold text-white text-sm " + ((selectedHook && (pickedObjects.length + pickedPlaces.length + pickedActions.length + pickedSounds.length) > 0) ? "glow-btn" : "opacity-30")}
                        >
                          이 조합으로 가사 방향 잡기
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 주제 직접 입력 / 추천 결과 표시 */}
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    {lyricsTheme && lyricsTheme.indexOf("Theme:") !== -1 ? "선택한 조합 (수정 가능)" : "주제 / 감정 / 키워드"}
                  </label>
                  <textarea
                    value={lyricsTheme}
                    onChange={function (e) { setLyricsTheme(e.target.value); }}
                    placeholder="주제 추천을 사용하거나 직접 입력하세요. 예: 새벽 3시의 고독, 이별 후 비 오는 거리"
                    rows={lyricsTheme && lyricsTheme.indexOf("Theme:") !== -1 ? 6 : 2}
                    className="input-dark text-sm"
                  />
                </div>
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

              {isGeneratingPlaylist ? (
                <div className="space-y-3">
                  {/* 프로그레스 바 */}
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1E1E2E" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: (playlistProgress / playlistCount * 100) + "%",
                        background: "linear-gradient(90deg, #8B5CF6, #EC4899)"
                      }}
                    />
                  </div>

                  {/* 진행 상태 텍스트 */}
                  <div className="flex items-center justify-center gap-3 py-3">
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#2A2A4A" strokeWidth="3" />
                      <path d="M12 2a10 10 0 019.95 9" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: "#8B5CF6" }}>
                      {playlistProgress}/{playlistCount}곡 생성 중...
                    </span>
                  </div>

                  {/* 현재 트랙 정보 */}
                  <p className="text-center text-xs" style={{ color: "#7A7A8E" }}>
                    각 트랙마다 고유한 배리에이션을 만들고 있어요
                  </p>
                </div>
              ) : (
                <button
                  onClick={generatePlaylist}
                  className="w-full py-3 rounded-xl font-semibold text-white glow-btn"
                >
                  {playlistCount + "곡 플레이리스트 생성"}
                </button>
              )}
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
