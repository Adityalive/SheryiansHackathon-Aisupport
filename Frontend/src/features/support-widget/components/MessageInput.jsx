import React, { useState, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Loader } from 'lucide-react';
import { useSupport } from '../hooks/useSupport';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { sendMessage, isLoading, tenantId, isVoiceMode, toggleVoiceMode } = useSupport();

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // ── Handle text submit ──────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      const msgText = text;
      setText('');
      const reply = await sendMessage(msgText);
      if (isVoiceMode && reply?.content) {
        speakText(reply.content);
      }
    }
  };

  // ── Speak AI response using browser TTS ──
  const speakText = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // stop any previous speech
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    // Prefer a natural English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    );
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }, []);

  // ── Start recording microphone ──────────
  const startRecording = async () => {
    if (isLoading || isTranscribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks to release the microphone
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 1000) return; // Too small, probably silence

        setIsTranscribing(true);
        try {
          // Send audio to backend → Groq Whisper → get text
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');

          const { data } = await axios.post(`${API_BASE}/voice/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const transcript = data?.transcript?.trim();
          if (transcript) {
            setText(transcript);
            // Auto-send and auto-speak reply
            const reply = await sendMessage(transcript);
            if (reply?.content) {
              speakText(reply.content);
            }
          }
        } catch (err) {
          console.error('Transcription failed:', err.message);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);

      // Speak greeting only if it's the first time activating voice mode
      if (!isVoiceMode) {
        speakText("Hey! I'm listening. How can I help you today?");
        toggleVoiceMode(true);
      }
    } catch (err) {
      console.error('Microphone access denied:', err.message);
      alert('Please allow microphone access to use voice input.');
    }
  };

  // ── Stop recording ──────────────────────
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isBusy = isLoading || isTranscribing;

  return (
    <form className="support-message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={isTranscribing ? 'Transcribing...' : isRecording ? 'Listening...' : text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or hold mic to speak..."
        disabled={isBusy || isRecording}
      />

      {/* Mic Button */}
      <button
        type="button"
        onClick={handleMicClick}
        disabled={isBusy && !isRecording}
        className={`mic-btn ${isRecording ? 'recording' : ''}`}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isTranscribing ? (
          <Loader size={18} className="spin" />
        ) : isRecording ? (
          <MicOff size={18} />
        ) : (
          <Mic size={18} />
        )}
      </button>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!text.trim() || isBusy}
        className="send-btn"
        title="Send message"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default MessageInput;
