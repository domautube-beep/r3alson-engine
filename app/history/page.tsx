"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type HistoryEntry = {
  id: number;
  date: string;
  genre: string;
  moods: string[];
  vocal: string;
  bpm: number;
  prompt: string;
  lyrics: string;
  title: string;
  tags: string;
};

export default function HistoryPage() {
  var [history, setHistory] = useState<HistoryEntry[]>([]);
  var [expanded, setExpanded] = useState<number | null>(null);
  var [copied, setCopied] = useState("");

  useEffect(function() {
    var data = JSON.parse(localStorage.getItem("r3alson_history") || "[]");
    setHistory(data);
  }, []);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).catch(function() {});
    setCopied(label);
    setTimeout(function() { setCopied(""); }, 2000);
  }

  function deleteEntry(id: number) {
    var updated = history.filter(function(h) { return h.id !== id; });
    setHistory(updated);
    localStorage.setItem("r3alson_history", JSON.stringify(updated));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-5 py-5">
        <Link href="/" className="mr-4 w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: "#111118", color: "#7A7A8E" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>
        <h1 className="text-lg font-bold">히스토리</h1>
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>{history.length}곡</span>
      </header>

      <main className="flex-1 px-5 py-4 pb-24">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#111118" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A4A5E" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            </div>
            <p className="font-semibold text-lg mb-2">아직 만든 곡이 없어요</p>
            <p className="text-sm mb-6" style={{ color: "#7A7A8E" }}>
              곡을 만들고 저장하면 여기에 기록됩니다
            </p>
            <Link href="/create" className="glow-btn px-6 py-3 rounded-xl font-semibold text-white">
              첫 곡 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(function(entry) {
              var isExpanded = expanded === entry.id;
              return (
                <div key={entry.id} className="glass-card p-4 fade-in">
                  <button
                    onClick={function() { setExpanded(isExpanded ? null : entry.id); }}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{entry.title}</span>
                      <span className="text-xs" style={{ color: "#7A7A8E" }}>{entry.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="mood-chip">{entry.genre}</span>
                      {entry.moods.slice(0, 2).map(function(m) {
                        return <span key={m} className="mood-chip">{m}</span>;
                      })}
                      <span className="mood-chip">{entry.bpm} BPM</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-3 fade-in">
                      {/* 프롬프트 */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: "#7A7A8E" }}>프롬프트</span>
                          <button onClick={function() { copyToClipboard(entry.prompt, "p-" + entry.id); }} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: copied === "p-" + entry.id ? "rgba(52,211,153,0.2)" : "rgba(139,92,246,0.1)", color: copied === "p-" + entry.id ? "#34D399" : "#8B5CF6" }}>
                            {copied === "p-" + entry.id ? "복사됨" : "복사"}
                          </button>
                        </div>
                        <p className="text-sm p-2 rounded-lg" style={{ backgroundColor: "#050508", color: "#9CA3AF" }}>{entry.prompt}</p>
                      </div>

                      {/* 가사 */}
                      {entry.lyrics && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold" style={{ color: "#7A7A8E" }}>가사</span>
                            <button onClick={function() { copyToClipboard(entry.lyrics, "l-" + entry.id); }} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: copied === "l-" + entry.id ? "rgba(52,211,153,0.2)" : "rgba(139,92,246,0.1)", color: copied === "l-" + entry.id ? "#34D399" : "#8B5CF6" }}>
                              {copied === "l-" + entry.id ? "복사됨" : "복사"}
                            </button>
                          </div>
                          <pre className="text-sm p-2 rounded-lg whitespace-pre-wrap" style={{ backgroundColor: "#050508", color: "#9CA3AF" }}>{entry.lyrics}</pre>
                        </div>
                      )}

                      {/* 삭제 */}
                      <button
                        onClick={function() { deleteEntry(entry.id); }}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ color: "#F87171", backgroundColor: "rgba(248, 113, 113, 0.1)" }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 하단 탭바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-3" style={{ backgroundColor: "rgba(5, 5, 8, 0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(30, 30, 46, 0.5)" }}>
        <Link href="/" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"/></svg>
          <span className="text-[10px] font-medium">트렌드</span>
        </Link>
        <Link href="/history" className="flex flex-col items-center gap-0.5" style={{ color: "#8B5CF6" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h4"/></svg>
          <span className="text-[10px] font-medium">히스토리</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-0.5" style={{ color: "#4A4A5E" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span className="text-[10px] font-medium">설정</span>
        </Link>
      </nav>
    </div>
  );
}
