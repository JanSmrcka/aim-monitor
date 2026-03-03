"use client";

import { createContext, useContext, useRef, useCallback } from "react";

type ResetFn = () => void;

const ChatContext = createContext<{
  registerReset: (fn: ResetFn) => void;
  resetChat: () => void;
}>({
  registerReset: () => {},
  resetChat: () => {},
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const resetRef = useRef<ResetFn>(() => {});

  const registerReset = useCallback((fn: ResetFn) => {
    resetRef.current = fn;
  }, []);

  const resetChat = useCallback(() => {
    resetRef.current();
  }, []);

  return (
    <ChatContext.Provider value={{ registerReset, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => useContext(ChatContext);
