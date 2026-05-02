(function () {
  const scriptTag = document.currentScript;
  const businessId = scriptTag.getAttribute("data-business-id");
  const API_BASE = "http://localhost:3000";

  if (!businessId) {
    console.error(
      "SupportAI: Missing data-business-id attribute on script tag.",
    );
    return;
  }

  // ── Session ID ────────────────────────────────────────────────
  let sessionId = localStorage.getItem("supportai_session_" + businessId);
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("supportai_session_" + businessId, sessionId);
  }

  // ── Inject styles ─────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #supportai-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
      width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 25px rgba(99,102,241,0.4);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
    }
    #supportai-fab:hover { transform: scale(1.1); box-shadow: 0 15px 35px rgba(99,102,241,0.5); }
    #supportai-fab.open { background: linear-gradient(135deg, #ef4444, #f43f5e); transform: rotate(90deg); }

    #supportai-window {
      position: fixed; bottom: 96px; right: 24px; z-index: 2147483646;
      width: 380px; height: 600px; max-height: calc(100vh - 120px);
      background: rgba(255,255,255,0.95); backdrop-filter: blur(16px);
      border-radius: 24px; border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'Inter', -apple-system, sans-serif;
      opacity: 0; transform: translateY(20px) scale(0.95);
      transition: opacity 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    #supportai-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    #supportai-header {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: white; padding: 20px 24px;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0;
    }
    #supportai-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
    #supportai-header p { margin: 4px 0 0; font-size: 0.82rem; opacity: 0.85; }
    #supportai-close-btn {
      background: rgba(255,255,255,0.2); border: none; color: white;
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background 0.2s;
    }
    #supportai-close-btn:hover { background: rgba(255,255,255,0.35); }

    #supportai-messages {
      flex: 1; overflow-y: auto; padding: 20px; display: flex;
      flex-direction: column; gap: 12px; background: #f8fafc;
    }
    .supportai-msg { display: flex; width: 100%; }
    .supportai-msg.user { justify-content: flex-end; }
    .supportai-msg.assistant { justify-content: flex-start; }
    .supportai-bubble {
      max-width: 78%; padding: 11px 15px; border-radius: 18px;
      font-size: 0.92rem; line-height: 1.5; word-wrap: break-word;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .supportai-msg.user .supportai-bubble {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; border-bottom-right-radius: 4px;
    }
    .supportai-msg.assistant .supportai-bubble {
      background: white; color: #334155;
      border: 1px solid #e2e8f0; border-bottom-left-radius: 4px;
    }
    .supportai-dots span {
      display: inline-block; font-size: 1.3rem; line-height: 0.5;
      animation: sai-blink 1.4s infinite both;
    }
    .supportai-dots span:nth-child(2) { animation-delay: 0.2s; }
    .supportai-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sai-blink { 0%{opacity:0.2} 20%{opacity:1} 100%{opacity:0.2} }

    #supportai-footer {
      padding: 14px 18px; background: white; border-top: 1px solid #e2e8f0; flex-shrink: 0;
    }
    #supportai-input-row {
      display: flex; align-items: center; background: #f1f5f9;
      border-radius: 24px; padding: 6px 6px 6px 16px;
      transition: box-shadow 0.2s;
    }
    #supportai-input-row:focus-within {
      box-shadow: 0 0 0 2px rgba(99,102,241,0.3); background: white;
    }
    #supportai-input {
      flex: 1; border: none; background: transparent; outline: none;
      font-size: 0.92rem; color: #334155;
    }
    #supportai-send {
      background: #6366f1; color: white; border: none;
      width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.1s; flex-shrink: 0;
    }
    #supportai-send:hover:not(:disabled) { background: #4f46e5; transform: scale(1.05); }
    #supportai-send:disabled { background: #cbd5e1; cursor: not-allowed; }

    #supportai-empty {
      text-align: center; color: #94a3b8; margin: auto;
      font-size: 0.9rem; padding: 40px 20px;
    }
  `;
  document.head.appendChild(style);

  // ── FAB ───────────────────────────────────────────────────────
  const fab = document.createElement("button");
  fab.id = "supportai-fab";
  fab.setAttribute("aria-label", "Open support chat");
  fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;

  // ── Chat window ───────────────────────────────────────────────
  const win = document.createElement("div");
  win.id = "supportai-window";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", "AI Support Chat");
  win.innerHTML = `
    <div id="supportai-header">
      <div>
        <h3>AI Support</h3>
        <p>We typically reply in minutes</p>
      </div>
      <button id="supportai-close-btn" aria-label="Close chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div id="supportai-messages">
      <div id="supportai-empty">👋 Hi there! How can we help you today?</div>
    </div>
    <div id="supportai-footer">
      <div id="supportai-input-row">
        <input id="supportai-input" type="text" placeholder="Type a message..." autocomplete="off" />
        <button id="supportai-send" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(win);

  // ── Toggle logic ──────────────────────────────────────────────
  let isOpen = false;
  const toggle = () => {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    fab.classList.toggle("open", isOpen);
    fab.innerHTML = isOpen
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;
    if (isOpen) document.getElementById("supportai-input").focus();
  };

  fab.onclick = toggle;
  document.getElementById("supportai-close-btn").onclick = toggle;

  // ── Message helpers ───────────────────────────────────────────
  const messagesEl = document.getElementById("supportai-messages");
  const emptyEl = document.getElementById("supportai-empty");
  const sendBtn = document.getElementById("supportai-send");
  const inputEl = document.getElementById("supportai-input");

  function addMessage(role, content) {
    if (emptyEl) emptyEl.remove();
    const row = document.createElement("div");
    row.className = `supportai-msg ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "supportai-bubble";
    bubble.textContent = content;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function addTypingIndicator() {
    if (emptyEl) emptyEl.remove();
    const row = document.createElement("div");
    row.className = "supportai-msg assistant";
    const bubble = document.createElement("div");
    bubble.className = "supportai-bubble supportai-dots";
    bubble.innerHTML = "<span>.</span><span>.</span><span>.</span>";
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return row;
  }

  // ── Send message ──────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    sendBtn.disabled = true;

    addMessage("user", text);
    const typingRow = addTypingIndicator();

    try {
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": businessId,
          "X-Session-Id": sessionId,
        },
        body: JSON.stringify({
          message: text,
          tenantId: businessId,
          sessionId,
        }),
      });
      const data = await res.json();
      typingRow.remove();
      const reply =
        data?.assistantMessage?.content ||
        data?.message ||
        "Sorry, something went wrong.";
      addMessage("assistant", reply);
    } catch (err) {
      typingRow.remove();
      addMessage("assistant", "Connection error. Please try again.");
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.onclick = sendMessage;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
