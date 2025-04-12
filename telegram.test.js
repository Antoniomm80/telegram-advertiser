const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { sendMessage } = require('./telegram');

jest.mock('axios');

describe('sendMessage', () => {
    it('sends a message successfully to Telegram', async () => {
        axios.post.mockResolvedValueOnce({ data: { ok: true } });

        await expect(sendMessage('Hello, Telegram!')).resolves.not.toThrow();
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: 'Hello, Telegram!',
            }
        );
    });

    it('handles Telegram API errors gracefully', async () => {
        axios.post.mockRejectedValueOnce(new Error('Network Error'));

        await expect(sendMessage('Hello, Telegram!')).resolves.not.toThrow();
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: 'Hello, Telegram!',
            }
        );
    });

    it('does not throw when message is empty', async () => {
        axios.post.mockResolvedValueOnce({ data: { ok: true } });

        await expect(sendMessage('')).resolves.not.toThrow();
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: '',
            }
        );
    });
});