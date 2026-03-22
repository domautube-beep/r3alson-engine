"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ApiKeyContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  ownerPassword: string;
  setOwnerPassword: (pw: string) => void;
  isOwnerMode: boolean;
  rememberSession: boolean;
  setRememberSession: (v: boolean) => void;
  clearKey: () => void;
};

var ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: "",
  setApiKey: function() {},
  isKeySet: false,
  ownerPassword: "",
  setOwnerPassword: function() {},
  isOwnerMode: false,
  rememberSession: false,
  setRememberSession: function() {},
  clearKey: function() {}
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  var [apiKey, setApiKeyState] = useState("");
  var [ownerPassword, setOwnerPasswordState] = useState("");
  var [isOwnerMode, setIsOwnerMode] = useState(false);
  var [rememberSession, setRememberSession] = useState(false);

  // sessionStorage에서 복원
  useEffect(function() {
    try {
      var saved = sessionStorage.getItem("r3_ak");
      if (saved) { setApiKeyState(saved); setRememberSession(true); }
      var savedOwner = sessionStorage.getItem("r3_owner");
      if (savedOwner) { setOwnerPasswordState(savedOwner); setIsOwnerMode(true); }
    } catch (e) {}
  }, []);

  function setApiKey(key: string) {
    setApiKeyState(key);
    setIsOwnerMode(false);
    if (rememberSession && key) {
      try { sessionStorage.setItem("r3_ak", key); } catch (e) {}
    }
  }

  function setOwnerPassword(pw: string) {
    setOwnerPasswordState(pw);
    setIsOwnerMode(true);
    setApiKeyState(""); // 오너 모드면 개인 키 불필요
    if (rememberSession && pw) {
      try { sessionStorage.setItem("r3_owner", pw); } catch (e) {}
    }
  }

  function clearKey() {
    setApiKeyState("");
    setOwnerPasswordState("");
    setIsOwnerMode(false);
    try {
      sessionStorage.removeItem("r3_ak");
      sessionStorage.removeItem("r3_owner");
    } catch (e) {}
  }

  useEffect(function() {
    if (rememberSession) {
      try {
        if (apiKey) sessionStorage.setItem("r3_ak", apiKey);
        if (ownerPassword) sessionStorage.setItem("r3_owner", ownerPassword);
      } catch (e) {}
    } else {
      try {
        sessionStorage.removeItem("r3_ak");
        sessionStorage.removeItem("r3_owner");
      } catch (e) {}
    }
  }, [rememberSession, apiKey, ownerPassword]);

  return (
    <ApiKeyContext.Provider value={{
      apiKey: apiKey,
      setApiKey: setApiKey,
      isKeySet: apiKey.length > 0 || isOwnerMode,
      ownerPassword: ownerPassword,
      setOwnerPassword: setOwnerPassword,
      isOwnerMode: isOwnerMode,
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
