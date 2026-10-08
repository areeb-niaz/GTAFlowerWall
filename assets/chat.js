/* ──────────────────────────────────────────────────────────
   n8n chat widget, shared by every page.

   Loaded as a module at the end of each page's <head>. It adds
   the widget's own stylesheet, then mounts the chat bubble. The
   theme lives in site.css under "chat widget", scoped to
   #n8n-chat so it wins over the widget's defaults whatever
   order the two stylesheets load in.
────────────────────────────────────────────────────────── */
import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat@1.29.1/dist/chat.bundle.es.js';

var css = document.createElement('link');
css.rel = 'stylesheet';
css.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat@1.29.1/dist/style.css';
document.head.appendChild(css);

createChat({
  webhookUrl: 'https://primary-production-4bb5.up.railway.app/webhook/6e61e864-4368-4b0d-8818-5d249b20d737/chat',
  initialMessages: [
    'Hi, thanks for visiting GTA Flower Wall. Ask me about prices, delivery to your city, or whether your date is open.'
  ],
  metadata: {
    page: window.location.pathname,
    referrer: document.referrer
  },
  i18n: {
    en: {
      title: 'GTA Flower Wall',
      subtitle: 'Nikkah backdrops and ceremony decor. Ask us anything.',
      footer: '',
      getStarted: 'New Conversation',
      inputPlaceholder: 'Type your question…'
    }
  }
});

// Count chat opens next to the other conversion events in GA4.
document.addEventListener('click', function (e) {
  if (e.target.closest && e.target.closest('.chat-window-toggle') && window.gfwTrack) {
    window.gfwTrack('chat_toggle', { page: window.location.pathname });
  }
});
