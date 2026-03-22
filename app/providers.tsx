"use client";

import { ApiKeyProvider } from "@/lib/api-key-context";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApiKeyProvider>
      {children}
    </ApiKeyProvider>
  );
}
