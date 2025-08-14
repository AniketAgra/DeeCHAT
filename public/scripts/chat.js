// Basic client-side chat logic (placeholder for future real-time integration)
// Mobile-first considerations: minimal DOM writes, smooth scroll.

(function() {
  const messagesEl = document.querySelector('.messages');
  const form = document.querySelector('#composer-form');
  const textarea = document.querySelector('#message-input');
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');
  const convoList = document.querySelector('[data-conversation-list]');
  const newChatBtn = document.querySelector('[data-new-chat]');
  const clearAllBtn = document.querySelector('[data-clear-all]');
  // Theme toggle creation (optional UI) if not present
  let toggleBtn = document.querySelector('[data-theme-toggle]');
  if(!toggleBtn) {
    const header = document.querySelector('.chat-header');
    if(header) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.textContent = '🌓';
      toggleBtn.setAttribute('aria-label','Toggle theme');
      toggleBtn.style.marginLeft = 'auto';
      toggleBtn.style.background = 'transparent';
      toggleBtn.style.border = '1px solid var(--color-border)';
      toggleBtn.style.color = 'var(--color-text)';
      toggleBtn.style.padding = '4px 10px';
      toggleBtn.style.borderRadius = 'var(--radius-md)';
      toggleBtn.style.cursor = 'pointer';
      toggleBtn.style.fontSize = '0.9rem';
      toggleBtn.dataset.themeToggle = 'true';
      header.appendChild(toggleBtn);
    }
  }

  const root = document.documentElement;
  function currentExplicitTheme() {
    if(root.classList.contains('theme-light')) return 'light';
    if(root.classList.contains('theme-dark')) return 'dark';
    return null;
  }
  function applyTheme(next) {
    root.classList.remove('theme-light','theme-dark');
    if(next) root.classList.add(next === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('dee_chat_theme', next || '');
  }
  // Initialize from storage or system preference
  const stored = localStorage.getItem('dee_chat_theme');
  if(stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  }
  toggleBtn?.addEventListener('click', () => {
    const cur = currentExplicitTheme();
    if(!cur) {
      // Determine system to flip to opposite
      const preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(preferLight ? 'dark' : 'light');
    } else if(cur === 'light') {
      applyTheme('dark');
    } else if(cur === 'dark') {
      applyTheme('light');
    }
  });

  if(!form || !textarea || !messagesEl) return;

  // Conversation state (in-memory placeholder)
  const conversations = new Map(); // id -> { messages: [] }
  let activeConvo = 'default';
  conversations.set('default', { title: 'New Chat', messages: [] });

  function switchConversation(id) {
    if(!conversations.has(id)) return;
    activeConvo = id;
    // Update active class
    convoList.querySelectorAll('.conversation-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.convoId === id);
      btn.setAttribute('aria-current', btn.dataset.convoId === id ? 'true' : 'false');
    });
    // Render messages
    messagesEl.innerHTML = '';
    const data = conversations.get(id);
    if(!data.messages.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No messages yet. Start the conversation!';
      messagesEl.appendChild(empty);
    } else {
      data.messages.forEach(m => appendMessage(m));
    }
    // Auto-close sidebar on mobile after selecting conversation
    if(window.innerWidth < 960 && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
    }
  }

  function createConversation() {
    const id = 'c_' + Date.now().toString(36);
    conversations.set(id, { title: 'Chat ' + (conversations.size), messages: [] });
    const btn = document.createElement('button');
    btn.className = 'conversation-item';
    btn.dataset.convoId = id;
    btn.innerHTML = `<span class="title"></span>`;
    btn.querySelector('.title').textContent = conversations.get(id).title;
    btn.addEventListener('click', () => switchConversation(id));
    convoList.prepend(btn);
    switchConversation(id);
  }

  function clearAllConversations() {
    conversations.clear();
    conversations.set('default', { title: 'New Chat', messages: [] });
    convoList.innerHTML = '';
    const baseBtn = document.createElement('button');
    baseBtn.className = 'conversation-item active';
    baseBtn.dataset.convoId = 'default';
    baseBtn.setAttribute('aria-current','true');
    baseBtn.innerHTML = '<span class="title">New Chat</span>';
    baseBtn.addEventListener('click', () => switchConversation('default'));
    convoList.appendChild(baseBtn);
    switchConversation('default');
  }

  newChatBtn?.addEventListener('click', createConversation);
  clearAllBtn?.addEventListener('click', clearAllConversations);

  sidebarToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  // Close sidebar when tapping backdrop on mobile
  document.addEventListener('click', (e) => {
    if(document.body.classList.contains('sidebar-open') && e.target === document.body) {
      document.body.classList.remove('sidebar-open');
    }
  });

  function appendMessage({ text, outbound=false }) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'msg' + (outbound ? ' out' : '');
    div.innerHTML = `<div class="body"></div><div class="meta">${outbound ? 'You' : 'Bot'} • ${time}</div>`;
    div.querySelector('.body').textContent = text;
    messagesEl.appendChild(div);
    // Persist into active conversation
    const convo = conversations.get(activeConvo);
    if(convo) {
      convo.messages.push({ text, outbound });
      // Update conversation title if first user msg
      if(convo.messages.length === 1) {
        const preview = text.slice(0, 30) + (text.length > 30 ? '…' : '');
        convo.title = preview || 'Conversation';
        const btn = convoList.querySelector(`[data-convo-id="${activeConvo}"] .title`);
        if(btn) btn.textContent = convo.title;
      }
    }
    // Remove empty-state if present
    const empty = messagesEl.querySelector('.empty-state');
    if (empty) empty.remove();
    // Scroll to bottom efficiently
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  function autoGrow() {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }

  textarea.addEventListener('input', autoGrow);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = textarea.value.trim();
    if(!value) return;
    appendMessage({ text: value, outbound: true });
    textarea.value = '';
    autoGrow();

    // Simulate a reply (placeholder)
    setTimeout(() => {
      appendMessage({ text: 'Echo: ' + value, outbound: false });
    }, 600);
  });

  // Optional: send on Enter (without shift) for convenience
  textarea.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  });

  // Initialize with an empty state
  if(!messagesEl.children.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No messages yet. Start the conversation!';
    messagesEl.appendChild(empty);
  }

  // Ensure initial default conversation state is set
  switchConversation(activeConvo);
})();
