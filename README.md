<div align="center">

# 🧠 SupportAI

### **The AI-Powered Customer Support Platform That Never Sleeps**

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00C853?style=for-the-badge&logo=render&logoColor=white)](https://sheryianshackathon-aisupport.onrender.com/)
[![Docs](https://img.shields.io/badge/Docs-Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/AI-Customer-Support-350201c8711b80b494e2d4bc1b6ff08f)

<br/>

> **Turn every customer interaction into a resolution.** <br/>
> SupportAI is a full-stack, multi-tenant AI support platform with chat, voice, knowledge base, and real-time analytics — deployed as a single service.

<br/>

[🚀 Live Demo](https://sheryianshackathon-aisupport.onrender.com/) · [📖 Documentation](https://www.notion.so/AI-Customer-Support-350201c8711b80b494e2d4bc1b6ff08f) · [🔧 Setup](#-installation) · [📦 Deploy](#-deployment)

---

</div>

<br/>

## ✨ Why SupportAI?

Most support tools are **expensive**, **rigid**, and **dumb**. SupportAI is none of those.

| Problem | SupportAI Solution |
|---|---|
| Customers wait hours for a reply | 🤖 **AI responds instantly** using your knowledge base |
| Support agents burn out on repetitive queries | 📚 **Knowledge Base RAG** handles 80%+ of questions automatically |
| No visibility into support quality | 📊 **Real-time analytics dashboard** with resolution tracking |
| Expensive per-seat pricing | 💰 **Self-hosted, open-source** — you own everything |
| Voice support is an afterthought | 🎙️ **Built-in Voice AI** with Speech-to-Text transcription |
| Hard to integrate | 🧩 **One script tag** to embed anywhere |

<br/>

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 💬 AI Chat Engine
- Multi-turn conversations with context memory
- RAG-powered responses from your knowledge base
- Automatic intent detection & routing
- Session persistence across page reloads
- Powered by **Google Gemini** + **Groq LLaMA**

</td>
<td width="50%">

### 🎙️ Voice AI
- Hold-to-speak voice input on the widget
- Real-time Speech-to-Text via **Groq Whisper**
- Twilio phone call integration
- Automatic voice-to-chat pipeline
- TTS responses for phone callers

</td>
</tr>
<tr>
<td width="50%">

### 📚 Knowledge Base
- Upload **PDF, CSV, or text** documents
- Automatic chunking & vectorization
- Semantic search with relevance scoring
- CRUD management from the dashboard
- Seed with sample data in one click

</td>
<td width="50%">

### 📊 Analytics Dashboard
- Live conversation & resolution metrics
- Channel distribution breakdown (Chat vs Voice)
- AI response rate tracking
- Trend visualization with **Recharts**
- Mobile-responsive, glassmorphism UI

</td>
</tr>
<tr>
<td width="50%">

### 🎫 Ticket Management
- Manual ticket creation from widget & dashboard
- Priority-based escalation workflow
- Status tracking (Open → Resolved → Deleted)
- Customer email & contact capture
- Filterable ticket overview panel

</td>
<td width="50%">

### 🧩 Embeddable Widget
- **One `<script>` tag** — works on any website
- Chat, Voice, and Ticket creation in one widget
- Auto-detects backend URL dynamically
- Premium glassmorphism design
- Zero dependencies, zero config

</td>
</tr>
</table>

<br/>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │   Home   │ │  Login   │ │  Signup  │ │   Dashboard   │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────┬───────┘   │
│                                                  │           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────┴───────┐   │
│  │ Overview │ │  Tickets │ │  Voice   │ │ Knowledge Base│   │
│  │   Tab    │ │   Tab    │ │   Tab    │ │     Tab       │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────────────┐   │
│  │  Widget  │ │  Convos  │ │       Profile Tab           │   │
│  │   Tab    │ │   Tab    │ │                              │   │
│  └──────────┘ └──────────┘ └────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST API
┌───────────────────────────▼──────────────────────────────────┐
│                     BACKEND (Express.js)                      │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐    │
│  │  Auth   │  │  Chat   │  │  Voice  │  │  Analytics   │    │
│  │ Routes  │  │ Routes  │  │ Routes  │  │   Routes     │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬───────┘    │
│       │            │            │               │            │
│  ┌────▼────────────▼────────────▼───────────────▼────────┐   │
│  │                    SERVICE LAYER                       │   │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Gemini AI │ │ Groq LLM │ │  Whisper │            │   │
│  │  │  Service   │ │ Service  │ │  STT     │            │   │
│  │  └────────────┘ └──────────┘ └──────────┘            │   │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ Knowledge  │ │  Ticket  │ │  Twilio  │            │   │
│  │  │ Base (RAG) │ │ Service  │ │  TTS     │            │   │
│  │  └────────────┘ └──────────┘ └──────────┘            │   │
│  └───────────────────────────────────────────────────────┘   │
│                            │                                  │
│  ┌─────────────────────────▼─────────────────────────────┐   │
│  │                  MongoDB Atlas                         │   │
│  │  Users │ Tenants │ Conversations │ Messages │ Tickets  │   │
│  └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Zustand, Recharts, Framer Motion |
| **Backend** | Node.js, Express 5, Mongoose ODM |
| **AI / LLM** | Google Gemini 2.0, Groq LLaMA 3.1, Groq Whisper v3 |
| **Database** | MongoDB Atlas |
| **Voice** | Twilio (phone calls), Web MediaRecorder API |
| **Auth** | JWT + bcrypt |
| **Deployment** | Render (single service) |

<br/>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** Atlas URI (or local MongoDB)
- **API Keys**: Google Gemini, Groq

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SupportAI.git
cd SupportAI

# Install all dependencies (frontend + backend)
npm run build
```

### Environment Variables

Create `Backend/.env`:

```env
# Database
MONGODB_URI=mongodb+srv://your-connection-string

# Authentication
JWT_SECRET=your-super-secret-key

# AI Models
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

# Voice (Optional — for phone call support)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Run Locally

```bash
# Start the server (serves both API + frontend)
npm start

# Or for development with hot reload
cd Backend && npm run dev
```

Visit **`http://localhost:3000`** 🎉

<br/>

---

## 📦 Deployment

### Deploy to Render (Recommended)

SupportAI is designed for **single-service deployment** — one build command, one start command.

| Setting | Value |
|---|---|
| **Root Directory** | `.` (root) |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Environment** | Node |

> Add all environment variables from `.env` to Render's dashboard.

The build script automatically:
1. Installs frontend dependencies
2. Builds the React app to `Frontend/dist`
3. Installs backend dependencies
4. Express serves the static build + API from a single port

<br/>

---

## 🧩 Embed the Widget

Drop **one line** into any website to get a full AI support chat with voice and ticket creation:

```html
<script
  src="https://your-deployed-url.com/public/widget.js"
  data-business-id="your-tenant-id"
></script>
```

That's it. No React, no npm, no build step. It just works. ✨

### Widget Features
- 💬 Full AI chat powered by your knowledge base
- 🎙️ Hold-to-speak voice input with real-time transcription
- 🎫 Integrated ticket submission form
- 🎨 Premium glassmorphism design
- 📱 Fully responsive on mobile

<br/>

---

## 📁 Project Structure

```
SupportAI/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── OverviewTab.jsx      # Analytics & metrics
│   │   │   │   ├── ConversationsTab.jsx  # Chat history viewer
│   │   │   │   ├── KnowledgeBaseTab.jsx  # Document management
│   │   │   │   ├── TicketsTab.jsx        # Ticket management
│   │   │   │   ├── VoiceTab.jsx          # Voice AI config
│   │   │   │   ├── WidgetTab.jsx         # Embed code generator
│   │   │   │   └── ProfileTab.jsx        # Business settings
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Login.jsx         # Auth - login
│   │   │   └── Signup.jsx        # Auth - register
│   │   ├── store/                # Zustand state management
│   │   ├── services/             # API client layer
│   │   └── features/             # Feature modules
│   └── dist/                     # Production build output
│
├── Backend/
│   ├── server.js                 # Entry point
│   ├── src/
│   │   ├── app.js                # Express app config
│   │   ├── config/               # Database connection
│   │   ├── controllers/          # Request handlers
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── UserModel.js
│   │   │   ├── TenantModel.js
│   │   │   ├── ConversationModel.js
│   │   │   ├── MessageModel.js
│   │   │   ├── KnowledgeBaseModel.js
│   │   │   └── TicketModel.js
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business logic
│   │   │   ├── chatGraph.service.js     # AI conversation engine
│   │   │   ├── knowledgeBase.service.js # RAG pipeline
│   │   │   ├── gemini.service.js        # Google Gemini integration
│   │   │   ├── groq.service.js          # Groq LLM integration
│   │   │   ├── stt.service.js           # Speech-to-Text
│   │   │   ├── tts.service.js           # Text-to-Speech (Twilio)
│   │   │   ├── ticket.service.js        # Escalation management
│   │   │   └── analytics.service.js     # Data aggregation
│   │   └── middleware/           # Auth & validation
│   └── public/
│       └── widget.js             # Embeddable chat widget
│
└── package.json                  # Root orchestration scripts
```

<br/>

---

## 🔑 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Sign in & receive JWT |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat/message` | Send a message to the AI |
| `GET` | `/api/chat/conversations/:id` | Retrieve a conversation |
| `GET` | `/api/chat/tenants/:id/conversations` | List all conversations |
| `DELETE` | `/api/chat/tenants/:id/conversations/:id` | Delete a conversation |

### Knowledge Base
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/tenants/:id/knowledge-base` | List knowledge items |
| `POST` | `/api/chat/tenants/:id/knowledge-base` | Add knowledge item |
| `DELETE` | `/api/chat/tenants/:id/knowledge-base/:id` | Remove knowledge item |
| `POST` | `/api/chat/tenants/:id/knowledge-base/seed` | Seed with sample data |

### Voice & Tickets
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/voice/transcribe` | Transcribe audio to text |
| `POST` | `/api/voice/tickets` | Create a support ticket |
| `GET` | `/api/voice/tenants/:id/tickets` | List tickets |
| `PATCH` | `/api/voice/tickets/:id` | Resolve a ticket |
| `DELETE` | `/api/voice/tickets/:id` | Delete a resolved ticket |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/tenants/:id/overview` | Dashboard metrics |

<br/>

---

## 🤝 Contributing

Contributions are what make open-source incredible. Any contribution you make is **genuinely appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<br/>

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

---

<div align="center">

### Built with ❤️ and way too much caffeine

**⭐ Star this repo if SupportAI helped you!**

<br/>

[Report Bug](https://github.com/yourusername/SupportAI/issues) · [Request Feature](https://github.com/yourusername/SupportAI/issues)

</div>
