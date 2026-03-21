"use client";

import { useState } from "react";
import Link from "next/link";
import trendsData from "@/data/trends.json";

// 무드 옵션 전체 목록
var MOODS = [
  "Melancholic", "Chill", "Dreamy", "Eerie", "Peaceful",
  "Nostalgic", "Cinematic", "Epic", "Romantic", "Energetic",
  "Dark", "Euphoric", "Mysterious", "Triumphant", "Haunting",
  "Atmospheric", "Groovy", "Aggressive", "Ethereal", "Warm"
];

// 장르 목록 (트렌드 데이터에서)
var GENRES = trendsData.trends.map(function (t) { return t.genre; });

export default function CreatePage() {
  // 상태 관리
  var [step, setStep] = useState(1);
  var [mode, setMode] = useState(""); // trend, free, hybrid
  var [genre, setGenre] = useState("");
  var [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  var [bpm, setBpm] = useState(80);
  var [lyricsMode, setLyricsMode] = useState("ai"); // none, ai, manual, hybrid
  var [lyricsTheme, setLyricsTheme] = useState("");
  var [generatedLyrics, setGeneratedLyrics] = useState("");
  var [generatedPrompt, setGeneratedPrompt] = useState("");
  var [generatedTitle, setGeneratedTitle] = useState("");
  var [generatedTags, setGeneratedTags] = useState("");
  var [isGenerating, setIsGenerating] = useState(false);
  var [copied, setCopied] = useState("");
  var [customMood, setCustomMood] = useState("");

  // 트렌드 모드에서 자동 세팅
  function applyTrendMode() {
    var top = trendsData.trends[0];
    setGenre(top.genre);
    setSelectedMoods(top.mood);
    setBpm(parseInt(top.avgBpm.split("-")[0]) + 5);
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
      var res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genre: genre,
          moods: selectedMoods,
          bpm: bpm,
          lyricsMode: lyricsMode,
          lyricsTheme: lyricsTheme
        })
      });

      var data = await res.json();
      setGeneratedPrompt(data.prompt || "");
      setGeneratedLyrics(data.lyrics || "");
      setGeneratedTitle(data.title || "");
      setGeneratedTags(data.tags || "");
    } catch (err) {
      // API 없을 때 데모 데이터 생성
      var demoPrompt = genre.toLowerCase() + ", " + selectedMoods.join(", ").toLowerCase() + ", " + bpm + " BPM, atmospheric pads, distant reverb vocals, cinematic, ethereal, 2:45";
      setGeneratedPrompt(demoPrompt);

      if (lyricsMode === "ai" || lyricsMode === "hybrid") {
        setGeneratedLyrics("[Verse 1]\nempty streets below my window\nshadows dancing with the rain\nevery echo tells a story\nof a love I can't explain\n\n[Chorus]\nfade into the hollow night\nwhere the stars forget to shine\nI'll be waiting in the silence\nat the edge of space and time\n\n[Verse 2]\nneon lights through foggy glass\nwhispers carried by the wind\nevery moment feels like falling\nthrough a dream that never ends\n\n[Chorus]\nfade into the hollow night\nwhere the stars forget to shine\nI'll be waiting in the silence\nat the edge of space and time");
      }

      setGeneratedTitle("Hollow Echo");
      setGeneratedTags("#" + genre.toLowerCase().replace(/ /g, "") + " #" + selectedMoods[0].toLowerCase() + " #atmospheric #ambient #newmusic #spotify #aimusic");
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
      <header className="flex items-center px-4 py-4 border-b" style={{ borderColor: "#2A2A4A" }}>
        <Link href="/" className="mr-3 text-lg" style={{ color: "#9CA3AF" }}>&#8592;</Link>
        <div>
          <h1 className="text-lg font-bold">새 곡 만들기</h1>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Step {step}/4
          </p>
        </div>
      </header>

      {/* 프로그레스 바 */}
      <div className="h-1" style={{ backgroundColor: "#1A1A2E" }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: (step * 25) + "%",
            background: "linear-gradient(to right, #8B5CF6, #EC4899)"
          }}
        />
      </div>

      <main className="flex-1 px-4 py-6 pb-8">

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
              className="w-full text-left rounded-2xl p-5 border transition-all"
              style={{ backgroundColor: "#1A1A2E", borderColor: mode === "trend" ? "#8B5CF6" : "#2A2A4A" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{"\uD83C\uDFAF"}</span>
                <span className="font-bold text-lg">트렌드 모드</span>
              </div>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                데이터가 추천하는 장르/무드로 시작. 가장 높은 스트리밍 확률.
              </p>
            </button>

            {/* 자유 모드 */}
            <button
              onClick={function () { setMode("free"); setStep(2); }}
              className="w-full text-left rounded-2xl p-5 border transition-all"
              style={{ backgroundColor: "#1A1A2E", borderColor: mode === "free" ? "#8B5CF6" : "#2A2A4A" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{"\uD83C\uDFA8"}</span>
                <span className="font-bold text-lg">자유 모드</span>
              </div>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                내 감성대로 장르/무드를 선택. 데이터는 참고만.
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
              className="w-full text-left rounded-2xl p-5 border transition-all relative"
              style={{ backgroundColor: "#1A1A2E", borderColor: mode === "hybrid" ? "#8B5CF6" : "#2A2A4A" }}
            >
              <span
                className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "linear-gradient(to right, #8B5CF6, #EC4899)", color: "white" }}
              >
                추천
              </span>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{"\uD83D\uDD00"}</span>
                <span className="font-bold text-lg">하이브리드 모드</span>
              </div>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                데이터가 제안하고, 내가 수정. 확률 + 개성 둘 다.
              </p>
            </button>
          </div>
        )}

        {/* ===== Step 2: 장르/무드/BPM 설정 ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">곡 설정</h2>
            <p className="text-sm" style={{ color: "#9CA3AF" }}>
              {mode === "trend" ? "트렌드 기반으로 세팅됨. 수정도 가능해요." :
               mode === "hybrid" ? "데이터 제안 + 자유롭게 수정하세요." :
               "자유롭게 선택하세요. 트렌드 데이터는 참고용."}
            </p>

            {/* 장르 선택 */}
            <div>
              <label className="text-sm font-semibold block mb-2">장르</label>
              <select
                value={genre}
                onChange={function (e) { setGenre(e.target.value); }}
                className="w-full p-3 rounded-xl text-white border"
                style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A" }}
              >
                <option value="">장르를 선택하세요</option>
                {GENRES.map(function (g) {
                  var trend = trendsData.trends.find(function (t) { return t.genre === g; });
                  var label = g + (trend ? " (" + (trend.growth > 0 ? "+" : "") + trend.growth + "%)" : "");
                  return <option key={g} value={g}>{label}</option>;
                })}
              </select>
              {genre && getCurrentTrendInfo() && (
                <p className="text-xs mt-1" style={{ color: getCurrentTrendInfo()!.growth > 0 ? "#10B981" : "#6B7280" }}>
                  {getCurrentTrendInfo()!.growth > 0
                    ? "이 장르는 현재 성장 중이에요"
                    : "트렌드와 다른 선택도 차별화 전략이 될 수 있어요"}
                </p>
              )}
            </div>

            {/* 무드 선택 */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                무드 <span style={{ color: "#9CA3AF" }}>(여러 개 선택 가능)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map(function (m) {
                  var isSelected = selectedMoods.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={function () { toggleMood(m); }}
                      className="px-3 py-1.5 text-sm rounded-full border transition-all"
                      style={{
                        backgroundColor: isSelected ? "rgba(139, 92, 246, 0.2)" : "transparent",
                        borderColor: isSelected ? "#8B5CF6" : "#2A2A4A",
                        color: isSelected ? "#8B5CF6" : "#9CA3AF"
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
              {/* 직접 입력 */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customMood}
                  onChange={function (e) { setCustomMood(e.target.value); }}
                  placeholder="직접 입력"
                  className="flex-1 px-3 py-2 rounded-xl text-sm border"
                  style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
                  onKeyDown={function (e) { if (e.key === "Enter") addCustomMood(); }}
                />
                <button
                  onClick={addCustomMood}
                  className="px-3 py-2 rounded-xl text-sm"
                  style={{ backgroundColor: "#8B5CF6", color: "white" }}
                >
                  추가
                </button>
              </div>
            </div>

            {/* BPM */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                BPM: <span style={{ color: "#8B5CF6" }}>{bpm}</span>
              </label>
              <input
                type="range"
                min="50"
                max="180"
                value={bpm}
                onChange={function (e) { setBpm(parseInt(e.target.value)); }}
                className="w-full"
                style={{ accentColor: "#8B5CF6" }}
              />
              <div className="flex justify-between text-xs" style={{ color: "#9CA3AF" }}>
                <span>50 (느림)</span>
                <span>
                  {genre && getCurrentTrendInfo()
                    ? "이 장르 적정: " + getCurrentTrendInfo()!.avgBpm
                    : "115 (보통)"}
                </span>
                <span>180 (빠름)</span>
              </div>
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={function () { setStep(3); }}
              disabled={!genre || selectedMoods.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-opacity"
              style={{
                background: (!genre || selectedMoods.length === 0) ? "#4B5563" : "linear-gradient(to right, #8B5CF6, #EC4899)",
                opacity: (!genre || selectedMoods.length === 0) ? 0.5 : 1
              }}
            >
              다음: 가사
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
                  className="w-full p-3 rounded-xl border text-sm"
                  style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
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
                  className="w-full p-3 rounded-xl border text-sm"
                  style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
                />
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              onClick={generateAll}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg"
              style={{
                background: isGenerating ? "#4B5563" : "linear-gradient(to right, #8B5CF6, #EC4899)"
              }}
            >
              {isGenerating ? "AI가 만들고 있어요..." : "프롬프트 + 메타데이터 생성"}
            </button>
          </div>
        )}

        {/* ===== Step 4: 결과 패키지 ===== */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="text-center mb-4">
              <span className="text-3xl">{"\uD83C\uDF89"}</span>
              <h2 className="text-xl font-bold mt-2">완성!</h2>
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                아래 내용을 수노에 붙여넣으세요
              </p>
            </div>

            {/* 수노 프롬프트 */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
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
                className="w-full p-2 rounded-lg text-sm border"
                style={{ backgroundColor: "#0F0F23", borderColor: "#2A2A4A", color: "#E5E5E5" }}
              />
            </div>

            {/* 가사 */}
            {generatedLyrics && (
              <div className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
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
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
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
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: "#1A1A2E", borderColor: "#2A2A4A" }}>
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

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl text-center font-semibold border"
                style={{ borderColor: "#2A2A4A", color: "#9CA3AF" }}
              >
                홈으로
              </Link>
              <button
                onClick={function () {
                  setStep(1);
                  setMode("");
                  setGenre("");
                  setSelectedMoods([]);
                  setGeneratedPrompt("");
                  setGeneratedLyrics("");
                  setGeneratedTitle("");
                  setGeneratedTags("");
                }}
                className="flex-1 py-3 rounded-xl text-center font-semibold text-white"
                style={{ background: "linear-gradient(to right, #8B5CF6, #EC4899)" }}
              >
                새 곡 더 만들기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
