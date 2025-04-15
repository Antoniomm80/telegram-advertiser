const {GenericContainer} = require('testcontainers');
const amqp = require('amqplib');
const axios = require('axios');
const waitForExpect = require('wait-for-expect');
const {startListener, stopListener} = require('./listener');

jest.setTimeout(30000); // Allow time for containers to spin up
jest.mock('axios');
describe('Telegram Listener E2E', () => {
    let container;
    let rabbitUrl;
    let telegramMock;

    beforeAll(async () => {

        process.env.TELEGRAM_BOT_TOKEN = 'test-bot';
        process.env.TELEGRAM_CHAT_ID = '@test-chat';
        process.env.RABBITMQ_URL = 'amqp://localhost:5672';
        process.env.RABBITMQ_EXCHANGE = 'exchange.home.events';
        process.env.RABBITMQ_QUEUE = 'telegramadvertiser.home.events';
        process.env.RABBITMQ_USER = 'guest';
        process.env.RABBITMQ_PASSWORD = 'guest';
        axios.post.mockResolvedValueOnce({data: {ok: true}});

        // Start RabbitMQ container
        container = await new GenericContainer('rabbitmq')
            .withExposedPorts(5672)
            .start();

        const host = container.getHost();
        const port = container.getMappedPort(5672);
        rabbitUrl = `amqp://${host}:${port}`;


        // Start the listener
        await startListener({url: rabbitUrl, exchange: process.env.RABBITMQ_EXCHANGE, queue: process.env.RABBITMQ_QUEUE});
    });

    afterAll(async () => {
        await stopListener();
        await container.stop();
        telegramMock.restore();
    });

    it('should send message to Telegram when message arrives on RabbitMQ', async () => {
        const conn = await amqp.connect(rabbitUrl);
        const channel = await conn.createChannel();
        await channel.assertExchange('exchange.home.events', 'topic', {durable: true});
        const payload = {
            message: 'Test message content',
            createDate: new Date().toISOString()
        };
        await channel.publish(
            'exchange.home.events',
            'test.routing.key',
            Buffer.from(JSON.stringify(payload))
        );

        await waitForExpect(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                {
                    chat_id: process.env.TELEGRAM_CHAT_ID,
                    text: 'Test message content',
                }
            );
        });

        await channel.close();
        await conn.close();
    });
});
