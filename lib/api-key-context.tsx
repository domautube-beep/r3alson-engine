"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ApiKeyContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  rememberSession: boolean;
  setRememberSession: (v: boolean) => void;
  clearKey: () => void;
};

var ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: "",
  setApiKey: function() {},
  isKeySet: false,
  rememberSession: false,
  setRememberSession: function() {},
  clearKey: function() {}
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  var [apiKey, setApiKeyState] = useState("");
  var [rememberSession, setRememberSession] = useState(false);

  // sessionStorage에서 복원 (탭 닫으면 삭제됨)
  useEffect(function() {
    try {
      var saved = sessionStorage.getItem("r3_ak");
      if (saved) {
        setApiKeyState(saved);
        setRememberSession(true);
      }
    } catch (e) {}
  }, []);

  function setApiKey(key: string) {
    setApiKeyState(key);
    if (rememberSession && key) {
      try { sessionStorage.setItem("r3_ak", key); } catch (e) {}
    }
  }

  function clearKey() {
    setApiKeyState("");
    try { sessionStorage.removeItem("r3_ak"); } catch (e) {}
  }

  // rememberSession 변경 시 처리
  useEffect(function() {
    if (rememberSession && apiKey) {
      try { sessionStorage.setItem("r3_ak", apiKey); } catch (e) {}
    } else {
      try { sessionStorage.removeItem("r3_ak"); } catch (e) {}
    }
  }, [rememberSession, apiKey]);

  return (
    <ApiKeyContext.Provider value={{
      apiKey: apiKey,
      setApiKey: setApiKey,
      isKeySet: apiKey.length > 0,
      rememberSession: rememberSession,
      setRememberSession: setRememberSession,
      clearKey: clearKey
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  return useContext(ApiKeyContext);
}
