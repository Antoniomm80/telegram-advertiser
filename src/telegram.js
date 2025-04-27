// telegram.js
const axios = require('axios');


async function sendMessage(message) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    try {

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'MarkdownV2',
        });
        console.log(`[+] Message sent to Telegram`);
    } catch (err) {
        console.error(`[!] Telegram error:`, err.message);
    }
}


module.exports = {sendMessage};
