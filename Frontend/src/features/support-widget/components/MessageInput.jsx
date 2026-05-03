import React, { useState, useRef, useCallback } from 'react';
import { Send, Mic, MicOff, Loader } from 'lucide-react';
import { useSupportStore } from '../store/useSupportStore';
import axios from 'axios';
import { getSupportWidgetApiBase } from '../config';

const API_BASE = getSupportWidgetApiBase();

const MessageInput = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Granular selectors — only re-render when these specific values change
  const sendMessage = useSupportStore((s) => s.sendMessage);
  const isLoading = useSupportStore((s) => s.isLoading);
  const isVoiceMode = useSupportStore((s) => s.isVoiceMode);
  const toggleVoiceMode = useSupportStore((s) => s.toggleVoiceMode);

  // ── Handle text submit ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      const msgText = text;
      setText('');
      const reply = await sendMessage(msgText);
      if (isVoiceMode && reply?.content) speakText(reply.content);
    }
  };

  // ── Browser TTS ─────────────────────────────────────
  const speakText = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang === 'en-US' && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    );
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }, []);

  // ── Start microphone recording ───────────────────────
  const startRecording = async () => {
    if (isLoading || isTranscribing) return;
    try {
      if (!window.isSecureContext) {
        alert('Microphone access requires HTTPS or localhost.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size < 1000) return;

        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');
          const { data } = await axios.post(`${API_BASE}/voice/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const transcript = data?.transcript?.trim();
          if (transcript) {
            setText(transcript);
            const reply = await sendMessage(transcript);
            if (reply?.content) speakText(reply.content);
          }
        } catch (err) {
          console.error('Transcription failed:', err.message);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      setIsRecording(true);

      if (!isVoiceMode) {
        speakText("Hey! I'm listening. How can I help you today?");
        toggleVoiceMode(true);
      }
    } catch (err) {
      console.error('Microphone access denied:', err.message);
      alert('Please allow microphone access to use voice input.');
    }
  };

  // ── Stop recording ───────────────────────────────────
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => (isRecording ? stopRecording() : startRecording());

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
