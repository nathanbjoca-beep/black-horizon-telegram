// GET /.netlify/functions/telegram-me
// Teste mais simples possível: confirma que o token é válido e mostra o @username do bot.
const tg = require('./_telegram');

exports.handler = async () => {
  try {
    const me = await tg.getMe();
    return { statusCode: 200, body: JSON.stringify({ ok: true, bot: me }) };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
