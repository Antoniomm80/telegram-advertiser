const {sendMessage} = require('./telegram');


describe('sendMessage', () => {
    beforeEach(() => {
        process.env.TELEGRAM_BOT_TOKEN = 'anActualToken';
        process.env.TELEGRAM_CHAT_ID = 'anActualChatId';
    });

    it('sends a message successfully to Telegram', async () => {

        sendMessage("Hello, Telegram!");
    });
});