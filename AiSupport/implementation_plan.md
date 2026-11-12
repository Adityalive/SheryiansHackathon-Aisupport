# Voice AI Agent: Implementation Plan

## Overview
We will build a voice layer on top of the existing chat infrastructure. A customer can call a Twilio phone number, the AI speaks to them using their voice, handles simple queries using your Knowledge Base, and escalates to a human agent with a ticket if needed.

## Architecture: The Full Pipeline

```
Customer speaks → Twilio (phone call)
                    ↓ (raw audio, 8kHz μ-law)
              WebSocket Server (Backend)
                    ↓
              Groq Whisper API (Speech-to-Text = typed text)
                    ↓
              Your existing chatGraph.service.js (AI brain)
                    ↓
              Groq LLM answers with text
                    ↓
              ElevenLabs / Twilio TTS (text → natural voice audio)
                    ↓
              Audio streamed back to Twilio → Customer hears AI voice
```

---

## Required APIs & Accounts

### Must Have (Free Tier Available):
| Service | Purpose | Cost |
|---|---|---|
| **Twilio** | Phone number, call routing | ~$1.15/month for a number |
| **Groq Whisper** | Speech-to-Text (transcribes voice → text) | Free tier included |
| **Twilio TTS (Say verb)** | Basic AI voice out | Free (built-in) |

### Optional (Much Better Voice Quality):
| Service | Purpose | Cost |
|---|---|---|
| **ElevenLabs** | Natural human-sounding voice | Free tier: 10k chars/month |
| **Deepgram** | Faster STT with streaming | Free tier: 200hr/month |

> [!IMPORTANT]
> **To start quickly and cheaply:** We will use Groq Whisper for STT (free) and Twilio's built-in TTS (`<Say>` verb) for AI speech. We can upgrade to ElevenLabs later for human-sounding voice.

---

## New Environment Variables Needed

Add these to `Backend/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
ELEVENLABS_API_KEY=xxxxxxxx  # Optional, for premium voice
```

---

## Open Questions

> [!IMPORTANT]
> **Q1: Do you have a Twilio account?** We need a real phone number (~$1.15/month). If not, you can test entirely with the web voice widget (browser microphone) without any paid service.
>
> **Q2: Voice quality preference?**
> - **Option A (Fast & Free):** Use Twilio's built-in robot voice. Works immediately, no extra accounts.
> - **Option B (Natural & Premium):** Use ElevenLabs. Requires creating a free account and getting an API key.
>
> **Q3: Web widget OR phone call?**
> The web widget (browser mic) is easier to build first and requires NO Twilio phone number. We can add phone calls later. Which do you want first?

---

## Proposed Changes (Phase 1: Web Voice Widget)

This phase adds a voice button to your existing chat widget. The customer clicks it, speaks, and the AI responds in voice — all in the browser. No Twilio phone number needed.

### Backend

#### [NEW] `src/routes/voice.routes.js`
- `POST /api/voice/transcribe` — Receives audio blob, sends to Groq Whisper, returns text.
- `POST /api/voice/speak` — Receives AI text, converts to audio using TTS, returns audio file.

#### [NEW] `src/services/stt.service.js`
- Uses Groq's Whisper API to transcribe uploaded audio.

#### [NEW] `src/services/tts.service.js`
- **Phase 1:** Uses ElevenLabs (or browser's Web Speech API).
- **Phase 2:** Can be swapped to a full Twilio Media Stream approach.

### Frontend

#### [MODIFY] `SupportWidget.jsx`
- Add a microphone button next to the text input.
- On hold: records audio via `MediaRecorder`.
- On release: sends to `/api/voice/transcribe`, gets text back.
- Passes that text through the normal `sendMessage()` flow.
- Plays the AI response audio back automatically.

---

## Proposed Changes (Phase 2: Twilio Phone Calls)

This phase connects real phone calls to the AI using Twilio Media Streams and WebSockets.

### Backend

#### [NEW] `src/routes/twilio.routes.js`
- `POST /api/twilio/incoming-call` — Twilio webhook, returns TwiML to open a WebSocket stream.
- WebSocket handler at `wss://your-server/api/twilio/stream` — Receives raw audio.

#### [NEW] `src/services/twilioVoice.service.js`
- Orchestrates the full pipeline: audio in → STT → chatGraph → TTS → audio out.
- Detects escalation keywords ("speak to agent", "manager", "refund").

#### [NEW] `src/models/TicketModel.js`
- Stores escalated tickets with conversation ID, priority, transcript.

#### [MODIFY] `Dashboard.jsx`
- Add **Tickets** tab showing escalated calls with transcript, customer phone, priority.

---

## Verification Plan
1. **Phase 1:** Click the mic button in the widget, say a question aloud, verify it appears as text and the AI speaks the response back.
2. **Phase 2:** Call the Twilio number, verify the AI answers and responds using voice.
3. **Escalation:** Say "I want to speak to a manager" and verify a ticket appears in the dashboard.

---

## Recommended Starting Point
Start with **Phase 1 (Web Voice Widget)** — it's free, fast to build (1-2 hours), and lets you validate the voice experience before spending money on a Twilio phone number.
