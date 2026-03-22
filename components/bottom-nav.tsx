"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApiKey } from "@/lib/api-key-context";

export function BottomNav() {
  var pathname = usePathname();
  var { isKeySet } = useApiKey();

  var tabs = [
    {
      href: "/",
      label: "트렌드",
      icon: function(active: boolean) {
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {active ? (
              /* filled — 선택 상태 */
              <path
                d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"
                fill="currentColor"
              />
            ) : (
              /* stroke — 비선택 상태 */
              <path
                d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            )}
          </svg>
        );
      }
    },
    {
      href: "/history",
      label: "히스토리",
      icon: function(active: boolean) {
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {active ? (
              <>
                <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.2"/>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        );
      }
    },
    {
      href: "/settings",
      label: "설정",
      icon: function(active: boolean) {
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {active ? (
              <>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        );
      }
    }
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        /* Apple 탭바: 반투명 블러 배경 */
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        /* Apple separator line — 탭바 상단 */
        borderTop: "0.5px solid rgba(84, 84, 88, 0.65)"
      }}
    >
      {/* Safe area 포함 패딩 */}
      <div
        className="flex items-center justify-around"
        style={{ padding: "10px 0 calc(10px + env(safe-area-inset-bottom, 0px)) 0" }}
      >
        {tabs.map(function(tab) {
          var isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1"
              style={{
                /* 최소 터치 타겟 44x44pt */
                minWidth: "64px",
                minHeight: "44px",
                justifyContent: "center",
                color: isActive ? "#8B5CF6" : "rgba(235, 235, 245, 0.3)",
                transition: "color 150ms ease-out"
              }}
            >
              {tab.icon(isActive)}
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: isActive ? "600" : "400",
                  letterSpacing: "0.02em",
                  lineHeight: "1"
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* AI 상태 인디케이터 — 우측 상단 절제된 표현 */}
      <div
        className="absolute flex items-center gap-1"
        style={{ top: "10px", right: "16px" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: isKeySet ? "#30D158" : "#FF9F0A",
            animation: "pulse 2.5s ease-in-out infinite"
          }}
        />
        <span
          style={{
            fontSize: "10px",
            fontWeight: "500",
            color: isKeySet ? "rgba(48, 209, 88, 0.8)" : "rgba(255, 159, 10, 0.8)"
          }}
        >
          {isKeySet ? "AI" : "DEMO"}
        </span>
      </div>
    </nav>
  );
}
