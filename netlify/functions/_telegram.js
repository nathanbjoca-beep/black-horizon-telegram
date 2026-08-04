// telegram.js
// Wrapper fino sobre a Bot API do Telegram. Usa fetch nativo (Node 18+).
// O token NUNCA fica hardcoded aqui — sempre lido de variável de ambiente.

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;

async function call(method, payload) {
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN não configurado nas variáveis de ambiente do Netlify.');
  const res = await fetch(`${BASE_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
  const data = await res.json();
  if (!data.ok) {
    const err = new Error(data.description || ('Erro em ' + method));
    err.telegram = data;
    throw err;
  }
  return data.result;
}

module.exports = {
  getMe: () => call('getMe'),
  getChat: (chatIdOrUsername) => call('getChat', { chat_id: chatIdOrUsername }),
  getChatMember: (chatId, userId) => call('getChatMember', { chat_id: chatId, user_id: userId }),
  sendMessage: (chatId, text) => call('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML' })
};
