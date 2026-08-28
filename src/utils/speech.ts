/**
 * Web Speech API helper for pronouncing English vocabulary words on the smart board.
 */
export function speakWord(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clear classroom pronunciation
    utterance.pitch = 1.0;
    
    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || true));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech failure gracefully
  }
}
