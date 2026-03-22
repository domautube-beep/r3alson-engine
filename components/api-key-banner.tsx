"use client";

import Link from "next/link";
import { useApiKey } from "@/lib/api-key-context";

export function ApiKeyBanner() {
  var { isKeySet } = useApiKey();

  if (isKeySet) return null;

  return (
    <Link
      href="/settings"
      className="block rounded-2xl p-4 transition-all hover:scale-[1.01]"
      style={{
        background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))",
        border: "1px solid rgba(251, 191, 36, 0.25)"
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(251, 191, 36, 0.15)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: "#FBBF24" }}>AI 가사 엔진을 활성화하세요</p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>API 키를 연결하면 매번 새로운 AI 가사가 생성됩니다. 설정에서 연결하기 &rarr;</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </Link>
  );
}
