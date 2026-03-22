"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApiKey } from "@/lib/api-key-context";

export function BottomNav() {
  var pathname = usePathname();
  var { isKeySet } = useApiKey();

  var tabs = [
    { href: "/", label: "트렌드", icon: function(active: boolean) {
      return <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "2"}><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z"/></svg>;
    }},
    { href: "/history", label: "히스토리", icon: function(active: boolean) {
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h4"/></svg>;
    }},
    { href: "/settings", label: "설정", icon: function(active: boolean) {
      return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
    }}
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-3"
      style={{
        backgroundColor: "rgba(5, 5, 8, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(30, 30, 46, 0.5)"
      }}
    >
      {tabs.map(function(tab) {
        var isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 relative"
            style={{ color: isActive ? "#8B5CF6" : "#4A4A5E" }}
          >
            {tab.icon(isActive)}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}

      {/* AI 상태 인디케이터 */}
      <div className="absolute top-2 right-4 flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: isKeySet ? "#34D399" : "#FBBF24",
            boxShadow: isKeySet ? "0 0 6px rgba(52, 211, 153, 0.5)" : "0 0 6px rgba(251, 191, 36, 0.5)",
            animation: "pulse 2s ease-in-out infinite"
          }}
        />
        <span className="text-[9px] font-medium" style={{ color: isKeySet ? "#34D399" : "#FBBF24" }}>
          {isKeySet ? "AI" : "DEMO"}
        </span>
      </div>
    </nav>
  );
}
