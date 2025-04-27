const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const {sendMessage, escapeReservedCharacters} = require('../../src/telegram');

jest.mock('axios');

describe('sendMessage', () => {
    it('sends a message successfully to Telegram', async () => {
        axios.post.mockResolvedValueOnce({data: {ok: true}});

        await expect(sendMessage('Hello, Telegram!')).resolves.not.toThrow();
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                "parse_mode": "MarkdownV2",
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
                "parse_mode": "MarkdownV2",
                text: 'Hello, Telegram!',
            }
        );
    });

    it('does not throw when message is empty', async () => {
        axios.post.mockResolvedValueOnce({data: {ok: true}});

        await expect(sendMessage('')).resolves.not.toThrow();
        expect(axios.post).toHaveBeenCalledWith(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                "parse_mode": "MarkdownV2",
                text: '',
            }
        );
    });
});
