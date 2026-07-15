"use client";

import * as React from "react";

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = React.useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = React.useCallback(
    (text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  return { speak, speaking, supported };
}
