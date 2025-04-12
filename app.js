const amqp = require('amqplib');
const {sendMessage} = require('./telegram');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE;
const USERNAME = process.env.RABBITMQ_USER;
const PASSWORD = process.env.RABBITMQ_PASSWORD;

async function start() {
    try {
        if (!RABBITMQ_URL || !QUEUE_NAME || !USERNAME || !PASSWORD) {
            throw new Error('RabbitMQ configuration is missing');
        }
        const connectionString = `amqp://${USERNAME}:${PASSWORD}@${RABBITMQ_URL}`;
        const connection = await amqp.connect(connectionString);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, {durable: true});

        console.log(`[*] Listening on ${QUEUE_NAME}`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const message = msg.content.toString();
                console.log(`[x] Received: ${message}`);

                await sendMessage(message);

                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error(`[!] RabbitMQ error:`, err.message);
    }
}

start();
