// Triad Chat — Simple local chat for KiloClaw, Hermes, and Kleber
// Messages persist in localStorage

const STORAGE_KEY = 'triad-chat-messages';

const messagesEl = document.getElementById('messages');
const senderInput = document.getElementById('sender');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');

// Predefined senders
const PREDEFINED_SENDERS = ['Kleber', 'KiloClaw', 'Hermes'];

// Load messages from localStorage
function loadMessages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// Save messages to localStorage
function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Render all messages
function renderMessages() {
  const messages = loadMessages();
  messagesEl.innerHTML = '';

  messages.forEach(msg => {
    const el = document.createElement('div');
    el.className = 'message';
    el.dataset.sender = msg.sender;

    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    el.innerHTML = `
      <span class="sender">${escapeHtml(msg.sender)}</span>
      <div class="text">${escapeHtml(msg.text)}</div>
      <div class="time">${time}</div>
    `;

    messagesEl.appendChild(el);
  });

  // Scroll to bottom
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Send a message
function sendMessage() {
  const sender = senderInput.value.trim() || 'Anonymous';
  const text = messageInput.value.trim();

  if (!text) return;

  const msg = {
    sender,
    text,
    timestamp: Date.now()
  };

  const messages = loadMessages();
  messages.push(msg);
  saveMessages(messages);

  messageInput.value = '';
  renderMessages();
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Auto-complete sender field with predefined names
senderInput.addEventListener('focus', () => {
  if (!PREDEFINED_SENDERS.includes(senderInput.value)) {
    senderInput.value = 'Kleber';
  }
});

// Initial render
renderMessages();

// Periodic refresh (to sync if multiple tabs open)
setInterval(renderMessages, 2000);
