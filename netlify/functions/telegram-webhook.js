// POST /.netlify/functions/telegram-webhook
// Registre esta URL com setWebhook (veja README). Aqui você só está TESTANDO
// se o evento chega de verdade — ele aparece nos logs da function no painel do Netlify.
// Para usar isso de verdade (guardar o chat_id, atualizar status), precisa de um banco
// externo (ex: Supabase, Neon) — sem isso, cada chamada começa do zero.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método não permitido' };

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const got = event.headers['x-telegram-bot-api-secret-token'];
    if (got !== secret) return { statusCode: 401, body: 'unauthorized' };
  }

  const update = JSON.parse(event.body || '{}');

  if (update.my_chat_member) {
    const { chat, new_chat_member } = update.my_chat_member;
    console.log('[telegram-webhook] my_chat_member:', JSON.stringify({
      chatId: chat.id, title: chat.title, novoStatus: new_chat_member.status
    }));
  } else {
    console.log('[telegram-webhook] update recebido:', JSON.stringify(update));
  }

  return { statusCode: 200, body: 'ok' };
};
