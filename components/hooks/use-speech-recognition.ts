"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeechRecognition({ onFinalResult }: { onFinalResult?: (text: string) => void } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const transcriptRef = useRef("");
  
  // 🔥 FIX: Use a Ref for the callback to prevent infinite render loops
  const onFinalResultRef = useRef(onFinalResult);
  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false; 
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US"; 

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript("");
        transcriptRef.current = "";
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        // AUTO-SEND logic using the ref
        if (transcriptRef.current.trim() && onFinalResultRef.current) {
          onFinalResultRef.current(transcriptRef.current.trim());
          setTranscript("");
          transcriptRef.current = "";
        }
      };
      
      recognitionInstance.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        
        setTranscript(currentTranscript);
        transcriptRef.current = currentTranscript;
      };

      setRecognition(recognitionInstance);
    }
  // Remove onFinalResult from the dependency array to break the loop!
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasSupport: !!recognition
  };
}
