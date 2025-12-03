"use client";

import { useEffect } from "react";
import { Accessibility } from "accessibility";

export default function AccessibilityLoader() {
  useEffect(() => {
    const handle = () => {
      try {
        // @ts-ignore — the types for this package may be missing
        new Accessibility({
          modules: {
            invertColors: true,
            textToSpeech: false,
            increaseText: true,
            decreaseText: true,
            decreaseLineHeight: true,
            decreaseTextSpacing: true,
            disableAnimations: true,
            increaseLineHeight: true,
            increaseTextSpacing: true,
            grayHues: true,
            bigCursor: true,
            readingGuide: true,
            speechToText: true,
            underlineLinks: true,
          },
          textToSpeechLang: "en-US",
          speechToTextLang: "en-US",
        });
      } catch (e) {
        console.warn("Accessibility init failed:", e);
      }
    };

    handle();
  }, []);

  return null;
}
