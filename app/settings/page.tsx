"use client";

import { useState } from "react";
import Link from "next/link";
import { useApiKey } from "@/lib/api-key-context";

export default function SettingsPage() {
  var { apiKey, setApiKey, isKeySet, ownerPassword, setOwnerPassword, isOwnerMode, rememberSession, setRememberSession, clearKey } = useApiKey();
  var [inputKey, setInputKey] = useState(apiKey);
  var [inputOwnerPw, setInputOwnerPw] = useState(ownerPassword);
  var [showKey, setShowKey] = useState(false);
  var [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  var [testMessage, setTestMessage] = useState("");
  var [ownerTestStatus, setOwnerTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  var [ownerTestMessage, setOwnerTestMessage] = useState("");

  async function testConnection() {
    setTestStatus("testing");
    try {
      var res = await fetch("/api/test-key", {
        method: "POST",
        headers: { "x-api-key": inputKey }
      });
      var data = await res.json();
      if (data.valid) {
        setTestStatus("success");
        setTestMessage("연결 성공!");
        setApiKey(inputKey);
      } else {
        setTestStatus("error");
        setTestMessage(data.error || "연결 실패");
      }
    } catch (err) {
      setTestStatus("error");
      setTestMessage("네트워크 오류");
    }
  }

  function maskKey(key: string): string {
    if (!key) return "";
    if (key.length < 12) return "****";
    return key.substring(0, 7) + "..." + key.substring(key.length - 4);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-5 py-5">
        <Link href="/" className="mr-4 w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: "#111118", color: "#7A7A8E" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-lg font-bold">설정</h1>
      </header>

      <main className="flex-1 px-5 py-4 space-y-6 pb-24">

        {/* AI 엔진 설정 — 눈에 잘 띄게 */}
        <section className="rounded-2xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(236,72,153,0.08) 100%)", border: "1px solid rgba(139, 92, 246, 0.25)" }}>
          {/* 배경 글로우 */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ background: "rgba(139, 92, 246, 0.15)" }} />

          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">AI 가사 엔진</h2>
                <p className="text-xs" style={{ color: "#A78BFA" }}>API 키를 연결하면 진짜 AI가 매번 새로운 가사를 생성합니다</p>
              </div>
            </div>

            {/* 상태 배너 */}
            <div className="flex items-center gap-2 my-4 px-4 py-3 rounded-xl" style={{ backgroundColor: isKeySet && !isOwnerMode ? "rgba(52, 211, 153, 0.1)" : "rgba(251, 191, 36, 0.08)", border: "1px solid " + (isKeySet && !isOwnerMode ? "rgba(52, 211, 153, 0.2)" : "rgba(251, 191, 36, 0.15)") }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isKeySet && !isOwnerMode ? "#34D399" : "#FBBF24" }} />
              <span className="text-sm font-medium" style={{ color: isKeySet && !isOwnerMode ? "#34D399" : "#FBBF24" }}>
                {isKeySet && !isOwnerMode ? "AI 엔진 연결됨 — " + maskKey(apiKey) : isOwnerMode ? "오너 모드 활성 중" : "미연결 — 데모 가사만 출력됩니다"}
              </span>
            </div>

            {/* API 키 입력 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold block mb-2" style={{ color: "#E5E5E5" }}>Anthropic API Key 입력</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={inputKey}
                    onChange={function(e) { setInputKey(e.target.value); setTestStatus("idle"); }}
                    placeholder="sk-ant-api03-..."
                    className="input-dark pr-10 text-base"
                    style={{ fontSize: "16px", padding: "14px 44px 14px 16px" }}
                  />
                  <button
                    onClick={function() { setShowKey(!showKey); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                    style={{ color: "#7A7A8E" }}
                  >
                    {showKey ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* 세션 기억 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={function(e) { setRememberSession(e.target.checked); }}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "#8B5CF6" }}
                />
                <span className="text-sm" style={{ color: "#9CA3AF" }}>이 탭에서 기억하기 (탭 닫으면 자동 삭제)</span>
              </label>

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={testConnection}
                  disabled={!inputKey || testStatus === "testing"}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: testStatus === "success" ? "rgba(52,211,153,0.2)" : testStatus === "error" ? "rgba(248,113,113,0.15)" : "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    color: testStatus === "success" ? "#34D399" : testStatus === "error" ? "#F87171" : "white",
                    opacity: !inputKey ? 0.3 : 1
                  }}
                >
                  {testStatus === "testing" ? "테스트 중..." : testStatus === "success" ? "연결 성공!" : testStatus === "error" ? "재시도" : "연결 테스트"}
                </button>
                {isKeySet && !isOwnerMode && (
                  <button
                    onClick={function() { clearKey(); setInputKey(""); setTestStatus("idle"); }}
                    className="px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "#F87171" }}
                  >
                    해제
                  </button>
                )}
              </div>

              {testMessage && (
                <p className="text-sm font-medium" style={{ color: testStatus === "success" ? "#34D399" : "#F87171" }}>{testMessage}</p>
              )}
            </div>

            {/* API 키 발급 안내 */}
            <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "rgba(139, 92, 246, 0.08)", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "#A78BFA" }}>API 키가 없으신가요?</p>
              <ol className="space-y-1.5 text-sm" style={{ color: "#9CA3AF" }}>
                <li>1. <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#8B5CF6" }}>console.anthropic.com</a> 접속</li>
                <li>2. 회원가입 (이메일, 구글 계정)</li>
                <li>3. API Keys 메뉴 &rarr; Create Key</li>
                <li>4. 크레딧 충전 ($5부터, 약 6,500원)</li>
                <li>5. 발급된 키를 위 입력란에 붙여넣기</li>
              </ol>
              <p className="text-xs mt-3" style={{ color: "#7A7A8E" }}>$5로 약 200곡 이상의 가사를 생성할 수 있습니다.</p>
            </div>

            {/* 보안 안내 */}
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(52, 211, 153, 0.05)", border: "1px solid rgba(52, 211, 153, 0.1)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "#34D399" }}>보안 안내</p>
              <ul className="space-y-1.5 text-sm" style={{ color: "#9CA3AF" }}>
                <li className="flex gap-2"><span style={{ color: "#34D399" }}>&#10003;</span> API 키는 브라우저 메모리에만 저장됩니다</li>
                <li className="flex gap-2"><span style={{ color: "#34D399" }}>&#10003;</span> 서버에 저장되지 않으며, 로그에 기록되지 않습니다</li>
                <li className="flex gap-2"><span style={{ color: "#34D399" }}>&#10003;</span> 탭을 닫으면 자동으로 삭제됩니다</li>
                <li className="flex gap-2"><span style={{ color: "#34D399" }}>&#10003;</span> HTTPS로 암호화되어 안전하게 전송됩니다</li>
                <li className="flex gap-2"><span style={{ color: "#34D399" }}>&#10003;</span> 다른 사용자가 내 키에 접근할 수 없습니다</li>
              </ul>
            </div>

            {/* 유의사항 */}
            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(251, 191, 36, 0.05)", border: "1px solid rgba(251, 191, 36, 0.1)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "#FBBF24" }}>유의사항</p>
              <ul className="space-y-1.5 text-sm" style={{ color: "#9CA3AF" }}>
                <li className="flex gap-2"><span style={{ color: "#FBBF24" }}>!</span> API 키를 다른 사람에게 공유하지 마세요</li>
                <li className="flex gap-2"><span style={{ color: "#FBBF24" }}>!</span> 키가 유출된 경우 즉시 console.anthropic.com에서 재발급하세요</li>
                <li className="flex gap-2"><span style={{ color: "#FBBF24" }}>!</span> 가사 생성 시 곡당 약 10~30원의 API 비용이 발생합니다</li>
                <li className="flex gap-2"><span style={{ color: "#FBBF24" }}>!</span> API 키 없이도 데모 모드로 앱을 사용할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 아티스트 정보 */}
        <section className="glass-card p-5">
          <h2 className="font-bold mb-4">아티스트 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: "#7A7A8E" }}>아티스트명</label>
              <input type="text" placeholder="아티스트명을 입력하세요" className="input-dark" />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: "#7A7A8E" }}>주요 장르</label>
              <input type="text" placeholder="예: Pop, R&B, Lo-Fi" className="input-dark" />
            </div>
          </div>
        </section>

        {/* 앱 정보 */}
        <section className="glass-card p-5">
          <h2 className="font-bold mb-2">HitCraft Engine</h2>
          <p className="text-sm" style={{ color: "#7A7A8E" }}>v1.2.0</p>
          <p className="text-sm mt-1" style={{ color: "#7A7A8E" }}>데이터 기반 AI 음악 히트메이커</p>
        </section>

        {/* 오너 모드 (하단, 작게) */}
        <section className="glass-card p-4" style={{ opacity: 0.7 }}>
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A7A8E" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span className="text-xs font-semibold" style={{ color: "#7A7A8E" }}>관리자</span>
            {isOwnerMode && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(52,211,153,0.1)", color: "#34D399" }}>활성</span>}
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputOwnerPw}
              onChange={function(e) { setInputOwnerPw(e.target.value); setOwnerTestStatus("idle"); }}
              placeholder="비밀번호"
              className="input-dark text-sm flex-1"
              style={{ padding: "8px 12px" }}
            />
            <button
              onClick={async function() {
                setOwnerTestStatus("testing");
                try {
                  var res = await fetch("/api/test-owner", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-owner-password": inputOwnerPw }
                  });
                  var data = await res.json();
                  if (data.valid) {
                    setOwnerTestStatus("success");
                    setOwnerTestMessage("인증됨");
                    setOwnerPassword(inputOwnerPw);
                  } else {
                    setOwnerTestStatus("error");
                    setOwnerTestMessage(data.error || "실패");
                  }
                } catch (err) {
                  setOwnerTestStatus("error");
                  setOwnerTestMessage("오류");
                }
              }}
              disabled={!inputOwnerPw || ownerTestStatus === "testing"}
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: ownerTestStatus === "success" ? "rgba(52,211,153,0.15)" : "#1E1E2E",
                color: ownerTestStatus === "success" ? "#34D399" : "#7A7A8E",
                opacity: !inputOwnerPw ? 0.3 : 1
              }}
            >
              {ownerTestStatus === "testing" ? "..." : ownerTestStatus === "success" ? "OK" : "인증"}
            </button>
            {isOwnerMode && (
              <button
                onClick={function() { clearKey(); setInputOwnerPw(""); setOwnerTestStatus("idle"); }}
                className="px-3 py-2 rounded-lg text-xs"
                style={{ color: "#F87171" }}
              >
                해제
              </button>
            )}
          </div>
          {ownerTestMessage && ownerTestStatus === "error" && (
            <p className="text-[10px] mt-1" style={{ color: "#F87171" }}>{ownerTestMessage}</p>
          )}
        </section>
      </main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-3" style={{ backgroundColor: "rgba(5, 5, 8, 0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(30, 30, 46, 0.5)" }}>
        <Link href="/" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"/></svg>
          <span className="text-[10px] font-medium">트렌드</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h4"/></svg>
          <span className="text-[10px] font-medium">히스토리</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-0.5" style={{ color: "#8B5CF6" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span className="text-[10px] font-medium">설정</span>
        </Link>
      </nav>
    </div>
  );
}
