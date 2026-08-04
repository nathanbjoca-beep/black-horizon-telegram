// POST /.netlify/functions/telegram-connect
// Body: { "publicUsername": "@meucanalvip" }
// Só funciona para canais PÚBLICOS (com @usuario). Canais privados (link t.me/+xxxx)
// só dão pra checar depois que o bot já foi adicionado — use telegram-webhook pra isso.
// Stateless de propósito: não guarda nada, só retorna o status atual na hora.
const tg = require('./_telegram');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Método não permitido' };
  try {
    const { publicUsername } = JSON.parse(event.body || '{}');
    if (!publicUsername) return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Informe "publicUsername".' }) };

    const chat = await tg.getChat(publicUsername);
    const me = await tg.getMe();
    let memberStatus = 'left';
    try {
      const member = await tg.getChatMember(chat.id, me.id);
      memberStatus = member.status;
    } catch (e) {
      // bot ainda não é membro desse canal — resultado válido, não é erro
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        chatId: chat.id,
        title: chat.title,
        botStatus: memberStatus,
        conectado: memberStatus === 'administrator' || memberStatus === 'creator'
      })
    };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
