(function () {
  const scriptTag = document.currentScript;
  const businessId = scriptTag.getAttribute("data-business-id");
  const scriptSrc = scriptTag.src;
  const API_BASE = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));

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
      color: white; padding: 18px 20px;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0;
    }
    #supportai-header-left h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
    #supportai-header-left p { margin: 4px 0 0; font-size: 0.82rem; opacity: 0.85; }
    #supportai-header-right { display: flex; gap: 8px; }
    .supportai-icon-btn {
      background: rgba(255,255,255,0.2); border: none; color: white;
      width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: background 0.2s;
    }
    .supportai-icon-btn:hover { background: rgba(255,255,255,0.35); }

    #supportai-content { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; }

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
      border-radius: 24px; padding: 6px 6px 6px 16px; gap: 8px;
    }
    #supportai-input {
      flex: 1; border: none; background: transparent; outline: none;
      font-size: 0.92rem; color: #334155; min-width: 0;
    }
    .supportai-action-btn {
      background: #6366f1; color: white; border: none;
      width: 36px; height: 36px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.1s; flex-shrink: 0;
    }
    .supportai-action-btn:hover:not(:disabled) { background: #4f46e5; transform: scale(1.05); }
    .supportai-action-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
    
    #supportai-mic-btn { background: #94a3b8; }
    #supportai-mic-btn.recording { 
      background: #ef4444; 
      animation: sai-pulse 1.5s infinite;
    }
    @keyframes sai-pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    #supportai-ticket-overlay {
      position: absolute; inset: 0; background: #ffffff; z-index: 20;
      display: flex; flex-direction: column; transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
    }
    #supportai-ticket-overlay.open { transform: translateY(0); }
    #supportai-ticket-header { 
      padding: 30px 24px 20px; 
      background: linear-gradient(to bottom, #f8fafc, #ffffff);
      border-bottom: 1px solid #f1f5f9;
    }
    #supportai-ticket-header h4 { 
      margin: 0; font-size: 1.4rem; font-weight: 800; color: #0f172a; 
      letter-spacing: -0.02em;
    }
    #supportai-ticket-header p { 
      margin: 10px 0 0; font-size: 0.88rem; color: #64748b; line-height: 1.5;
    }
    #supportai-ticket-form { 
      padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 20px; 
      overflow-y: auto;
    }
    .supportai-field { display: flex; flex-direction: column; gap: 8px; }
    .supportai-field label { 
      font-size: 0.7rem; font-weight: 700; color: #94a3b8; 
      text-transform: uppercase; letter-spacing: 0.05em; padding-left: 4px;
    }
    .supportai-field input, .supportai-field textarea {
      padding: 12px 16px; border-radius: 14px; border: 1px solid #e2e8f0;
      font-size: 0.95rem; color: #334155; outline: none; transition: all 0.2s ease;
      background: #f8fafc;
    }
    .supportai-field input:focus, .supportai-field textarea:focus { 
      border-color: #6366f1; background: #ffffff;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    }
    #supportai-ticket-submit {
      margin-top: 10px; background: linear-gradient(135deg, #6366f1, #4f46e5); 
      color: white; border: none; padding: 14px; border-radius: 16px; 
      font-weight: 700; font-size: 1rem; cursor: pointer;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
      transition: all 0.3s ease;
    }
    #supportai-ticket-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }
    #supportai-ticket-submit:active { transform: translateY(0); }
    #supportai-ticket-cancel {
      background: transparent; border: none; color: #94a3b8; 
      font-size: 0.9rem; font-weight: 600; cursor: pointer;
      padding: 8px; border-radius: 8px; transition: all 0.2s;
    }
    #supportai-ticket-cancel:hover { color: #64748b; background: #f1f5f9; }
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
      <div id="supportai-header-left">
        <h3>AI Support</h3>
        <p>We typically reply in minutes</p>
      </div>
      <div id="supportai-header-right">
        <button id="supportai-ticket-btn" class="supportai-icon-btn" title="Create support ticket">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.6.8L12 7l2.5-3.2a2 2 0 0 1 1.6-.8H20a2 2 0 0 1 2 2v4"/><path d="M2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"/><path d="M12 13v8"/></svg>
        </button>
        <button id="supportai-close-btn" class="supportai-icon-btn" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
    <div id="supportai-content">
      <div id="supportai-messages">
        <div id="supportai-empty">👋 Hi there! How can we help you today?</div>
      </div>
      <div id="supportai-footer">
        <div id="supportai-input-row">
          <input id="supportai-input" type="text" placeholder="Type or hold mic..." autocomplete="off" />
          <button id="supportai-mic-btn" class="supportai-action-btn" title="Hold to speak">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
          <button id="supportai-send" class="supportai-action-btn" aria-label="Send">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
      
      <!-- Ticket Overlay -->
      <div id="supportai-ticket-overlay">
        <div id="supportai-ticket-header">
          <h4>Create Support Ticket</h4>
          <p>Leave your details and we'll get back to you via email.</p>
        </div>
        <div id="supportai-ticket-form">
          <div class="supportai-field">
            <label>Name</label>
            <input type="text" id="sai-ticket-name" placeholder="Your Name" />
          </div>
          <div class="supportai-field">
            <label>Email Address</label>
            <input type="email" id="sai-ticket-email" placeholder="email@example.com" />
          </div>
          <div class="supportai-field">
            <label>How can we help?</label>
            <textarea id="sai-ticket-reason" rows="3" placeholder="Describe your issue..."></textarea>
          </div>
          <button id="supportai-ticket-submit">Send Request</button>
          <button id="supportai-ticket-cancel">Back to chat</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(win);

  // ── Elements ──────────────────────────────────────────────────
  const ticketBtn = document.getElementById("supportai-ticket-btn");
  const ticketOverlay = document.getElementById("supportai-ticket-overlay");
  const ticketCancel = document.getElementById("supportai-ticket-cancel");
  const ticketSubmit = document.getElementById("supportai-ticket-submit");
  const micBtn = document.getElementById("supportai-mic-btn");
  const messagesEl = document.getElementById("supportai-messages");
  const emptyEl = document.getElementById("supportai-empty");
  const sendBtn = document.getElementById("supportai-send");
  const inputEl = document.getElementById("supportai-input");

  // ── Toggle logic ──────────────────────────────────────────────
  let isOpen = false;
  const toggle = () => {
    isOpen = !isOpen;
    win.classList.toggle("open", isOpen);
    fab.classList.toggle("open", isOpen);
    if (!isOpen) ticketOverlay.classList.remove("open");
    if (isOpen) {
      inputEl.focus();
      // Pre-request mic permission to avoid delay on first use
      navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())).catch(() => {});
    }
  };

  fab.onclick = toggle;
  document.getElementById("supportai-close-btn").onclick = toggle;
  ticketBtn.onclick = () => ticketOverlay.classList.add("open");
  ticketCancel.onclick = () => ticketOverlay.classList.remove("open");

  // ── Message helpers ───────────────────────────────────────────
  function addMessage(role, content) {
    if (emptyEl && emptyEl.parentNode) emptyEl.remove();
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
    if (emptyEl && emptyEl.parentNode) emptyEl.remove();
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

  // ── Audio Recording Logic ──────────────────────────────────────
  let mediaRecorder = null;
  let audioChunks = [];

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
      mediaRecorder.onstop = sendAudio;
      mediaRecorder.start();
      micBtn.classList.add("recording");
    } catch (err) {
      console.error("Mic Error:", err);
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(t => t.stop());
    }
    micBtn.classList.remove("recording");
  }

  async function sendAudio() {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    if (audioBlob.size < 500) return;

    const typingRow = addTypingIndicator();
    const formData = new FormData();
    // Providing a filename is important for some server-side parsers
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch(`${API_BASE}/api/voice/transcribe`, {
        method: "POST",
        headers: { "X-Tenant-Id": businessId },
        body: formData,
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Transcription failed");
      }

      const data = await res.json();
      typingRow.remove();
      
      const text = data.transcript || data.text;
      if (text) {
        addMessage("user", text);
        processChatMessage(text);
      }
    } catch (err) {
      console.error("SupportAI Voice Error:", err);
      typingRow.remove();
      addMessage("assistant", "Sorry, I couldn't hear that clearly. Could you try again?");
    }
  }

  micBtn.onmousedown = micBtn.ontouchstart = (e) => {
    e.preventDefault();
    startRecording();
  };
  window.onmouseup = window.ontouchend = stopRecording;

  // ── Send message ──────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    addMessage("user", text);
    await processChatMessage(text);
  }

  async function processChatMessage(text) {
    sendBtn.disabled = true;
    const typingRow = addTypingIndicator();
    try {
      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Tenant-Id": businessId },
        body: JSON.stringify({ message: text, tenantId: businessId, sessionId }),
      });
      const data = await res.json();
      typingRow.remove();
      addMessage("assistant", data?.assistantMessage?.content || "Sorry, something went wrong.");
    } catch (err) {
      typingRow.remove();
      addMessage("assistant", "Connection error.");
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  // ── Ticket Submit ──────────────────────────────────────────────
  ticketSubmit.onclick = async () => {
    const name = document.getElementById("sai-ticket-name").value;
    const email = document.getElementById("sai-ticket-email").value;
    const reason = document.getElementById("sai-ticket-reason").value;

    if (!name || !email || !reason) return alert("Please fill all fields");
    ticketSubmit.disabled = true;
    ticketSubmit.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: businessId,
          customerName: name,
          customerEmail: email,
          escalationReason: reason,
          channel: 'web-widget'
        }),
      });
      if (res.ok) {
        alert("Ticket created! Our team will contact you soon.");
        ticketOverlay.classList.remove("open");
      } else {
        alert("Failed to create ticket. Please try again.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      ticketSubmit.disabled = false;
      ticketSubmit.textContent = "Send Request";
    }
  };

  sendBtn.onclick = sendMessage;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
