// POST /.netlify/functions/telegram-send
// Body: { "chatId": -1001234567890, "text": "Sinal de teste" }
// O chat_id precisa vir explícito porque essa function não guarda estado entre chamadas.
// Pegue o chatId a partir do retorno de telegram-connect (canal público) ou do
// log do telegram-webhook (canal privado, depois que o bot foi adicionado lá).
const tg = require('./_telegram');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método não permitido' };
  try {
    const { chatId, text } = JSON.parse(event.body || '{}');
    if (!chatId || !text) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Informe "chatId" e "text".' }) };

    const result = await tg.sendMessage(chatId, text);
    return { statusCode: 200, body: JSON.stringify({ ok: true, messageId: result.message_id }) };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
